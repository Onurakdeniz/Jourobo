import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const FeedTop = () => {
  const tabs = [
    { value: 'trending', text: 'Trending' },
    { value: 'latest', text: 'Latest' },
    { value: 'myfeed', text: 'My Feed' },
  ];
  return (
<TabsList className="flex gap-3 w-full px-0 bg-background justify-start font-bold">
  {tabs.map((tab) => (
    <TabsTrigger
      key={tab.value}
      className="justify-center items-center border text-lg p-0 w-32 py-1 data-[state=active]:dark:bg-orange-950 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-600 data-[state=active]:shadow-none   "
      value={tab.value}
    >
      {tab.text}
    </TabsTrigger>
  ))}
</TabsList>
  );
};

export default FeedTop;
