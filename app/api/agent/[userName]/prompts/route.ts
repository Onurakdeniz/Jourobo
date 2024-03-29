import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/authMiddleware";
import { client } from "@/trigger";

export async function GET(
  req: NextRequest,
  { params }: { params: { userName: string } }
) {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { userName } = params;
    console.log(userName,"userName");

    try {
      // Find the agent by userName
      const agent = await prisma.agent.findFirst({
        where: {
            userName,
        },
      });

      if (!agent) {
        return new NextResponse(JSON.stringify({ error: "Agent not found" }), {
          status: 404,
        });
      }

      // Get all prompts for the agent
      const prompts = await prisma.prompt.findMany({
        where: {
          agentId: agent.id,
        },
        include: {
          tools: {
            include: {
              function: true, // Include function details in the response
            },
          },
          promptMessage: true, // Include promptMessage details in the response
        },
      });

      return new NextResponse(JSON.stringify({ prompts }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Failed to get prompts:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userName: string } }
) {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    

    const { userName } = params;

    try {
      // Find the agent by userName
      const agent = await prisma.agent.findFirst({
        where: {
            userName,
        },
      });

      if (!agent) {
        return new NextResponse(JSON.stringify({ error: "Agent not found" }), {
          status: 404,
        });
      }
      const maxTokenDefaultValue = 10000;
      const requestBody = await req.json();
      console.log(requestBody);
      const data = requestBody.data; // Access data directly from requestBody

      const manipulationCheck = await client.sendEvent({
        name: "manipulation-check",
        payload: { prompt: data.message },
      });

      console.log(manipulationCheck, "manipulationCheck");


    


      // Create a new prompt
      const prompt = await prisma.prompt.create({
        data: {
          agentId: agent.id,
          maxTokens: data.maxTokens || maxTokenDefaultValue,
          promptMessage: {
            create: {
              title: data.title,
              content: data.message,
            },
          },
        },
        include: {
          promptMessage: true, // Include promptMessage details in the response
        },
      });

      return new NextResponse(JSON.stringify({ prompt }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Failed to create prompt:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
