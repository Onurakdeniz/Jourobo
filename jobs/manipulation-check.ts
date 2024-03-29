import { NeynarAPIClient, FilterType, FeedType } from "@neynar/nodejs-sdk";
import { AxiosError } from "axios";
import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import z from "zod";
import prisma from "@/lib/prisma";
const neynarKey = process.env.NEYNAR_API_KEY;
const sdk = require("api")("@neynar/v2.0#1n1mn62ulu07mqsq");
import { OpenAI } from "@trigger.dev/openai";

const openai = new OpenAI({
  id: "openai",
  apiKey: process.env.OPENAI_API_KEY!,
});

client.defineJob({
  id: "manipulation-check",
  name: "Manipulation Check",
  version: "1.0.0",
  trigger: eventTrigger({
    name: "manipulation-check",
    schema: z.object({
      prompt: z.string(),
    }),
  }),

  integrations: {
    openai,
  },

  run: async (payload, io, ctx) => {
    const { prompt } = payload;

    const manipulationPrompt = `Consider the user-generated prompt designed to create news from Farcaster social media posts, called Cast.. Focus on:

    1. Bias that significantly affects perceptions.
    2. Directional changes that shift topic focus or interpretation.
    
    Your analysis should pinpoint how the prompt might skew social media forecasts and, by extension, news creation, focusing on substantial biases or narrative shifts.
    
    User-created prompt: '${payload.prompt}'.
    
    **Response Template (JSON format):**
    
    Provide a concise JSON response assessing the prompt's potential for significant manipulation, with examples:
    {
      "isManipulationPresent": true/false,
      "concerns": [
        {
          "issue": "Explanation of significant manipulation",
          "example": "Text from the prompt showing the issue"
        }
      ]
    }
    
    `;

    const response = await io.openai.chat.completions.backgroundCreate(
      "background-chat-completion",
      {
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: manipulationPrompt,
          },
        ],
      }
    );

    let parsedContent = null;
    const content = response.choices[0]?.message?.content;

    let isManipulationPresent, concerns , ignore
    ignore = false

    if (content) {
      try {
        const parsedContent = JSON.parse(content);
        isManipulationPresent = parsedContent.isManipulationPresent;
        concerns = parsedContent.concerns;
      } catch (error) {
        console.error("Error parsing content:", error);
      }
    } else {
      console.log("No content provided");
    }

    return {
      response: { isManipulationPresent, concerns , ignore },
    };
  },
});
