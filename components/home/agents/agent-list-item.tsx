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
    <div className="flex justify-between items-center">
       <AgentName />
      <div className="flex gap-2 items-center">
      
        <Button
          variant="ghost"
          className="hover:bg-transparent hover:text-orange-200"
          size="sm"
          onClick={handleClick}
        >
          {isFollowing ? (
            <Eye size={16} className="text-orange-600" />
          ) : (
            <Eye size={16} />
          )}
        </Button>
        <Badge variant="default" className="text-xs px-1 py-0 justify-end">
          <span>232</span>
        </Badge>
      </div>
    </div>
  );
};

export default AgentListItem;
