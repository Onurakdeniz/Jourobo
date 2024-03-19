import { NeynarAPIClient, isApiErrorResponse } from "@neynar/nodejs-sdk";
import { AxiosError } from "axios";
import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import z from "zod";
import { OpenAI } from "@trigger.dev/openai";

const openai = new OpenAI({
  id: "openai",
  apiKey: process.env.OPENAI_API_KEY as string,
});

client.defineJob({
  id: "agent-static-task",
  name: "Agent Static Task",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "my.event",
    schema: z.object({
      jokePrompt: z.string(),
    }),
  }),
  integrations: {
    openai,
  },
  run: async (payload, io, ctx) => {
    await openai.retrieveModel("get-model", {
      model: "gpt-3.5-turbo",
    });

    const models = await openai.listModels("list-models");

    const jokeResult = await openai.backgroundCreateChatCompletion(
      "background-chat-completion",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: payload.jokePrompt,
          },
        ],
      }
    );

    return {
      joke: jokeResult.choices[0]?.message?.content,
    };
  },
});
