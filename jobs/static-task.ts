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
        systemMessage: z.object({
          role: z.literal("system"),
          content: z.string(),
        }),
        toolChoice: z.string(),
        tools: z.array(z.any()).optional(),
      }),

      source: z.object({
        SourceType: z.enum([
          SourceType.FARCASTER_USER,
          SourceType.FARCASTER_POST,
          SourceType.FARCASTER_CHANNEL,
        ]),
        ids: z.string(),
        amount: z.number().optional(),
        withRecasts: z.boolean().optional(),
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
      let result; // Declare result here to use it outside of the try-catch blocks
      switch (payload.source.SourceType) {
        case SourceType.FARCASTER_USER:
          // Call fetch function for FARCASTER_USER_POSTS

          console.log("doneuseefast");
          try {
            result = await sdk.feed({
              feed_type: FeedType.Filter,
              filter_type: FilterType.Fids,
              fids: payload.source.ids, // Ensure this is correctly formatted for the SDK call
              limit: 2,
              api_key: "NEYNAR_API_DOCS",
            });

            sourcePosts = result.data;
            console.log(sourcePosts);
          } catch (err) {
            console.error(err);
          }
          break;

        case SourceType.FARCASTER_POST:
          // Call fetch function for FARCASTER_POST_ID
          try {
            const results = []; // Use a different variable name to avoid confusion
            for (const id of payload.source.ids) {
              const feedResult = await sdk.cast({
                identifier: id,
                type: "url",
                api_key: "NEYNAR_API_DOCS",
              });

              results.push(feedResult.data);
            }

            sourcePosts = results;
            console.log(sourcePosts);
          } catch (err) {
            console.error(err);
          }
          break;
        case SourceType.FARCASTER_CHANNEL:
          // Call fetch function for FARCASTER_CHANNEL_POSTS
          try {
            result = await sdk.feed({
              feed_type: "filter",
              filter_type: FilterType.ChannelId,
              channel_id: payload.source.ids, // Ensure this matches the SDK's expected parameter
              with_recasts: true, // Changed from "true" to boolean true
              limit:  payload.source.amount || 10, // Use the provided amount or default to 10
              api_key: "NEYNAR_API_DOCS",
              cursor: "",
            });

            sourcePosts = result.data;
            console.log(sourcePosts);
          } catch (err) {
            console.error(err);
          }
          break;
        default:
          // Handle unknown SourceType
          console.log("Unknown SourceType");
          break;
      }

      if (result) {
        const jsonResult = JSON.parse(JSON.stringify(result.data)); // Directly use result.data
        return jsonResult;
      } else {
        return { error: "No data fetched or SourceType not supported." };
      }
    });
    // Task 2 - Save the source data to the database ///

    const postes = sourceOutput.casts;

    const sourceDB = await io.runTask("save-source-output", async () => {
      if (!Array.isArray(postes) || postes.length === 0) {
        console.log("No source output to save.");
        return [];
      }

      console.log("Source output to save:", postes);

      try {
        runResult = await prisma.runResult.create({
          data: {
            runId: ctx.event.context.runId,
          },
        });

        console.log(runResult, "runResult");

        const sourcePostDbs = await Promise.all(
          postes.map(async (sourcePost) => {
            try {
              if (sourcePost.text && sourcePost.author.fid) {
                let author = await prisma.sourceAuthor.findUnique({
                  where: { fid: sourcePost.author.fid },
                });

                if (!author) {
                  // Create the author if not found
                  author = await prisma.sourceAuthor.upsert({
                    where: { fid: sourcePost.author.fid },
                    update: {},
                    create: {
                      fid: sourcePost.author.fid,
                      userName: sourcePost.author.username,
                      displayName: sourcePost.author.display_name,
                      avatarUrl: sourcePost.author.pfp_url,
                      followers: sourcePost.author.follower_count,
                      following: sourcePost.author.following_count,
                      activeStatus: sourcePost.author.active_status,
                      verifications: sourcePost.author.verifications,
                      bioText: sourcePost.author.profile.bio.text,
                    },
                  });
                }

                return await prisma.sourcePost.create({
                  data: {
                    content: sourcePost.text,
                    hash: sourcePost.hash,
                    timestamp: new Date(sourcePost.timestamp),
                    likes: sourcePost.reactions.likes.length,
                    reCasts: sourcePost.reactions.recasts.length,
                    authorId: author.id,
                    runResultId: runResult.id,
                  },
                });
              } else {
                console.error(
                  "Missing required fields in sourcePost:",
                  sourcePost
                );
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

    const llmInputSources = extractData(sourceOutput.casts);

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
        model: "gpt-4-turbo-preview",
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

    const storeLLMOutput = await io.runTask("save-llm-response", async () => {
      const runResult = await prisma.runResult.findFirst({
        where: {
          runId: runId,
        },
      });

      if (!runResult) {
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
                id: runResult.id,
              },
            },
          },
        });

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
