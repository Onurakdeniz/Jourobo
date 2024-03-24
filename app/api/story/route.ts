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

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const sort = req.nextUrl.searchParams.get("sort");

    let orderBy: Prisma.StoryOrderByWithRelationInput[];
    if (sort === "trending") {
      orderBy = [{ votes: { _count: 'desc' } }];
    } else {
      orderBy = [{ createdAt: 'desc' }];
    }
    
    
    const stories = await prisma.story.findMany({
      skip,
      take: pageSize,
      where: {
        status: 'CREATED',
      },
      include: {
        author: {
          include: {
            profile: true,
            // Include the _count property to count followers and storiesAuthored
            _count: {
              select: {
                followers: true, // Count the number of followers
                storiesAuthored: true, // Count the number of stories authored
              }
            }
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
      orderBy,
    });
 
    console.log(stories[0]?.bookmarkAmount); // Safely access the first story
    console.log(stories[0]?.voteAmount);

    return new NextResponse(JSON.stringify(stories), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}