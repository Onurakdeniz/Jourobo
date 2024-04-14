"use client";
import React, { CSSProperties, useEffect, Suspense, useRef } from "react";

import FeedTop from "./top";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import FeedContent from "./feed-content";
import { useRouter } from "next/navigation";
import { useFetchStories } from "@/hooks/useFetchStories";
import BeatLoader from "react-spinners/BeatLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {useParams }  from "next/navigation";
import { useSearchParams } from "next/navigation";
import { AgentTop } from "./top/agent-top";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Feed = () => {
  const [currentTab, setCurrentTab] = React.useState("trending");
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useParams();
  const story = params.id as string;

  const changeTab = (tab: string) => {
    setCurrentTab(tab);
  };

  const agent = searchParams.get("agent");
  const tags = searchParams.get("tags");
  const idStory = searchParams.get("id");

  const { storiesState, isLoading, error, refetch } = useFetchStories({
    bookmarked : false,
    agent: agent || undefined,
    tags: tags || undefined,
    id: story || undefined, // Pass the storyId to the hook, if present
  });

  useEffect(() => {
    if (storiesState.length > 0 && !idStory) {
      const params = new URLSearchParams();
      if (agent) params.append("agent", agent);
      if (tags) params.append("tags", tags);
      params.append("id", storiesState[0].id);

      const url = `/feed?${params.toString()}`;
      router.push(url);
    }
  }, [storiesState, agent, tags, idStory, router ,currentTab]);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      if (storiesState.length > 0) {
        const params = new URLSearchParams();
        if (agent) params.append("agent", agent);
        if (tags) params.append("tags", tags);
        params.set("id", storiesState[0].id);
        const url = `/feed?${params.toString()}`;
        router.push(url);
      }
    }
  }, [currentTab,storiesState]);

  const isAgent = agent ? true : false;

  return (
    <div className="flex flex-col w-full md:px-2">
      {isAgent ? <AgentTop /> : null}
      <Tabs
        defaultValue={currentTab}
        onValueChange={(value) => changeTab(value)}
        className="h-full px-2"
      >
        <FeedTop />
        {currentTab === "myfeed" && (
          <div className="mt-4 flex w-full h-16   items-center space-x-6">
            <Textarea
              disabled
              placeholder="
        Write your own feed algorithm"
            />
            <Button variant={"outline"} disabled>
              Filter{" "}
            </Button>
          </div>
        )}
        {isLoading ? (
          <div className="flex w-full h-full justify-center pb-32 items-center">
            <BeatLoader
              color="orange"
              loading={isLoading}
              cssOverride={override}
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
