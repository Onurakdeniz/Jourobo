import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware } from "@/lib/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser; // Early return if authMiddleware returned a NextResponse (error or unauthorized)
    }

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse the request body to get storyId and voteAction
    const requestBody = await req.json();
    const { storyId, voteAction } = requestBody;

    if (!storyId || !voteAction) {
      return NextResponse.json({ error: "Missing storyId or voteAction" }, { status: 400 });
    }

    // Validate voteAction
    if (!['UP', 'DOWN', 'NONE'].includes(voteAction.toUpperCase())) {
      return NextResponse.json({ error: "Invalid voteAction. Must be 'UP', 'DOWN', or 'NONE'" }, { status: 400 });
    }

    // Check if a vote already exists for this story by the current user
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: currentUser.id,
        storyId: storyId,
      },
    });

    if (existingVote) {
      // If a vote exists, check the current vote status
      if (existingVote.vote === voteAction.toUpperCase()) {
        // If the current vote status matches the action, reset vote to NONE
        const updatedVote = await prisma.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            vote: 'NONE',
          },
        });
        return NextResponse.json({ message: `Vote reset successfully`, vote: updatedVote }, { status: 200 });
      } else {
        // If the current vote status does not match the action, update the vote
        const updatedVote = await prisma.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            vote: voteAction.toUpperCase(),
          },
        });
        return NextResponse.json({ message: `Vote updated successfully`, vote: updatedVote }, { status: 200 });
      }
    } else {
      // If no vote exists, create a new one unless the action is NONE
      if (voteAction.toUpperCase() === 'NONE') {
        return NextResponse.json({ error: "Cannot set vote to NONE without an existing vote" }, { status: 400 });
      } else {
        const newVote = await prisma.vote.create({
          data: {
            userId: currentUser.id,
            storyId: storyId,
            vote: voteAction.toUpperCase(),
          },
        });
        return NextResponse.json({ message: "Vote added successfully", vote: newVote }, { status: 200 });
      }
    }
  } catch (error) {
    console.error('Failed to process vote:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}