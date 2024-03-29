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

    const manipulationPrompt = `Evaluate the integrity of this user-created prompt to guide news article generation. Identify: 1. Misrepresentation or factual alteration. 2. Bias or unsupported viewpoint direction. 3. Sensationalism or misleading language. 4. Unfounded assumptions or extrapolations.
    
    User-created prompt: '${payload.prompt}'.

    Assess the prompt's validity, citing specific concerns..
    
    Provide a JSON response indicating the prompt's validity and reasons for any concerns, referencing specific text examples:
    
    {
      'is_prompt_valid': [true/false],
      'reasons_if_invalid': [
        {
          'reason': 'Brief explanation of the issue',
          'reference': 'Relevant prompt text'
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

    if (content) {
      try {
        parsedContent = JSON.parse(content);
        const { result, reason } = parsedContent;
      } catch (error) {
        console.error("Error parsing content:", error);
      }
    } else {
      console.log(parsedContent, "parsedContent");
    }

    return {
      response: { result, reason },
    };
  },
});
