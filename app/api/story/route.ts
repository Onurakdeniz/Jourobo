import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/authMiddleware";
import { Prisma } from "@prisma/client";
import { subDays } from "date-fns";

// GET Handler
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const currentUser = await authMiddleware(req);
    if (currentUser instanceof NextResponse) {
      return currentUser;
    }

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = 100;
    const skip = (page - 1) * pageSize;
    const sort = req.nextUrl.searchParams.get("sort");
    const agentUserName = req.nextUrl.searchParams.get("agent")?.toLowerCase();
    const tagNames = req.nextUrl.searchParams.getAll("tags");
    const storyId = req.nextUrl.searchParams.get("id");
    console.log ("storyId", storyId);

    const orderBy: Prisma.StoryOrderByWithRelationInput[] = sort === "trending"
      ? [{ voteAmount: "desc" }]
      : [{ createdAt: "desc" }];

    const where: Prisma.StoryWhereInput = {
      status: "CREATED",
      ...(agentUserName && {
        storyAuthors: {
          some: {
            author: {
              userName: {
                equals: agentUserName,
                mode: "insensitive",
              },
            },
          },
        },
      }),
      ...(tagNames.length > 0 && {
        runs: {
          some: {
            results: {
              some: {
                LLMResponse: {
                  some: {
                    content: {
                      some: {
                        tags: {
                          some: {
                            tag: {
                              name: {
                                in: tagNames,
                                mode: "insensitive",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    };

    if (storyId) {
      const story = await prisma.story.findUnique({
        where: {
          id: storyId,
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
      });

      if (!story) {
        return NextResponse.notFound();
      }

      return NextResponse.json(story);
    }

    const stories = await prisma.story.findMany({
      skip,
      take: pageSize,
      where,
      orderBy,
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
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
      },
      {
        status: 500,
      }
    );
  }
}