import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/authMiddleware";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "latest";

    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        agencyId: true,
        created: true,
        userName: true,
        followers: {
          select: {
            id: true,
          },
        },
        profile: {
          select: {
            id: true,
            description: true,
            avatarUrl: true,
            name: true,
          },
        },
      },
    });

    const agentsWithFollowersCount = agents.map((agent) => ({
      ...agent,
      followersCount: agent.followers.length,
    }));

    let sortedAgents;
    if (type === "trending") {
      sortedAgents = [...agentsWithFollowersCount].sort(
        (a, b) => b.followersCount - a.followersCount
      );
    } else {
      // 'latest'
      sortedAgents = [...agentsWithFollowersCount].sort(
        (a, b) => b.created.getTime() - a.created.getTime()
      );
    }
 
    return NextResponse.json(sortedAgents, { status: 200 });
  } catch (error) {
    console.error(
      `GET request failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
