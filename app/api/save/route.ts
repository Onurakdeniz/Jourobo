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

    // Parse the request body to get storyId
    const requestBody = await req.json();
    const { storyId } = requestBody;
    console.log('storyId', storyId);
    if (!storyId) {
      return NextResponse.json({ error: "Missing storyId" }, { status: 400 });
    }

    // Check if a bookmark exists for this story by the current user
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId: currentUser.id,
        storyId: storyId,
      },
    });

    if (!existingBookmark) {
      // If no bookmark exists, create a new one
      const newBookmark = await prisma.bookmark.create({
        data: {
          userId: currentUser.id,
          storyId: storyId,
          bookmarked : true,
        },
      });

      // Increment the bookmarks count in the story model
      await prisma.story.update({
        where: {
          id: storyId,
        },
        data: {
          bookmarkAmount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ message: "Story saved successfully", bookmark: newBookmark }, { status: 200 });
    } else {
      // If a bookmark exists, delete it
      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });

      // Decrement the bookmarks count in the story model
      await prisma.story.update({
        where: {
          id: storyId,
        },
        data: {
          bookmarkAmount: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({ message: "Story unsaved successfully" }, { status: 200 });
    }
  } catch (error) {
    console.error('Failed to toggle save/unsave story:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}