"use client";

import React from "react";
import { Suspense } from "react";
import PostTop from "./post-top";
import PostFeed from "./posts-feed";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PostTitle from "./post-top/title";
import { Separator } from "@/components/ui/separator";
import PostsStat from "./post-top/stat";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchPostsByStoryId } from "@/hooks/useFetchPosts";

const Posts = () => {
  const { postsState, isLoading, error, refetch } = useFetchPostsByStoryId();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {isLoading ? (
        <PostSkeleton />
      ) : (
        <div className="flex-col flex w-full gap-6">
          <Tabs defaultValue="posts" className=" h-full">
            <PostTop />
            <TabsContent value="posts" className="mt-2 flex-col flex gap-2 ">
              <Suspense>
                <PostFeed postsState={postsState} />
              </Suspense>
            </TabsContent>
            <TabsContent value="comments"></TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default Posts;

const PostSkeleton = () => {
  return (
    <div className="flex-col flex w-full gap-3">
      <Skeleton className="h-12 w-full" />
      <div className="flex  gap-1 w-full">
        <Skeleton className="h-6 w-full" />
      </div>
      <div className="flex   gap-1 w-full">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
};
