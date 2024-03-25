import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
      return currentUser;
    }
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const requestBody = await req.json();
    const { storyId, voteAction } = requestBody;
    if (!storyId || !voteAction) {
      return NextResponse.json(
        { error: "Missing storyId or voteAction" },
        { status: 400 }
      );
    }

    // Check if a vote already exists for this story by the current user
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: currentUser.id,
        storyId: storyId,
      },
    });
    if (!existingVote) {
      // If there is no existing vote, create a new vote
      const newVote = await prisma.vote.create({
        data: {
          vote: voteAction.toUpperCase(),
          storyId: storyId,
          userId: userId,
        },
      });

      // Update the voteAmount in the Story model
      await prisma.story.update({
        where: {
          id: storyId,
        },
        data: {
          voteAmount: {
            increment: voteAction.toUpperCase() === "UP" ? 1 : -1,
          },
        },
      });

      return NextResponse.json(
        { message: `Vote created successfully` },
        { status: 200 }
      );
    } else {
      if (existingVote.vote === voteAction.toUpperCase()) {
        // If the current vote matches the action, delete the vote
        await prisma.vote.delete({
          where: {
            id: existingVote.id,
          },
        });

        // Update the voteAmount in the Story model
        await prisma.story.update({
          where: {
            id: storyId,
          },
          data: {
            voteAmount: {
              increment: voteAction.toUpperCase() === "UP" ? -1 : 1,
            },
          },
        });

        return NextResponse.json(
          { message: `Vote deleted successfully` },
          { status: 200 }
        );
      } else {
        // If the current vote does not match the action, update the vote
        const updatedVote = await prisma.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            vote: voteAction.toUpperCase(),
          },
        });

        // Update the voteAmount in the Story model based on the vote change
        await prisma.story.update({
          where: {
            id: storyId,
          },
          data: {
            voteAmount: {
              increment: voteAction.toUpperCase() === "UP" ? 2 : -2,
            },
          },
        });

        return NextResponse.json(
          { message: `Vote updated successfully` },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.error("Failed to process vote:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
