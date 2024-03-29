import React, { CSSProperties } from "react";
import PostCard from "../post-card";
import { Scroll } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetchPostsByStoryId } from "@/hooks/useFetchPosts";
import BeatLoader from "react-spinners/BeatLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const PostFeed = ({ postsState }: { postsState: any }) => {
  const dateSort = [...postsState].sort((a, b) => {
    const dateA = new Date(a.postCreatedAt);
    const dateB = new Date(b.postCreatedAt);

    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      console.error("Invalid date format:", a.postCreatedAt, b.postCreatedAt);
      return 0;
    }

    return dateB.getTime() - dateA.getTime();
  });
 
  return (
    <>
      <Tabs defaultValue="top" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-6 bg-background  px-0">
          <TabsTrigger
            value="top"
            className="justify-center items-center rounded-full text-xs px-4     py-1    border data-[state=active]:text-orange-600 data-[state=active]:shadow-none   "
          >
            Top{" "}
          </TabsTrigger>
          <TabsTrigger
            value="date"
            className="justify-center items-center rounded-full text-xs px-4     py-1    border data-[state=active]:text-orange-600 data-[state=active]:shadow-none   "
          >
            Last Date
          </TabsTrigger>
        </TabsList>
        <ScrollArea
          className="flex items-center  overflow-auto pr-4 mt-2 "
          style={{ height: "calc(100vh - 300px)" }}
        >
          <TabsContent value="top">
            <div className="flex-col flex gap-4  ">
              {postsState.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="date" >
            <div className="flex-col flex gap-4 ">
              {dateSort.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </>
  );
};

export default PostFeed;
