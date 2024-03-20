"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot } from "lucide-react";
import { Agent } from "http";
import AgentList from "./agent-list";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

const Agents = () => {
  const pathname = usePathname();
  const showTrendingAgents = pathname === "/feed";
 

  return (
    <>
      {showTrendingAgents && (
        <>
   
          <Tabs defaultValue="trending" className="border-t mt-2 h-full">
            <TabsList className="flex gap-4 justify-start w-full bg-background mt-4  ">
              <TabsTrigger
                className="justify-start p-0 w-20 pb-1 text-sm rounded-none data-[state=active]:shadow-none data-[state=active]:border-orange-600 data-[state=active]:border-b-2"
                value="trending"
              >
                Trending
              </TabsTrigger>
              <TabsTrigger
                className="justify-start p-0 w-20 pb-1 text-sm rounded-none data-[state=active]:shadow-none data-[state=active]:border-orange-600 data-[state=active]:border-b-2"
                value="new"
              >
                New
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="mt-4 ">
              <div className="h-6 flex gap-2 mb-4   justify-start items-center  ">
                <Bot className="  " size={20} />
                <span className="text-sm "> All Trending Agents</span>
              </div>

              <AgentList />
            </TabsContent>

            <TabsContent value="latest"></TabsContent>
          </Tabs>
        </>
      )}
    </>
  );
};

export default Agents;
