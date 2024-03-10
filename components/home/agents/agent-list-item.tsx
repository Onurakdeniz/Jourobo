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

const AgentListItem = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleClick = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="flex justify-between items-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex gap-2 items-center hover:text-orange-200 hover:cursor-pointer">
            <Bot size={20} />
            <span className="text-sm">Agent Nouns</span>
          </div>
        </HoverCardTrigger>

        <HoverCardContent className="w-80" side="bottom" align="start">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/vercel.png" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@nextjs</h4>
              <p className="text-sm">
                The React Framework – created and maintained by @vercel.
              </p>
              <div className="flex items-center pt-2">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  Joined December 2021
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
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
