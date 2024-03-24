import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware } from "@/lib/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const requestBody = await req.json();
    const { storyId, voteAction } = requestBody;
    if (!storyId || !voteAction) {
      return NextResponse.json({ error: "Missing storyId or voteAction" }, { status: 400 });
    }

    if (!['UP', 'DOWN'].includes(voteAction.toUpperCase())) {
      return NextResponse.json({ error: "Invalid voteAction. Must be 'UP' or 'DOWN'" }, { status: 400 });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: currentUser.id,
        storyId: storyId,
      },
    });

    if (existingVote) {
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
              decrement: 1,
            },
          },
        });

        return NextResponse.json({ message: `Vote deleted successfully` }, { status: 200 });
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
              increment: voteAction.toUpperCase() === 'UP' ? 2 : -2,
            },
          },
        });

        return NextResponse.json({ message: `Vote updated successfully`, vote: updatedVote }, { status: 200 });
      }
    } else {
      // If no vote exists, create a new one
      const newVote = await prisma.vote.create({
        data: {
          userId: currentUser.id,
          storyId: storyId,
          vote: voteAction.toUpperCase(),
        },
      });

      // Update the voteAmount in the Story model
      await prisma.story.update({
        where: {
          id: storyId,
        },
        data: {
          voteAmount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ message: "Vote added successfully", vote: newVote }, { status: 200 });
    }
  } catch (error) {
    console.error('Failed to process vote:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}