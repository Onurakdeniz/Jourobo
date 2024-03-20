"use client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useStoryStore } from "@/store/story";
import { useSearchParams } from "next/navigation";

export const useFetchStories = (sortType: string) => {
  const storiesState = useStoryStore((state) => state.stories);
  const setStories = useStoryStore((state) => state.setStories);
 
  // Function to fetch stories data
  const fetchStoriesData = async ({
    queryKey,
  }: QueryFunctionContext<[string, { sortType: string }]>) => {
    const [_key, { sortType }] = queryKey;
    const response = await fetch(`/api/story?sort=${sortType}`);

    if (!response.ok) {
      throw new Error("Stories fetch failed!");
    }
    const data = await response.json();
    return data;
  };

  const {
    data: stories,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["stories", { sortType }],
    queryFn: fetchStoriesData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

 

  // Set stories in global state if query was successful
  if (isSuccess && stories) {
    setStories(stories);
  }

  // Return necessary variables for component consumption
  return { storiesState, isLoading, error, refetch };
};
