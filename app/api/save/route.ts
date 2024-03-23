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

    if (!storyId) {
      return NextResponse.json({ error: "Missing storyId" }, { status: 400 });
    }

    // Check if a vote already exists for this story by the current user
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: currentUser.id,
        storyId: storyId,
      },
    });

    // If a vote doesn't exist, we proceed to check the bookmark status
    if (!existingVote) {
      const existingBookmark = await prisma.bookmark.findFirst({
        where: {
          userId: currentUser.id,
          storyId: storyId,
        },
      });

      if (existingBookmark) {
        // If a bookmark exists, toggle its 'bookmarked' status
        const updatedBookmark = await prisma.bookmark.update({
          where: {
            id: existingBookmark.id,
          },
          data: {
            bookmarked: !existingBookmark.bookmarked,
          },
        });
        const action = updatedBookmark.bookmarked ? "saved" : "unsaved";
        return NextResponse.json({ message: `Story ${action} successfully`, bookmark: updatedBookmark }, { status: 200 });
      } else {
        // If no bookmark exists, create a new one with 'bookmarked' set to true
        const newBookmark = await prisma.bookmark.create({
          data: {
            userId: currentUser.id,
            storyId: storyId,
            bookmarked: true,
          },
        });
        return NextResponse.json({ message: "Story saved successfully", bookmark: newBookmark }, { status: 200 });
      }
    } else {
      // If a vote exists, we don't allow toggling the bookmark status
      return NextResponse.json({ error: "Cannot toggle bookmark status after voting" }, { status: 403 });
    }
  } catch (error) {
    console.error('Failed to toggle save/unsave story:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}