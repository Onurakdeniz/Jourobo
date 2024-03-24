import { NeynarAPIClient, FilterType, FeedType } from "@neynar/nodejs-sdk";
import { AxiosError } from "axios";
import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import z from "zod";
import prisma from "@/lib/prisma";
const neynarKey = process.env.NEYNAR_API_KEY;
const sdk = require("api")("@neynar/v2.0#1n1mn62ulu07mqsq");
import { OpenAI } from "@trigger.dev/openai";

if (!neynarKey) {
  throw new Error("NEYNAR_API_KEY is not defined");
}

const clientN = new NeynarAPIClient(neynarKey);

const openai = new OpenAI({
  id: "openai",
  apiKey: process.env.OPENAI_API_KEY!,
});

enum SourceType {
  FARCASTER_USER = "FARCASTER_USER",
  FARCASTER_POST = "FARCASTER_POST",
  FARCASTER_CHANNEL = "FARCASTER_CHANNEL",
}

client.defineJob({
  id: "agent-static-task",
  name: "Agent Static Task",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "static-task",
    schema: z.object({
      openAIRequest: z.object({
        model: z.string(),
        maxTokens: z.number().optional(),
        promptMessage: z.object({
          role: z.literal("user"),
          content: z.string(),
        }),
        toolChoice: z.string().optional(),
        tools: z.array(z.any()).optional(),
      }),

      source: z.object({
        SourceType: z.enum([
          SourceType.FARCASTER_USER,
          SourceType.FARCASTER_POST,
          SourceType.FARCASTER_CHANNEL,
        ]),
        ids: z.string(),
        limit: z.number().optional(),
        isWithRecast: z.boolean().optional(),
      }),
    }),
  }),

  integrations: {
    openai,
  },

  run: async (payload, io, ctx) => {
    // Task 1 - Fetch the source data with NEYNAR ///
    let runResult: any;
    const sourceOutput = await io.runTask("neynar-fetch", async () => {
      let sourcePosts = [];
      let result;

      switch (payload.source.SourceType) {
        case SourceType.FARCASTER_USER:
          
          try {
            result = await sdk.feed({
              feed_type: FeedType.Filter,
              filter_type: FilterType.Fids,
              fids: payload.source.ids,
              limit: payload.source.limit || 10,
              with_recasts: payload.source.isWithRecast || false,
              cursor: "",
            });
            sourcePosts = result.data;
          } catch (err) {
            console.error(err);
          }
          break;

        case SourceType.FARCASTER_POST:
          try {
            const results = [];
            const ids = payload.source.ids.split(",");
            for (const id of ids) {
       
              const feedResult = await sdk.cast({
                identifier: id,
                type: "url",
              });
              console.log(feedResult); // Add this line
              results.push(feedResult.data.cast);
            }
            sourcePosts = { casts: results };
          } catch (err) {
            console.error(err);
          }
          break;

        case SourceType.FARCASTER_CHANNEL:
          try {
            result = await sdk.feed({
              feed_type: "filter",
              filter_type: FilterType.ChannelId,
              channel_id: payload.source.ids,
              with_recasts: payload.source.isWithRecast || false,
              limit: payload.source.limit || 10,
              cursor: "",
            });
            sourcePosts = result.data;
          } catch (err) {
            console.error(err);
          }
          break;

        default:
          console.log("Unknown SourceType");
          break;
      }

      console.log("result", result);
      console.log("orgnsource", sourcePosts.casts);
      console.log("leng", sourcePosts.casts.length);
      if (sourcePosts.casts.length > 0) {
        return sourcePosts.casts;
      } else {
        return { error: "No data fetched or SourceType not supported." };
      }
    });

    // Task 2 - Save the source data to the database ///

    const sourceDB = await io.runTask("save-source-output", async () => {
      console.log("Source output to save:", sourceOutput);

      try {
        const runResult = await prisma.runResult.create({
          data: {
            runId: ctx.event.context.runId,
          },
        });

        console.log(runResult, "runResult");

        const sourcePostDbs = await Promise.all(
          sourceOutput.map(async (post) => {
            try {
              if (post.text && post.author.fid) {
                let author = await prisma.sourceAuthor.findUnique({
                  where: { fid: post.author.fid },
                });
        
                if (!author) {
                  author = await prisma.sourceAuthor.create({
                    data: {
                      fid: post.author.fid,
                      userName: post.author.username,
                      displayName: post.author.display_name,
                      avatarUrl: post.author.pfp_url,
                      followers: post.author.follower_count,
                      following: post.author.following_count,
                      activeStatus: post.author.active_status,
                      verifications: post.author.verifications,
                      bioText: post.author.profile?.bio?.text || "",
                    },
                  });
                }
        
                return await prisma.sourcePost.create({
                  data: {
                    content: post.text,
                    hash: post.hash,
                    timestamp: new Date(post.timestamp),
                    likes: post.reactions?.likes?.length || 0,
                    reCasts: post.reactions?.recasts?.length || 0,
                    authorId: author.id,
                    runResultId: runResult.id,
                  },
                });
              } else {
                console.error("Missing required fields in post:", post);
                return null;
              }
            } catch (error) {
              console.error("Error creating source post:", error);
              return null;
            }
          })
        );

        const filteredSourcePostDbs = sourcePostDbs.filter(
          (post) => post !== null
        );
        console.log(filteredSourcePostDbs);
        return filteredSourcePostDbs;
      } catch (error) {
        console.error("Error saving source posts to the database:", error);
        throw error;
      }
    });

    function extractData(casts: any) {
      return casts.map((cast: any) => ({
        authorUsername: cast.author.username,
        castText: cast.text,
        likesCount: cast.reactions.likes.length,
        recastsCount: cast.reactions.recasts.length,
      }));
    }

    const llmInputSources = extractData(sourceOutput);

    function formatContentForAPI(inputSources: any) {
      // Concatenate the desired fields from each object into a single string
      // Here, we'll use castText as an example, but you can adjust this to include
      // any other information from the object, such as authorUsername, likesCount, etc.
      const content = inputSources
        .map((source: any) => {
          return `${source.authorUsername} says: "${source.castText}" (Likes: ${source.likesCount}, Recasts: ${source.recastsCount})`;
        })
        .join("\n\n"); // Separate each entry with two newlines

      return content;
    }

    const formattedContent = formatContentForAPI(llmInputSources);

    console.log(llmInputSources);

    // rest of your code

    const result = await io.openai.chat.completions.backgroundCreate(
      "background-chat-completion",
      {
        model: payload.openAIRequest.model,
        response_format: { type: "json_object" },
        max_tokens: payload.openAIRequest.maxTokens,
        messages: [
          {
            role: payload.openAIRequest.promptMessage.role,
            content: formattedContent,
          },
          {
            role: "system",
            content: process.env.SYSTEM_PROMPT!,
          },
        ],
      }
    );
    let parsedContent = null;
    const content = result.choices[0]?.message?.content;
    if (content) {
      parsedContent = JSON.parse(content);
      const {
        Title,
        Content,
        Tags,
        Categories,
        References,
        Manipulation,
        Summary,
      } = parsedContent;
    } else {
      console.log(parsedContent, "parsedContent");
    }

    console.log(parsedContent, "parsedContent");

    const toolCalls = result.choices[0]?.message?.tool_calls;
    const promptToken = result.usage?.prompt_tokens;
    const completionToken = result.usage?.completion_tokens;
    const finishReason = result.choices[0]?.finish_reason;
    const systemFingerPrint = result?.system_fingerprint;
    const model = result?.model;

    const title = parsedContent?.Title;
    const contentItem = parsedContent?.Content;
    const tags = parsedContent?.Tags;
    const categories = parsedContent?.Categories;
    const references = parsedContent?.References;
    const manipulation = parsedContent?.Manipulation;
    const summary = parsedContent?.Summary;

    const runId = ctx.event.context.runId;
    const taskId = ctx.event.context.taskId;
    const storyId = ctx.event.context.storyId;

    const storeLLMOutput = await io.runTask("save-llm-response", async () => {
      const runResultCheck = await prisma.runResult.findFirst({
        where: {
          runId: runId,
        },
      });

      if (!runResultCheck) {
        throw new Error(`RunResult with runId ${runId} not found`);
      }
      try {
        const newLLMResponse = await prisma.lLMResponse.create({
          data: {
            model,
            promptToken,
            completionToken,
            systemFingerPrint,
            finishReason,
            runId,
            runResult: {
              connect: {
                id: runResultCheck.id,
              },
            },
          },
        });

        console.log(newLLMResponse, "newLLMResponse");

        const newLLMContent = await prisma.lLMContent.create({
          data: {
            title,
            content: contentItem,
            summary,
            manipulation,
            LLMResponseId: newLLMResponse.id, // Associate the LLMContent with the LLMResponse
            categories: {
              create: categories?.map((category) => ({
                category: {
                  connectOrCreate: {
                    where: { name: category },
                    create: { name: category },
                  },
                },
              })),
            },
            tags: {
              create: tags?.map((tag) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tag },
                    create: { name: tag },
                  },
                },
              })),
            },
            annotations: {
              create: references?.map((annotation) => ({
                userName: annotation.userName,
                annotationText: annotation.annotationText,
              })),
            },
          },
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
        });

        console.log(newLLMContent, "newLLMContent");

        const llmResponseWithRelations = await prisma.lLMResponse.findUnique({
          where: { id: newLLMResponse.id },
          include: {
            content: {
              include: {
                categories: true,
                tags: true,
                annotations: true,
              },
            },
          },
        });

        try {
          const updatedStory = await prisma.story.update({
            where: { id: storyId }, // replace `storyId` with the ID of the story you want to update
            data: { status: "CREATED" },
          });

          console.log("Story status updated successfully:", updatedStory);
        } catch (error) {
          console.error("Error updating story status:", error);
          throw error;
        }

        console.log(
          "LLMResponse and related entities created successfully:",
          llmResponseWithRelations
        );
        return llmResponseWithRelations;
      } catch (error) {
        console.error("Error storing LLM response to the database:", error);
        throw error;
      }

      // Call the inner function and return its result
    });

    console.log(storeLLMOutput, "storeLLMOutput");
  },
});
