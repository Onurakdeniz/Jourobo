import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware } from "@/lib/authMiddleware";

export async function GET(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser; // Early return if authMiddleware returned a NextResponse (error or unauthorized)
    }

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { storyId } = params;

    try {
      // Check the vote status of the story by the user
      const voteStatus = await prisma.vote.findFirst({
        where: {
          userId: currentUser.id,
          storyId: storyId,
        },
        select: {
          vote: true, // We only need the vote field to determine the status
        },
      });

      // If voteStatus is not null, we return the vote type. Otherwise, return null or a specific value indicating no vote.
      const voteType = voteStatus ? voteStatus.vote : null;

      return new NextResponse(JSON.stringify({ voteType }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to check vote status:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  } catch (error) {
    console.error('Failed to authenticate user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
