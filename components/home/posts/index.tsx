'use client'

import React from "react";
import { Suspense } from "react";
import PostTop from "./post-top";
import PostFeed from "./posts-feed";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PostTitle from "./post-top/title";
import { Separator } from "@/components/ui/separator";
import PostsStat from "./post-top/stat";
 

const Posts = () => {


 


  return (
    <div className="flex-col flex w-full gap-6">
      <Tabs defaultValue="posts" className=" h-full">
        <PostTop />
        <TabsContent value="posts" className="mt-2 flex-col flex gap-2 ">
          <Suspense>
          <PostFeed />
          </Suspense>
        </TabsContent>
        <TabsContent value="comments"></TabsContent>
      </Tabs>
    </div>
  );
};

export default Posts;
