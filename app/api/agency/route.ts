import { privy } from "@/lib/privy";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateAgencySchema, EditAgencySchema, AgencySchema } from "@/schemas";
import { authMiddleware } from "@/lib/authMiddleware";

// GET Handler
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }
    const agencies = await getAgenciesByUserId(currentUser.id);
 
    return NextResponse.json({ agencies }, { status: 200 });
  } catch (error) {
    console.error(`GET request failed with error: ${error}.`);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

// POST Handler

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const {
      id,
      action,
      data,
    }: { id?: string; action: "create" | "update"; data: any } =
      await req.json();

    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }
 
    const agency = await upsertAgency(data, currentUser.id, action, id);
    return NextResponse.json({ agency }, { status: 200 });
  } catch (error) {
    console.error(`POST request failed with error: ${error}.`);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}

// DELETE Handler
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }

    const { id } = await req.json();
    if (!id || !currentUser) {
      return NextResponse.json(
        { message: "Agency ID or User ID not provided" },
        { status: 400 }
      );
    }

    const existingAgency = await prisma.agency.findUnique({
      where: { id },
      include: { owners: true },
    });

    if (!existingAgency) {
      return NextResponse.json(
        { message: "Agency not found" },
        { status: 404 }
      );
    }

    // Using a transaction to ensure data integrity
    await prisma.$transaction(async (prisma) => {
      if (existingAgency.owners.length > 1) {
        // If the agency has multiple owners, remove the current user from the owners list
        await prisma.agencyOwner.delete({
          where: {
            userId_agencyId: {
              userId: currentUser.id, // Assuming `currentUser.id` gives the user's ID
              agencyId: id,
            },
          },
        });
      } else if (
        existingAgency.owners.length === 1 &&
        existingAgency.owners[0].userId === currentUser.id
      ) {
        // If the current user is the sole owner, delete all related entries first to avoid foreign key constraint failure
        await prisma.agencyOwner.deleteMany({
          where: { agencyId: id },
        });
        // Now safe to delete the agency
        await prisma.agency.delete({
          where: { id },
        });
      } else {
        // If the conditions are not met, throw an error to be caught by the catch block
        throw new Error("Unauthorized to delete agency");
      }
    });

    return NextResponse.json(
      { message: "Operation completed successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(`DELETE request failed with error: ${error}`);
    let errorMessage = "Operation failed";
    if (error instanceof Error) {
      errorMessage = error.message === "Unauthorized to delete agency" ? error.message : "Operation failed";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function upsertAgency(
  data: z.infer<typeof CreateAgencySchema> | z.infer<typeof EditAgencySchema>,
  currentUserId: string,
  action: "create" | "update",
  id?: string
) {
  let agency;
  if (action === "create") {
    agency = await prisma.agency.create({
      data: {
        ...data,
        owners: { create: { userId: currentUserId } },
      },
      include: { owners: true },
    });
  } else if (action === "update") {
    if (!id) {
      throw new Error("Agency id is not available");
    }
    agency = await prisma.agency.update({
      where: { id },
      data: {
        ...data,
        owners: {
          connectOrCreate: {
            where: {
              userId_agencyId: {
                userId: currentUserId,
                agencyId: id,
              },
            },
            create: { userId: currentUserId },
          },
        },
      },
      include: { owners: true },
    });
  } else {
    throw new Error("Invalid action specified.");
  }
  return agency;
}

interface AgencyWithStoryCount {
  id: string;
  name: string;
  createdAt: Date;
  userName: string;
  description: string;
  logo: string;
  owners: {
    user: {
      profile: {
        userName: string;
        displayName: string;
        avatarUrl: string | null;
        fid: number;
      };
    };
  }[];
  agents: {
    id: string;
    profile: {
      userName: string;
      name: string;
      avatarUrl: string | null;
      description: string;
      instructions: string | null;
      focus: string | null;
    };
  }[];
  storyCount: number;
  agentCount: number;
}

async function getAgenciesByUserId(userId: string): Promise<any> {
  const agencies = await prisma.agency.findMany({
    where: { owners: { some: { userId } } },
    include: {
      owners: {
        select: {
          user: {
            include: {
              profile: {
                select: {
                  userName: true,
                  displayName: true,
                  avatarUrl: true,
                  fid: true,
                },
              },
            },
          },
        },
      },
      agents: {
        include: {
          profile: true,
          categories: true,
        },
      },
    },
  });

  const agenciesWithStoryCount: any[] = await Promise.all(
    agencies.map(async (agency) => {
      const agentsWithStoryCount = await Promise.all(
        agency.agents.map(async (agent) => {
          const stories = await prisma.story.findMany({
            where: {
              storyAuthors: {
                some: {
                  authorId: agent.id,
                },
              },
            },
          });

          const task = await prisma.task.findMany({
            where: { agentId: agent.id },
          });

          const taskCount = task.length;

          const storyCount = stories.length;
          const viewCount = stories.reduce(
            (sum, story) => sum + story.views,
            0
          );
          return {
            id: agent.id,
            userName: agent.userName,
            createdAt: agent.created,
            categories: agent.categories,
            profile: agent.profile,
            storyCount,
            viewCount,
            taskCount,
          };
        })
      );

      const agentCount = agency.agents.length;
      const totalStoryCount = agentsWithStoryCount.reduce(
        (sum, agent) => sum + agent.storyCount,
        0
      );

      return {
        id: agency.id,
        name: agency.name,
        createdAt: agency.createdAt,
        description: agency.description,
        logo: agency.logo,
        userName: agency.userName,
        owners: agency.owners.map((owner) => ({
          user: {
            profile: owner.user?.profile || null,
          },
        })),
        agents: agentsWithStoryCount,
        totalStoryCount,
        agentCount,
      };
    })
  );

  return agenciesWithStoryCount;
}
