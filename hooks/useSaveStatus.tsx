"use client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useAgentStore } from "@/store/agent";
import { useParams } from "next/navigation";

interface SaveStatusResponse {
  isBookmarked: boolean;
}

export const useSaveStatus = (storyId: string) => {
  async function fetchSaveStatus({ queryKey }: QueryFunctionContext<any>) {
    // Extract agentUserName from the queryKey
    const [_key, { storyId }] = queryKey;
    const response = await fetch(`/api/save/${storyId}`);
    if (!response.ok) {
      throw new Error("Agent not found !");
    }
    let isBookmarked = false;
    const data = await response.json();
    if (data?.isBookmarked) {
      isBookmarked = true;
    }

    return isBookmarked;
  }

  const {
    data: isBookmarked,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["saveStatus", { storyId }], // Include agentUserName in the queryKey
    queryFn: fetchSaveStatus,
    refetchOnWindowFocus: false,
  });

  return { isBookmarked, isLoading, error, refetch };
};
