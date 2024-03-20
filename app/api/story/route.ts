import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/authMiddleware";

// GET Handler
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }

    const sort = req.nextUrl.searchParams.get("sort");
    let orderBy;
    if (sort === "trending") {
      orderBy = { /* Your logic here to handle trending without direct _count usage */ };
    } else {
      orderBy = [{ createdAt: 'desc' }];
    }

    const stories = await prisma.story.findMany({
      orderBy: orderBy,
      include: {
        agent: {
          include: {
            profile: true,
            agency: true,
          },
        },
        run: {
          include: {
            results: {
              include: {
                sourcePost: {
                  include: {
                    author: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Assuming you need to fetch counts for bookmarks and votes separately
    const updatedStories = await Promise.all(stories.map(async (story) => {
      const bookmarksCount = await prisma.bookmark.count({
        where: { storyId: story.id },
      });
      const votesCount = await prisma.vote.count({
        where: { storyId: story.id },
      });

      // Add bookmarks and votes counts directly to the story object
      return {
        ...story,
        bookmarks: bookmarksCount,
        votes: votesCount,
      };
    }));

    return new NextResponse(JSON.stringify(updatedStories), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}