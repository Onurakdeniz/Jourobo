import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

    const storyInformation = await prisma.story.findUnique({
      where: { id: storyId },
      select: {
        bookmarkAmount: true,
        voteAmount: true,
        views: true,
        createdAt: true,
      },
    });

    try {
      // Fetch runs related to the storyId
      const runs = await prisma.run.findMany({
        where: {
          storyId: storyId,
        },
        include: {
          sources: {
            include: {
              casts: true, // Include casts for each source
            },
          },
          results: {
            include: {
              sourcePost: {
                include: {
                  author: true, // Include author information for each source post
                },
              },
              LLMResponse: {
                select: {
                  content: {
                    select: {
                      summary: true, /// Include the summary field
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Extract source posts, their authors, and summary from the runs
      const sourcePostsAndAuthors = runs.flatMap((run) =>
        run.results.flatMap((result) =>
          result.sourcePost.map((post) => ({
            postId: post.id,
            postContent: post.content,
            postCreatedAt: post.timestamp,
            postLikes: post.likes,
            postReCasts: post.reCasts,
            postHash: post.hash,
            authorId: post.author.fid,
            authorFollowers: post.author.followers,
            authorActive: post.author.activeStatus,
            authorFollowing: post.author.following,
            authorVerifications: post.author.verifications,
            authorBio: post.author.bioText,
            authorAvatar: post.author.avatarUrl,
            authorUserName: post.author.userName,
            authorDisplayName: post.author.displayName,
          }))
        )
      );

      const summary = runs[0]?.results[0]?.LLMResponse[0]?.content[0]?.summary;
      const inputType = runs[0]?.sources[0]?.casts[0]?.inputType;
      const sourceId = runs[0]?.sources[0]?.casts[0]?.inputs;
      const source  : { sourceId: string, inputType: string } = { sourceId, inputType };
      const sortedPostsAndAuthors = sourcePostsAndAuthors.sort(
        (a, b) => b.postLikes - a.postLikes
      );

      return new NextResponse(
        JSON.stringify({
          posts: sortedPostsAndAuthors,
          summary,
          source,
          storyInformation,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Failed to fetch source posts and authors:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
