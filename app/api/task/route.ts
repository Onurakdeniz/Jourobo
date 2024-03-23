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

    const agentUserName = data.agentId;
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

    // Proceed to create task since user owns the agent
    const task = await createTaskByAgentUserName(parsedData, agentUserName);
    if (task) {
      // Assuming agentId and starterAgentId are available or retrieved from somewhere
      const story = await createStory(task.agentId, task.starterAgentId);
      const run = await createRunbyTaskIdAndStoryId(task.id, story.id);

      const payload = {
        openAIRequest: {
          model: " ",
          promptMessage: {
            role: "user",
            content: "ssds",
          },
          systemMessage: {
            role: "system",
            content: "content",
          },
          toolChoice: "", // Specify the tool choice here
          tools: [], // Specify any tools here if needed
        },
        source: {
          SourceType: "FARCASTER_CHANNEL",
          ids: "base",
          amount: 15,
          withRecasts: true,
        },
      };

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

 async function createRunbyTaskId(taskId: string): Promise<any> {
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