"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { useFetchAgents } from "@/hooks/useFetchAgentList";
import AgentList from "./agent-list";
import { Skeleton } from "@/components/ui/skeleton";

const Agents = () => {
  const pathname = usePathname();
  const showTrendingAgents = pathname === "/feed";
  const [activeTab, setActiveTab] = React.useState <string> ("trending");

  const { agentList, isLoading, error, refetch } = useFetchAgents(activeTab);
  console.log("activeTab", activeTab)

 
  return (
    <>
      {showTrendingAgents && (
        <>
          <Tabs
            defaultValue="trending"
            className="border-t mt-2 h-full"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="flex gap-2 px-0 justify-start w-full bg-background mt-4">
              <TabsTrigger
                className="justify-center items-center rounded-full text-xs px-4   py-1 data-[state=active]:dark:bg-orange-950 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-600 data-[state=active]:shadow-none   "
                value="trending"
              >
                Trending Agents
              </TabsTrigger>
              <TabsTrigger
                className="justify-center items-center rounded-full text-xs px-4   py-1 data-[state=active]:dark:bg-orange-950 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-600 data-[state=active]:shadow-none   "
                value="latest"
              >
                New Agents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="mt-4">
              <div className="h-6 flex gap-2 mb-4 justify-start items-center">
                <Bot size={20} />
                <span className="text-sm">All Trending Agents</span>
              </div>

              {isLoading && <AgentListSkeleton />}

              {!isLoading && agentList && agentList.length === 0 && (
                <div>No agents found.</div>
              )}

              {!isLoading && agentList && agentList.length > 0 && (
                <AgentList agents={agentList} />
              )}
            </TabsContent>

            <TabsContent value="latest" className="mt-4">
              <AgentList agents={agentList} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  );
};

export default Agents;

const AgentListSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Skeleton className="h-5 w-8 rounded-full" />
          <Skeleton className="h-4 w-full mr-12 rounded-sm" />
        </div>
      ))}
    </div>
  );
};
