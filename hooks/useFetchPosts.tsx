import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { usePostStore } from "@/store/posts";
import { useSearchParams } from "next/navigation";

export const useFetchPostsByStoryId = () => {
  const params = useSearchParams();
  const storyId = params.get("id");
  const postsState = usePostStore((state) => state.posts);
  const summaryState = usePostStore((state) => state.summary);
  const sourceState = usePostStore((state) => state.source);
  const setSummary = usePostStore((state) => state.setSummary);
  const setSource = usePostStore((state) => state.setSource);
  const setPosts = usePostStore((state) => state.setPosts);
  const setStoryInformation = usePostStore((state) => state.setStoryInformation);

  // Function to fetch posts data for a given story ID
  const fetchPostsData = async ({
    queryKey,
  }: QueryFunctionContext<[string, { storyId: string }]>) => {
    const [_key, { storyId }] = queryKey;
    const response = await fetch(`/api/post/${storyId}`);
    if (!response.ok) {
      throw new Error("Posts fetch failed!");
    }
    const data = await response.json();
    return data;
  };

  const {
    data: postFetchData,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["posts", { storyId }],
    queryFn: fetchPostsData,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Adjust according to your needs
    enabled: !!storyId, // Convert storyId to a boolean value
  });

  // Set posts in global state if query was successful
  if (isSuccess && postFetchData) {
    setPosts(postFetchData.posts);
    setSummary(postFetchData.summary);
    setSource(postFetchData.source);
    setStoryInformation(postFetchData.storyInformation);
  }

  // Return necessary variables for component consumption
  return { postsState, sourceState, summaryState, isLoading: !storyId || isLoading, error, refetch };
};