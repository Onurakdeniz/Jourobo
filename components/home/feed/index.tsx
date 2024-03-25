"use client";
import React, { CSSProperties, useEffect, Suspense } from "react";

import FeedTop from "./top";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import FeedContent from "./feed-content";
import { useRouter } from "next/navigation";
import { useFetchStories } from "@/hooks/useFetchStories";
import BeatLoader from "react-spinners/BeatLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Feed = ({
  pathName,
}) => {
  const [currentTab, setCurrentTab] = React.useState("trending");
  const router = useRouter();
 

  const changeTab = (tab: string) => {
    setCurrentTab(tab);
  };

  const { storiesState, isLoading, error, refetch } =
    useFetchStories(currentTab);

  useEffect(() => {
    if (storiesState.length > 0) {
      router.push(`feed/?id=${storiesState[0].id}`);
    }
  }, [storiesState])

 

  return (
    <div className="flex flex-col w-full">
      <Tabs
        defaultValue={currentTab}
        onValueChange={(value) => changeTab(value)}
        className="h-full px-2"
      >
        <FeedTop />
        {currentTab === "myfeed" && (
          <div className="mt-4 flex w-full h-16   items-center space-x-6">
            <Textarea
    
              placeholder="
        Text your feed algorithm"
            />
            <Button variant={"outline"} disabled>Filter </Button>
          </div>
        )}
        {isLoading ? (
          <div className="flex w-full h-full justify-center pb-32 items-center">
            <BeatLoader
              color="orange"
              loading={isLoading}
              cssOverride={override}
              size={24}
              size={24}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <FeedContent stories={storiesState} />
        )}
      </Tabs>
    </div>
  );
};

export default Feed;
