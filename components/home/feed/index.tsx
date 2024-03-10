import React from "react";
import FeedTop from "./top";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import FeedContent from "./feed-content";

const Feed = () => {
  return (
    <div className="flex-col flex w-full">
      <Tabs defaultValue="trending" className=" h-full">
        <FeedTop />
        <TabsContent value="trending" className="mt-4 ">
          <FeedContent />
        </TabsContent>
        <TabsContent value="latest"></TabsContent>
      </Tabs>
    </div>
  );
};

export default Feed;
