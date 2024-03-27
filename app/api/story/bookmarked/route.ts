import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/authMiddleware";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const currentUser = await authMiddleware(req);
    if (!currentUser || currentUser instanceof NextResponse) {
      return currentUser || new NextResponse("Unauthorized", { status: 401 });
    }
    console.log("currentUser", currentUser);

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const bookmarked = req.nextUrl.searchParams.get("bookmarked") === "true";
    console.log("bookmarked", bookmarked);
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: currentUser.id,
        bookmarked: true,
      },
      include: {
        story: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Extract the stories from the bookmarks
    const stories = await Promise.all(
      bookmarks.map((bookmark) =>
        prisma.story.findUnique({
          where: {
            id: bookmark.storyId,
          },
          include: {
            storyAuthors: {
              include: {
                author: {
                  select: {
                    id: true,
                    userName: true,
                    agencyId: true,
                    created: true,
                    profile: true,
                    _count: {
                      select: {
                        followers: true,
                        storyAuthors: true,
                      },
                    },
                  },
                },
              },
            },
            runs: {
              include: {
                results: {
                  include: {
                    sourcePost: {
                      include: {
                        author: true,
                      },
                    },
                    LLMResponse: {
                      include: {
                        content: {
                          include: {
                            categories: {
                              include: {
                                category: true,
                              },
                            },
                            tags: {
                              include: {
                                tag: true,
                              },
                            },
                            annotations: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        })
      )
    );

    return new NextResponse(JSON.stringify(stories), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to process request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
