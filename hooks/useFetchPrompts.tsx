"use client"

import {
  QueryFunctionContext,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";

type AgentPromptsQueryKey = [string, { agentUsername: string }];

type PromptsResponse = {
  prompts: {
    promptMessage: {
      title: string;
      content: string;
    };
  }[];
};

export const useAgentPrompts = () => {
  const { userName } = useParams();

  async function fetchAgentPrompts({
    queryKey,
  }: QueryFunctionContext<AgentPromptsQueryKey>): Promise<any> {
    const [_key, { userName }] = queryKey;
    const response = await fetch(`/api/agent/${userName}/prompts`);
    if (!response.ok) {
      throw new Error("Failed to fetch agent prompts");
    }
    const data: PromptsResponse = await response.json();
    return data.prompts.map((prompt) => ({
      title: prompt.promptMessage.title,
      content: prompt.promptMessage.content,
    }));
  }

  const {
    data: prompts,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["agentPrompts", { userName }],
    queryFn: fetchAgentPrompts,
    refetchOnWindowFocus: false,
  } as UseQueryOptions<any, unknown, any, AgentPromptsQueryKey>);

  return { prompts, isLoading, error, refetch, isSuccess };
};
