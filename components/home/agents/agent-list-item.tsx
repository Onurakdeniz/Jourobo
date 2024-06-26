import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, CalendarIcon, Eye } from "lucide-react";
import React, { useState } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AgentName from "@/components/story-card/agent-name";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AgentListItem = ({ agent }: { agent: any }) => {
  const [isFollowing, setIsFollowing] = useState(false);
 
  const handleClick = () => {
    setIsFollowing(!isFollowing);
  };
  const createdAt = agent.created;
  return (
    <div className="flex justify-between items-center h-8">
      <AgentName agentValue={agent} createdAt={createdAt} isNavbar={true} />
      <div className="flex gap-2 items-center">
        
      </div>
    </div>
  );
};

export default AgentListItem;
