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
import { useMediaQuery } from "usehooks-ts";
import { useFetchPostsByStoryId } from "@/hooks/useFetchPosts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";

const Posts = () => {
  const { postsState, isLoading, error, refetch } = useFetchPostsByStoryId();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(true);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {" "}
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
          </Tabs>{" "}
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
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
};

{
  /*
  {!isDesktop && (
    <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Move Goal</DrawerTitle>
                <DrawerDescription>
                  Set your daily activity goal.
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-col flex w-full gap-6">
          <Tabs defaultValue="posts" className=" h-full">
            <PostTop />
            <TabsContent value="posts" className="mt-2 flex-col flex gap-2 ">
              <Suspense>
                <PostFeed postsState={postsState} />
              </Suspense>
            </TabsContent>
            <TabsContent value="comments"></TabsContent>
          </Tabs>{" "}
        </div>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild></DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}
  */
}
