import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AgentDescription from "./agent-card-body";
import AgentInfo from "./agent-card-header";
import AgentCardFooter from "./agent-card-footer";
import { getAgentSchema } from "@/schemas";
import { z } from "zod";

type getAgent = z.infer<typeof getAgentSchema>;

const AgentCard = ({ agent }: { agent: any }) => {
  console.log(agent,"agent");
  return (
    <div className="flex gap-4 w-full border h-32 px-6 py-4 items-center justify-between rounded-lg">
      <AgentInfo
        agentName={agent.profile.name}
        agentRank={agent.rank}
        agentCreated={agent.createdAt}
        agentAvatar={agent.profile.avatarUrl}
        categories={agent.categories}
      />
      <AgentDescription
      agentDescription={agent.profile.description}
      agentStoryCount={agent.storyCount}
      agentViewCount={agent.viewCount}
      />
      <AgentCardFooter 
      agentUserName={agent.userName}  
      />
    </div>
  );
};

export default AgentCard;
