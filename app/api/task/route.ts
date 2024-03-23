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
 

  /*
if (task) {
  const run = await createRunbyTaskId(task.id);

  const send = await client.sendEvent({
    name: "static-task",
    timestamp: new Date(),
    context: {
      runId: run.id,
      taskId: task.id,
    },
    payload: {
      tempature: 25,  
      outputStyle: "style", 
      model: "model",  
      promptMessage: {
        role: "user", 
        content: "ssds",
      },
      systemMessage: {
        role: "system", 
        content: "content"
      },
      source: {
        sourceType: "type", 
        ids: "nouns",
      },
    },
  });
}
*/
    // Return a successful response
    return new NextResponse(JSON.stringify(task), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
        status: "CREATED", // Setting the run's status to PENDING
        taskId: taskId,
      },
    });

    return run;
  } catch (error) {
    console.error("Error in creating run:", error);
  }
}
