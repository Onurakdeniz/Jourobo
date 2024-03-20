import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authMiddleware } from "@/lib/authMiddleware";

export async function GET(
    req: NextRequest,
    { params }: { params: { agentId: string } }
  ) {
    try {
        const currentUser = await authMiddleware(req);
        if (currentUser instanceof NextResponse) {
          return currentUser;
        }
    
        if (!currentUser) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

    const { agentId } = params;

    try {
      // Check if the user follows the agent
      const followStatus = await prisma.follow.findFirst({
        where: {
          userId: currentUser.id,
          agentId: agentId,
        },
      });

      return new NextResponse(JSON.stringify({ isFollowing: !!followStatus }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to check follow status:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  } catch (error) {
    console.error('Failed to authenticate user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}