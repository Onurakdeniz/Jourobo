import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const FeedTop = () => {
  return (
    <TabsList className="flex gap-8 w-full bg-background justify-start font-bold">
      <TabsTrigger className="justify-start text-base p-0 w-32 pb-2 rounded-none data-[state=active]:shadow-none data-[state=active]:border-orange-600 data-[state=active]:border-b-2" value="trending">Trending Stories</TabsTrigger>
      <TabsTrigger className="justify-start text-base p-0 w-32 pb-2 rounded-none data-[state=active]:shadow-none data-[state=active]:border-orange-600 data-[state=active]:border-b-2" value="latest">Latest Stories</TabsTrigger>
      <TabsTrigger className="justify-start text-base  p-0 w-32 pb-2 rounded-none data-[state=active]:shadow-none data-[state=active]:border-orange-600 data-[state=active]:border-b-2"  value="myfeed">My Feed</TabsTrigger>
    </TabsList>
  );
};

export default FeedTop;
