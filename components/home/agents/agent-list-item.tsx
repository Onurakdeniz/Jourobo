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

const AgentListItem = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleClick = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="flex justify-between items-center h-8">
       <AgentName isNavbar={true} />
      <div className="flex gap-2 items-center">
      
        
       
        <Badge variant="default" className="text-xs px-1 py-0 justify-end">
          <span>232</span>
        </Badge>
      </div>
    </div>
  );
};

export default AgentListItem;
