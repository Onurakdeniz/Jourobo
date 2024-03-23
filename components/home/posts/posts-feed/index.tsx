import React from "react";
import PostCard from "../post-card";
import { Scroll } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetchPostsByStoryId } from "@/hooks/useFetchPosts";
import { useSearchParams } from "next/navigation";



const PostFeed = () => {



const { postsState, isLoading, error, refetch } = useFetchPostsByStoryId();
console.log(postsState,"postsState")
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ScrollArea
      className="flex items-center gap-2 overflow-auto pr-4 mt-2  "
      style={{ height: "calc(100vh - 300px)" }}
    >
      <div>
        {postsState.map((post) => (
          <PostCard key={post.id} post={post} />

        ))}
      </div>
    </ScrollArea>
  );
};

export default PostFeed;
