import prisma from "@/lib/prisma";
import { getAgentByAgentUserNameSchema } from "@/schemas";

export async function getAgentByAgentUserName(userName: string): Promise<any> {
  try {
    const agent = await prisma.agent.findUnique({
      where: {
        userName: userName,
      },
      include: {
        profile: true,
        agency: true,
        aiModels: true,
        prompts: true,
        categories: true,
        tasks: true,
      },
    });

    if (!agent) {
      throw new Error("Agent not found");
    }

    const storyCount = await prisma.story.count({
      where: {
        agentId: agent.id,
      },
    });

    return { ...agent, storyCount };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Agent retrieval failed with error: ${error.message}`);
    } else {
      console.error("Agent retrieval failed with an unknown error");
    }
    throw new Error("Agent retrieval failed");
  }
}
