import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { usePostStore } from "@/store/posts";
import { useSearchParams } from "next/navigation";

export const useFetchPostsByStoryId = () => {
  const params = useSearchParams();
  const storyId = params.get("id");
  const postsState = usePostStore((state) => state.posts);
  const setPosts = usePostStore((state) => state.setPosts);

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
    data: posts,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["posts", { storyId }],
    queryFn: fetchPostsData,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Adjust according to your needs
  });

  // Set posts in global state if query was successful
  if (isSuccess && posts) {
    setPosts(posts);
  }

  // Return necessary variables for component consumption
  return { postsState, isLoading, error, refetch };
};
