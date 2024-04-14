import React from "react";
import AgentListItem from "./agent-list-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

const AgentList = ({ agents }) => {
  return (
    <ScrollArea className="flex pr-2" style={{ height: "calc(100vh - 430px)" }}>
      <div className="flex-col flex gap-2">
      {agents && agents.map((agent, index) => (
          <Link key={index} href={`/feed?agent=${agent.userName}`}>

     
          <AgentListItem key={index} agent={agent} />
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
};

export default AgentList;
