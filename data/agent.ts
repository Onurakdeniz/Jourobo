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
        agency: {
          include: {
            owners: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
        aiModels: true,
        prompts: true,
        categories: true,
        tasks: {
          include: {
            runs: {
              include: {
                story: true, // Include related Story record for each Run
              },
            },
          },
        },
      },
    });

    if (!agent) {
      throw new Error("Agent not found");
    }

    const storyCount = await prisma.storyAuthor.count({
      where: {
        authorId: agent.id,
      },
    });

    const followersCount = await prisma.follow.count({
      where: {
        agentId: agent.id,
      },
    });

    const ownerProfiles = agent.agency.owners.map((owner) => {
      if (owner.user.profile) {
        const { fid, userName , avatarUrl } = owner.user.profile;
        return { fid, userName , avatarUrl };
      }
    }).filter(Boolean); // Filter out null values


    // Create a new array of tasks with the runsCount and totalViews properties
    const tasksWithRunsCountAndViews = agent.tasks.map(task => ({
      ...task,
      runsCount: task.runs.length,
      totalViews: task.runs.reduce((total, run) => total + (run.story ? run.story.views : 0), 0),
    }));

    // Create a new agent object with the tasksWithRunsCountAndViews and storyCount properties
    const agentWithCountsAndViews = { ...agent, tasks: tasksWithRunsCountAndViews, storyCount, followersCount ,ownerProfiles };

    return agentWithCountsAndViews;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Agent retrieval failed with error: ${error.message}`);
    } else {
      console.error("Agent retrieval failed with an unknown error");
    }
    throw new Error("Agent retrieval failed");
  }
}