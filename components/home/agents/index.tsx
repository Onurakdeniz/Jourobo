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

const Agents = () => {
  return (
    <Tabs defaultValue="trending" className=" h-full">
      
      <TabsList className="flex gap-8 justify-start w-full bg-background mt-4  ">
        <TabsTrigger className="justify-start p-0 w-20 pb-1 text-base rounded-none data-[state=active]:shadow-none data-[state=active]:border-orange-600 data-[state=active]:border-b-2" value="trending">Trending</TabsTrigger>
        <TabsTrigger className="justify-start p-0 w-20 pb-1 text-base rounded-none data-[state=active]:shadow-none data-[state=active]:border-orange-600 data-[state=active]:border-b-2" value="latest">Latest</TabsTrigger>
      </TabsList>
      <TabsContent value="trending" className="mt-4 ">
        <div className="h-6 flex gap-2 mb-4 justify-start items-center  ">
            <Bot className="  " size={20} />  
          <span className="font-bold "> All Trending Agents</span>
        </div>
 
        <AgentList />
      </TabsContent>
      <TabsContent value="latest"></TabsContent>
    </Tabs>
  );
};

export default Agents;
