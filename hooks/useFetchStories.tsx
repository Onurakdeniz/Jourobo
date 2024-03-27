import { useBookmarksStore } from "@/store/bookmarks";
import { useStoryStore } from "@/store/story";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

interface FetchStoriesOptions {
  sortType?: string;
  bookmarked?: boolean;
}

export const useFetchStories = (options: FetchStoriesOptions = {}) => {
  const setStories = useStoryStore((state) => state.setStories);
  const setBookmarkedStories = useBookmarksStore((state) => state.setBookmarks);
  const bookmarksStore = useBookmarksStore((state) => state.bookmarks);
  const storiesStore = useStoryStore((state) => state.stories);

  const fetchStoriesData = async ({
    queryKey,
  }: QueryFunctionContext<[string, FetchStoriesOptions]>) => {
    const { sortType, bookmarked } = queryKey[1];

    let url;

    if (options.bookmarked) {
 
      url = "/api/story/bookmarked"; 
    } else {
      url = "/api/story";  
      if (options.sortType) {
 
        url += `?${new URLSearchParams({ sort: options.sortType }).toString()}`;
      }
    }

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
