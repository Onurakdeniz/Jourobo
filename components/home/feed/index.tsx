"use client";
import React, { CSSProperties, useEffect ,Suspense } from "react";
 
import FeedTop from "./top";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import FeedContent from "./feed-content";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
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


const Feed = () => {
  const [currentTab, setCurrentTab] = React.useState("trending");
  const router = useRouter();
  const searchParams = useSearchParams();
  const changeTab = (tab: string) => {
    setCurrentTab(tab);
    router.push(`/?sort=${tab}`);
  };
 

  const { storiesState, isLoading, error, refetch } =
    useFetchStories(currentTab);
 



  return (
    <div className="flex flex-col w-full">
      <Tabs
        defaultValue={currentTab}
        onValueChange={(value) => changeTab(value)}
        className="h-full px-2"
      >
        <FeedTop />
        {currentTab === "myfeed" && (
          <div className="mt-4 flex w-full h-fit   items-center space-x-6">
            <Textarea
              placeholder="
        Text your feed algorithm"
            />
            <Button>sdsd</Button>
          </div>
        )}
        {isLoading ? (
          <div className="flex w-full h-full justify-center pb-32 items-center">
            <BeatLoader
              color="orange"
              loading={isLoading}
              cssOverride={override}
              size={32}
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
