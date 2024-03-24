import React from "react";
import AgentListItem from "./agent-list-item";
import { ScrollArea } from "@/components/ui/scroll-area";

const AgentList = ({ agents }) => {
  return (
    <ScrollArea className="flex pr-2" style={{ height: "calc(100vh - 430px)" }}>
      <div className="flex-col flex gap-2">
        {agents.map((agent, index) => (
          <AgentListItem key={index} agent={agent} />
        ))}
      </div>
    </ScrollArea>
  );
};

export default AgentList;
