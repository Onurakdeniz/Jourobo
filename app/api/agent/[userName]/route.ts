import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { CreateAgentSchema } from "@/schemas";
import * as z from "zod";
import { authMiddleware } from "@/lib/authMiddleware";
import { getAgentByAgentUserName } from "@/data/agent";

 

interface UserProfile {
  fid: number;
  userName: string;
  avatarUrl?: string | null;
}
interface AgentResponse {
  id: string;
  agencyId?: number;
  created?: Date;
  userName: string;
  followersCount : number;
  storyCount?: number;
  profile?: {
    id: number;
    description?: string;
    avatarUrl?: string;
    name?: string;
  };
 
  userProfile?: UserProfile;
}

// Improved error handling and response formatting
const errorResponse = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

export async function GET(
  req: NextRequest,
  { params }: { params: { userName: string } }
) {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) return currentUser;
    if (!currentUser) return errorResponse("User not found", 404);

    const url = new URL(req.url);
    const { userName } = params;
    const agentName = userName
    console.log(agentName, "agentName");

    const details = url.searchParams.get("details") === "true";

    if (!agentName) return errorResponse("Agent name is required", 400);

    const response:  any | null = details
    ? await getAgentByAgentUserName(agentName)
    : await fetchBasicAgentInfo(agentName);

    console.log(response, "response");

    if (!response) return errorResponse("Agent not found", 404);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(
      `GET request failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
    return errorResponse("Internal Server Error", 500);
  }
}

 
async function fetchBasicAgentInfo(
  agentName: string
): Promise<AgentResponse | null> {
  const agent = await prisma.agent.findFirst({
    where: { userName: agentName },
    select: {
      id: true,
      agencyId: true,
      created: true,
      userName: true,
      followers: { select: { id: true } },
      profile: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          description: true,
        },
      },
    },
  });

  if (!agent) {
    return null;
  }

  const owners = await prisma.agencyOwner.findMany({
    where: {
      agencyId: agent.agencyId,
    },
    select: {
      userId: true,
      agencyId: true,
      user: {
        select: {
          profile: {
            select: {
              fid: true,
              userName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  const followersCount = await prisma.follow.count({
    where: { agentId: agent.id },
  });

  const storyCount = await prisma.storyAuthor.count({
    where: {
      authorId: agent.id,
    },
  });

 

  const userProfiles = owners.map((owner) => {
    return owner.user && owner.user.profile
      ? {
          fid: owner.user.profile.fid,
          userName: owner.user.profile.userName,
          avatarUrl: owner.user.profile.avatarUrl,
        }
      : undefined;
  });

  return {
    ...agent,
    id: agent.id,
    agencyId: Number(agent.agencyId),
    followersCount,
    storyCount,
    userProfile : userProfiles[0],
    profile: agent.profile
      ? {
          ...agent.profile,
          id: Number(agent.profile.id),
          avatarUrl: agent.profile.avatarUrl || undefined,
        }
      : undefined,
    
 
  };
}