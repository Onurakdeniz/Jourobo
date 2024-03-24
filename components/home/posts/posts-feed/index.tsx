import React, { CSSProperties } from "react";
import PostCard from "../post-card";
import { Scroll } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetchPostsByStoryId } from "@/hooks/useFetchPosts";
import BeatLoader from "react-spinners/BeatLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const PostFeed = (
  {
    postsState,
  } : {
    postsState: any
  }
) => {


  return (
    <>
      
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
     
    </>
  );
};

export default PostFeed;
