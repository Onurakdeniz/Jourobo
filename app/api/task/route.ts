import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/authMiddleware";
import { CreateTaskSchema } from "@/schemas";
import { createTaskByAgentUserName, isUserOwnerOfAgent } from "@/data/task";
import { client } from "@/trigger";

type CreateTaskData = z.infer<typeof CreateTaskSchema>;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.json();
    const parsedData = CreateTaskSchema.parse(data);

    // Authentication and user validation
    const currentUser = await authMiddleware(req);
    if (!currentUser) {
      throw new Error("Authentication failed");
    }

    const agentUserName = data.agentUsername;
    const userOwnsAgent = await isUserOwnerOfAgent(
      currentUser.id,
      agentUserName
    );
    if (!userOwnsAgent) {
      return new NextResponse(
        JSON.stringify({ message: "User does not own the agent" }),
        {
          status: 403, // Forbidden
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    console.log("parsedData", parsedData);
    // Proceed to create task since user owns the agent
    const task = await createTaskByAgentUserName(parsedData, agentUserName);
    if (task) {
      // Assuming agentId and starterAgentId are available or retrieved from somewhere
      const createStoryByAgentUsername = async (agentUserName: string) => {
        // Find the agent by username
        const agent = await prisma.agent.findUnique({
          where: {
            userName: agentUserName,
          },
        });

        // If no agent is found, throw an error
        if (!agent) {
          throw new Error(`No agent found with username: ${agentUserName}`);
        }

        // Create a story with the found agent as the author
        const storyFetch = await prisma.story.create({
          data: {
            status: "INITIAL",
          },
        });
        
        await prisma.storyAuthor.create({
          data: {
            role: "STARTER", // or "CONTRIBUTOR" depending on the context
            storyId: storyFetch.id,
            authorId: agent.id,
          },
        });
        
        const storyWithAuthor = await prisma.story.findUnique({
          where: {
            id: storyFetch.id,
          },
          include: {
            storyAuthors: {
              include: {
                author: true,
              },
            },
          },
        });
        
        return storyWithAuthor;
      }

      // Usage
      const story = await createStoryByAgentUsername(agentUserName);

      if (!story) {
        throw new Error("Failed to create story");
      }

      const run = await createRunbyTaskIdAndStoryId(task.id, story.id);

      if (!run) {
        throw new Error("Failed to create run");
      }

      const payload = {
        openAIRequest: {
          model: "gpt-4-turbo-preview",
          promptMessage: {
            role: "user",
            title : parsedData.prompt.promptMessage.title,
            content: parsedData.prompt.promptMessage.content,
          },

          toolChoice: "",
          tools: [],
          isStaticRun: parsedData.isStaticRun,
        },
        source: {
          SourceType: parsedData.source.type,
          ids: parsedData.source.ids,
          limit: parsedData.limit || 10,
          isWithRecast: parsedData.isWithRecasts,
        },
      };

      const agent = await prisma.agent.findUnique({
        where: {
          userName: agentUserName,
        },
      });

      if (!agent) {
        throw new Error("No agent found");
      }

      const newSource = await prisma.source.create({
        data: {
          agentId: agent.id,
          run: {
            connect: {
              id: run.id,
            },
          },
          casts: {
            create: [
              {
                inputType: parsedData.source.type,
                inputs: parsedData.source.ids,
                limit: parsedData.limit,
                isWithRecast: parsedData.isWithRecasts,
              },
            ],
          },
        },
      });

      if (!newSource) {
        throw new Error("Failed to create source");
      }
      const send = await client.sendEvent({
        name: "static-task",
        timestamp: new Date(),
        context: {
          runId: run.id,
          taskId: task.id,
          storyId: story.id,
        },
        payload: payload,
      });

      const updateRun = await prisma.run.update({
        where: {
          id: run.id,
        },
        data: {
          status: "RUNNING",
          eventId: send.id,
          eventName: send.name,
        },
      });

      // Return a successful response
      return new NextResponse(JSON.stringify(task), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Error handling POST request:", error);
    let errorMessage = "An error occurred";
    if (error instanceof z.ZodError) {
      errorMessage = error.errors
        .map((e) => `${e.path.join(".")} - ${e.message}`)
        .join("; ");
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new NextResponse(
      JSON.stringify({
        message: "Error processing request",
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function createRunbyTaskIdAndStoryId(
  taskId: string,
  storyId: string
): Promise<any> {
  try {
    // Logic for creating a run related to a task
    const run = await prisma.run.create({
      data: {
        status: "CREATED",
        taskId: taskId,
        storyId: storyId, // Link the run to the created story
      },
    });
    return run;
  } catch (error) {
    console.error("Error in creating run:", error);
    throw error; // Rethrow to handle it in the calling function
  }
}
