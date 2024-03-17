import React from "react";
import AgentCard from "./agent-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgencyStore } from "@/store/agency";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react"
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAgentByAgentUserNameSchema } from "@/schemas";
import { z } from "zod";

const AgencyList = () => {
  const selectedAgency = useAgencyStore((state) => state.selectedAgency);
  const agents = selectedAgency?.agents || [];
  const params = useParams()
  const agencyId = params.userName;
 
  
  // Conditional rendering logic moved outside the return statement
  if (agents.length > 0) {
    return (
      <ScrollArea className="flex overflow-auto pr-4" style={{ height: "calc(100vh - 160px)" }}>
        <div className="flex-col flex py-6 gap-4 w-full">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </ScrollArea>
    );
  } else {
    return (
      <div className="flex w-full   justify-center items-center" style={{ height: "calc(100vh - 160px)" }}>
        <div className="flex-col flex gap-8 mb-20 justify-center items-center">
          <Bot size={100} className="text-muted-foreground" />
          <span className="text-muted-foreground text-base">
            You do not have any agents, please create one.
          </span>
         
         <Link 
         className="w-full"
        
          href={`/agency/${agencyId}/create-agent`}>
            <Button className="w-full">Create Your Agent</Button> </Link>
     
        </div>
      </div>
    );
  }
};

export default AgencyList;