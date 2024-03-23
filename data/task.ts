import { CreateTaskSchema } from "@/schemas";
import { z } from "zod";
import   prisma  from "@/lib/prisma";

 
type CreateTaskData = z.infer<typeof CreateTaskSchema>;

export async function createTaskByAgentUserName(data: CreateTaskData, agentUserName: string): Promise<any> {
  try {
    // Assuming the agentId is required, we first find the agent based on userName
    const agent = await prisma.agent.findUnique({
      where: { userName: agentUserName },
    });

    if (!agent) {
      throw new Error(`Agent with userName ${agentUserName} not found`);
    }

     

    // Now, create the task with the associated story and runs
    const task = await prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        isOneTimeRun: !data.isStaticRun,
        interval: data.interval ? parseInt(data.interval, 10) : undefined,
        Agent: {
          connect: { userName: agentUserName },
        },
        Prompt: {
          create: {
            agent: { connect: { userName: agentUserName } },
            promptMessage: {
              create: {
                content: data.prompt.promptMessage.content,
              },
            },
            systemMessage: data.prompt.systemMessage && data.prompt.systemMessage.content ? {
              create: [{ content: data.prompt.systemMessage.content }],
            } : undefined,
          },
        },
        AIModel: {
          create: {
            llm: data.aiModel.llm || '',
            model: data.aiModel.model || '',  
            apiKey: data.aiModel.apiKey || '', 
          },
        },
       
      },
    });

    return task;
  } catch (error) {
    console.error("Error in creating task:", error);
    throw new Error(`Failed to create task: ${error.message}`);
  }
}


export async function isUserOwnerOfAgent(
    userId: string,
    agentId: string
  ): Promise<boolean> {
    // Check if the agent belongs to an agency owned by the current user
    const agencyOwner = await prisma.agencyOwner.findFirst({
      where: {
        userId,
        agency: {
          agents: {
            some: {
              userName: agentId,
            },
          },
        },
      },
    });
  
    return !!agencyOwner;
  }

  