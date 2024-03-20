import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { CreateAgentSchema } from "@/schemas";
import * as z from "zod";
import { authMiddleware } from "@/lib/authMiddleware";
import { signOpenAIKey } from "@/lib/signOpenAIKey";

type CreateAgentData = z.infer<typeof CreateAgentSchema>;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { agencyId, action = "createAgent", ...data } = await req.json();
    const agencyUserName = agencyId;
    const currentUser = await authMiddleware(req);

 

    // Ensure currentUser is not a NextResponse before proceeding
    if (!("id" in currentUser)) {
      // Handle the case where currentUser does not have an id (e.g., not authenticated)
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

 

    const isOwner = await isAgencyOwner(currentUser.id, agencyUserName);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Unauthorized: User is not the agency owner" },
        { status: 403 }
      );
    }

 
    switch (action) {
      case "createAgent":
        const agent = await createAgentByAgencyUserName(
          data as CreateAgentData,
          agencyUserName
        );
        return NextResponse.json(agent, { status: 201 });
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error("Error in processing request:", error);
    let errorMessage = "An error occurred during the process.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      {
        message: errorMessage,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

async function isAgencyOwner(
  userId: string,
  agencyUserName: string
): Promise<boolean> {
  try {
    const agency = await prisma.agency.findUnique({
      where: {
        userName: agencyUserName,
      },
    });
    // Early return false if the agency doesn't exist
    if (!agency) return false;

    const ownerRecord = await prisma.agencyOwner.findUnique({
      where: {
        userId_agencyId: {
          userId,
          agencyId: agency.id,
        },
      },
    });

    return !!ownerRecord;
  } catch (error) {
    console.error(
      `Error checking agency ownership: ${(error as Error).message}`
    );
    throw error;
  }
}

async function createAgentByAgencyUserName(
  data: CreateAgentData,
  agencyUserName: string
): Promise<any> {
  const { userName, aiModel, profile, categories } = data;

  try {

    // implement later...
    
    // Sign the OpenAI API key
// const signedApiKey = await signOpenAIKey(aiModel.apiKey, userName);

    return await prisma.agent.create({
      data: {
        userName,
        agency: {
          connect: {
            userName: agencyUserName,
          },
        },
        aiModels: {
          create: {
            llm: aiModel.llm,
            model: aiModel.model,
            apiKey: ""
          },
        },
        profile: {
          create: profile,
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
  } catch (error) {
    console.error(
      `Agent creation failed with error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw new Error("Agent creation failed");
  } finally {
    await prisma.$disconnect();
  }
}

export { createAgentByAgencyUserName };