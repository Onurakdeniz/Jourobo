import React from "react";
import PostTitle from "./title";
import { Separator } from "@/components/ui/separator";
import PostsStat from "./stat";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { value: "posts", label: "Proof of Source", disabled: false },
  { value: "comments", label: "Comments", disabled: true },
  { value: "contributions", label: "Contribute", disabled: true },
];

const PostTop = () => {
  return (
    <div className="flex-col flex w-full gap-4 ">
      <PostTitle />
      <Separator />
      <PostsStat />

      <TabsList className="flex gap-4 p-0 w-full bg-background justify-start font-bold">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            className="justify-center items-center rounded-full text-sm px-4   w-42  py-1    border data-[state=active]:font-bold data-[state=active]:text-orange-600 data-[state=active]:shadow-none   "
            value={tab.value}
            disabled={tab.disabled}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};

export default PostTop;
