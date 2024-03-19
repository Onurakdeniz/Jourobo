import { CreateTaskSchema } from "@/schemas";
import { z } from "zod";
import   prisma  from "@/lib/prisma";

type CreateTaskData = z.infer<typeof CreateTaskSchema>;


export async function createTaskByAgentUserName(data: CreateTaskData, agentUserName: string): Promise<any> {
  try {
    // Logic for creating a task related to an agent
    const taskWithRun = await prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        isOneTimeRun: !data.isStaticRun,
        interval: data.interval ? parseInt(data.interval, 10) : undefined,
        Agent: {
          connect: { userName: agentUserName }
        },
        Prompt: {
          create: {
            prompt: data.prompt.promptMessage.content,
            agent: { connect: { userName: agentUserName } },
            promptMessage: {
              create: {
                content: data.prompt.promptMessage.content
              }
            },
            ...(data.prompt.systemMessage && {
              systemMessage: {
                create: data.prompt.systemMessage.content ? [{
                  content: data.prompt.systemMessage.content
                }] : []
              }
            })
          }
        },
        AIModel: {
          create: {
            llm: data.aiModel.llm || '',
            model: data.aiModel.model || '',  
            apiKey: data.aiModel.apiKey || '', 
          }
        },
        runs: {
          create: [{
            status: 'PENDING', // Setting the run's status to PENDING
            sources: {
              create: [{
                type: data.source.type,
                ids: data.source.ids,
                agent: { connect: { userName: agentUserName } },
                // Assuming you might have a scrapperRunId or similar logic to connect
                // If not needed, you can adjust this part
              }]
            }
          }]
        },
      },
    });
    
    return taskWithRun;
    
  } catch (error) {
    console.error("Error in creating task:", error);
    throw new Error("Failed to create task");
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