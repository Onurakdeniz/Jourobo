"use client";
import React, { CSSProperties } from "react";
import { useParams } from "next/navigation";
import TopAgent from "./components/top-agent";
import { Separator } from "@/components/ui/separator";
import AgencyList from "@/app/agency/components/agency-list";
import { useFetchAgent } from "@/hooks/useFetchAgent";
import BeatLoader from "react-spinners/BeatLoader";
import TaskList from "./components/task-list";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const page = () => {
  const { agentState, isLoading, error, refetch } = useFetchAgent();
  const agentId = useParams().userName;
  console.log("agentState", agentState);

  const taskCount = agentState?.tasks?.length || 0;

  if (error) {
    return (
      <div className="flex w-full h-full justify-center pb-72 items-center text-2xl text-muted-foreground">
        <p> {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center pb-72 items-center">
        <BeatLoader
          color="orange"
          loading={isLoading}
          cssOverride={override}
          size={40}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="flex-col flex w-full h-full">
      <TopAgent
        createdAt={agentState?.createdAt || new Date()}
        profile={agentState?.profile}
        agency={agentState.agency}
        storyCount={agentState.storyCount}
        tasksCount={taskCount}
      />
      <Separator />

      <TaskList />
    </div>
  );
};

export default page;
