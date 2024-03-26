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

    if (!existingVote) {
      if (voteAction.toUpperCase() === 'UP') {
        await prisma.vote.create({
          data: {
            userId: currentUser.id,
            storyId: storyId,
            vote: 'UP',
          },
        });
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
        return NextResponse.json({ message: "Vote added successfully" }, { status: 200 });
      } else if (voteAction.toUpperCase() === 'DOWN') {
        await prisma.vote.create({
          data: {
            userId: currentUser.id,
            storyId: storyId,
            vote: 'DOWN',
          },
        });
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
        return NextResponse.json({ message: "Vote added successfully" }, { status: 200 });
      }
    } else {
      if (existingVote.vote === 'UP') {
        if (voteAction.toUpperCase() === 'UP') {
          await prisma.vote.delete({
            where: {
              id: existingVote.id,
            },
          });
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
          return NextResponse.json({ message: "Vote deleted successfully" }, { status: 200 });
        } else if (voteAction.toUpperCase() === 'DOWN') {
          await prisma.vote.update({
            where: {
              id: existingVote.id,
            },
            data: {
              vote: 'DOWN',
            },
          });
          await prisma.story.update({
            where: {
              id: storyId,
            },
            data: {
              voteAmount: {
                decrement: 2,
              },
            },
          });
          return NextResponse.json({ message: "Vote updated successfully" }, { status: 200 });
        }
      } else if (existingVote.vote === 'DOWN') {
        if (voteAction.toUpperCase() === 'DOWN') {
          await prisma.vote.delete({
            where: {
              id: existingVote.id,
            },
          });
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
          return NextResponse.json({ message: "Vote deleted successfully" }, { status: 200 });
        } else if (voteAction.toUpperCase() === 'UP') {
          await prisma.vote.update({
            where: {
              id: existingVote.id,
            },
            data: {
              vote: 'UP',
            },
          });
          await prisma.story.update({
            where: {
              id: storyId,
            },
            data: {
              voteAmount: {
                increment: 2,
              },
            },
          });
          return NextResponse.json({ message: "Vote updated successfully" }, { status: 200 });
        }
      }
    }
  } catch (error) {
    console.error('Failed to process vote:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}