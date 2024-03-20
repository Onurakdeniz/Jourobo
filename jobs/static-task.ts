import { NeynarAPIClient, FilterType, FeedType } from "@neynar/nodejs-sdk";
import { AxiosError } from "axios";
import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import z from "zod";
import { OpenAI } from "@trigger.dev/openai";
import prisma from "@/lib/prisma";

const neynarKey = process.env.NEYNAR_API_KEY;

if (!neynarKey) {
  throw new Error("NEYNAR_API_KEY is not defined");
}

const clientN = new NeynarAPIClient(neynarKey);

const openai = new OpenAI({
  id: "openai",
  apiKey: process.env.OPENAI_API_KEY,
});

client.defineJob({
  id: "agent-static-task",
  name: "Agent Static Task",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "static-task",
    schema: z.object({
      temperature: z.number().optional(),
      outputStyle: z.string().optional(),
      model: z.string(),
      promptMessage: z.object({
        role: z.literal("user"),
        content: z.string(),
      }),
      systemMessage: z.object({
        role: z.literal("system"),
        content: z.string(),
      }),
      source: z.object({
        sourceType: z.string(),
        ids: z.string(),
      }),
    }),
  }),
  integrations: {
    openai,
  },
  run: async (payload, io, ctx) => {
    const sourceOutput = await io.runTask("neynar-fetch", async () => {
      const result = await clientN.fetchFeed(FeedType.Filter, {
        filterType: FilterType.ChannelId,
        channelId: payload.source.ids,
        limit: 25,
      });

      const jsonResult = JSON.parse(JSON.stringify(result));
      return jsonResult;
    });

    const { casts } = sourceOutput;

    const resultString = casts
      .map((cast) => {
        const authorUsername = cast.author.username;
        const castText = cast.text;
        return `Username: ${authorUsername}, Cast Text: "${castText}"`;
      })
      .join("\n");

    // rest of your code
    await io.openai.models.retrieve("get-model", {
      model: "gpt-3.5-turbo",
    });

    const models = await io.openai.models.list("list-models");

    const result = await io.openai.chat.completions.backgroundCreate(
      "background-chat-completion",
      {
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: payload.promptMessage.role,
            content:  payload.promptMessage.content,
          },
          {
            role: payload.systemMessage?.role,
            content: payload.systemMessage?.content,
          },
        ],
      }
    );

    const content = result.choices[0]?.message?.content;

    if (content) {
      const formattedContent = content
        .split("\n")
        .map((item, index) => {
          return `${index + 1}. ${item}`;
        })
        .join("\n");

      const runId = ctx.event.context.runId;
      const taskId = ctx.event.context.taskId;

    

      const outputLLM = await io.runTask("output-llm", async () => {
    
        const runResult = await prisma.runResult.create({
          data: {
            runId,
            sourceOutput,
            llmOutput: formattedContent,
          },
        });
      });

 
    }
  },
});
