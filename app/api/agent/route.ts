import { privy } from "@/lib/privy";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { CreateAgentSchema } from "@/schemas";
import * as z from "zod";
import { authMiddleware } from "@/lib/authMiddleware";

type CreateAgentData = z.infer<typeof CreateAgentSchema>;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Extracting the JSON body from the request
    const { agencyId, action = "createAgent", ...data } = await req.json();

    console.log("agencyId", agencyId);
    console.log("data", data);

    // Authentication and user validation
    const currentUser = await authMiddleware(req);

    // Handle different actions based on the 'action' parameter
    switch (action) {
      case "createAgent":
        const agent = await createAgentByAgencyId(
          data as CreateAgentData,
          agencyId as string
        );
        return NextResponse.json(agent, { status: 201 });
      // Handle other actions as needed...
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error("Error creating agent:", error);
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new NextResponse(
      JSON.stringify({
        message: "Error creating agent",
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

async function createAgentByAgencyId(
  data: CreateAgentData,
  agencyId: string
): Promise<any> {
  const { userName, aiModel, profile, categories } = data;

  try {
    return await prisma.agent.create({
      data: {
        userName,
        agency: {
          connect: {
            userName: agencyId,
          },
        },
        aiModels: {
          create: {
            llm: aiModel.llm,
            model: aiModel.model,
            apiKey: aiModel.apiKey,
          },
        },
        profile: {
          create: {
            name: profile.name,
            avatarUrl: profile.avatarUrl,
            description: profile.description,
            defaultInstructions: profile.defaultInstructions,
          },
        },
        ...(categories && categories.length > 0
          ? {
              categories: {
                connectOrCreate: categories.map((categoryName) => ({
                  where: { name: categoryName },
                  create: { name: categoryName },
                })),
              },
            }
          : {}),
      },
    });
  } catch (error: unknown) {
    let errorMessage = 'Agent creation failed';
    if (error instanceof Error) {
      console.error(`Agent creation failed with error: ${error.message}`);
      errorMessage = error.message;
    } else {
      console.error(`Agent creation failed with error: ${error}`);
    }
    throw new Error(errorMessage);
  }
}

function handleError(error: Error): NextResponse {
  let statusCode: number;
  switch (error.message) {
    case "Unauthorized: User ID not found":
      statusCode = 401;
      break;
    case "User not found":
      statusCode = 404;
      break;
    case "Agent creation failed":
      statusCode = 500;
      break;
    default:
      statusCode = 500;
  }
  return NextResponse.json({ error: error.message }, { status: statusCode });
}
