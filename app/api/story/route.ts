import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/authMiddleware";
import { Prisma } from "@prisma/client";

// GET Handler
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }

    // Pagination setup
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = 30; // Items per page
    const skip = (page - 1) * pageSize;
    const sort = req.nextUrl.searchParams.get("sort");

    let orderBy: Prisma.StoryOrderByWithRelationInput[];
    if (sort === "trending") {
      orderBy = [{ votes: { _count: { _asc: Prisma.SortOrder.DESC } } }];
    } else {
      orderBy = [{ createdAt: Prisma.SortOrder.DESC }];
    }
    
    const stories = await prisma.story.findMany({
      skip,
      take: pageSize,
      include: {
        author: {
          include: {
            profile: true,
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
        votes: true,
        _count: {
          select: {
            bookmarks: true,
            votes: true,
          },
        },
      },
    });
    
    // Sort stories based on the vote count
    let sortedStories;
    if (sort === "trending") {
      sortedStories = stories.sort((a, b) => b._count.votes - a._count.votes);
    } else {
      sortedStories = stories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Return the sorted stories
    return new NextResponse(JSON.stringify(sortedStories), {
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