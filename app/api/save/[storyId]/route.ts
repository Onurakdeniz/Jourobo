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
      // Check if the story is bookmarked by the user
      const bookmarkStatus = await prisma.bookmark.findFirst({
        where: {
          userId: currentUser.id,
          storyId: storyId,
          bookmarked: true, // Assuming you want to check if it's actively bookmarked
        },
      });

      return new NextResponse(JSON.stringify({ isBookmarked: !!bookmarkStatus }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to check bookmark status:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  } catch (error) {
    console.error('Failed to authenticate user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}