import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/authMiddleware";

// Handler for follow/unfollow actions
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const {
      agentId,
      action,
    }: { agentId: string; action: "follow" | "unfollow" } = await req.json();

    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }
 
    switch (action) {
      case "follow":
        // Check if the user is already following the agent
        const existingFollow = await prisma.follow.findFirst({
          where: {
            userId: currentUser.id,
            agentId: agentId,
          },
        });

        if (!existingFollow) {
          // Create a new follow relationship if it doesn't exist
          await prisma.follow.create({
            data: {
              userId: currentUser.id,
              agentId: agentId,
            },
          });
        }
        break;

      case "unfollow":
        // Delete the follow relationship if it exists
        await prisma.follow.deleteMany({
          where: {
            userId: currentUser.id,
            agentId: agentId,
          },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(
      { message: `Successfully ${action}ed the agent.` },
      { status: 200 }
    );
  } catch (error) {
    console.error(`POST request failed with error: ${error}.`);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}
