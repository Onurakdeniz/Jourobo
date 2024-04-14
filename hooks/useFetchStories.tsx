import { useBookmarksStore } from "@/store/bookmarks";
import { useStoryStore } from "@/store/story";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

interface FetchStoriesOptions {
  sortType?: string;
  bookmarked?: boolean;
  agent?: string;
  tags?: string;
  id? : string;
}

export const useFetchStories = (options: FetchStoriesOptions = {}) => {
  const setStories = useStoryStore((state) => state.setStories);
  const setBookmarkedStories = useBookmarksStore((state) => state.setBookmarks);
  const bookmarksStore = useBookmarksStore((state) => state.bookmarks);
  const storiesStore = useStoryStore((state) => state.stories);

  const fetchStoriesData = async ({
    queryKey,
  }: QueryFunctionContext<[string, FetchStoriesOptions]>) => {
    const { sortType, bookmarked, agent, tags } = queryKey[1];
    console.log("queryKey", queryKey);
    let url = "/api/story"; // Default URL
    const params = new URLSearchParams(); // Initialize URLSearchParams
    
    if (options.id) {
      // If an ID is provided, we're fetching a specific story
      params.append("id", options.id);
      url += `?${params.toString()}`; // Append parameters to the URL
    } else if (options.bookmarked === true) {
      // If fetching bookmarked stories, change the URL
      url = "/api/story/bookmarked";
    } else {
      // For general story fetching with optional filters
      if (options.sortType) {
        params.append("sort", options.sortType);
      }
      if (options.agent) {
        params.append("agent", options.agent);
      }
      if (options.tags) {
        params.append("tags", options.tags);
      }
      if (params.toString()) {
        url += `?${params.toString()}`; // Append parameters to the URL
      }
    }
    
    console.log("url", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Stories fetch failed!");
    }
    return response.json();
  };

  const {
    data: stories,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["stories", options],
    queryFn: fetchStoriesData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // Set stories in the appropriate global state if query was successful
  if (isSuccess && stories) {
    if (options.bookmarked) {
      setBookmarkedStories(stories);
    } else {
      setStories(stories);
    }
  }

  const storiesState = options.bookmarked ? bookmarksStore : storiesStore;

  return { storiesState, isLoading, error, refetch };
};