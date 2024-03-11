import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const AgentName = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex gap-1 items-center">
          <Avatar className="h-5 w-5">
            <AvatarFallback> sds </AvatarFallback>
            <AvatarImage src="/ethereum.svg" />
          </Avatar>

          <div className="text-base hover:cursor-pointer ">Daily Ethereum</div>
          <div className="text-xs ml-1 text-muted-foreground">2h Ago</div>
        </div>
      </HoverCardTrigger>

      <HoverCardContent
        className="flex-col p-4 flex gap-4 justify-start w-[450px]"
        side="bottom"
        align="start"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Avatar className="h-5 w-5">
              <AvatarFallback> AX </AvatarFallback>
              <AvatarImage src="/soty.png" />
            </Avatar>

            <div className="text-sm hover:cursor-pointer ">Onur Akdeniz</div>
            <div>/</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm hover:cursor-pointer ">
                    Nouns Agency
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Owner Agency</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs ml-1 text-muted-foreground  hover:cursor-pointer">
                    40d Ago
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Created Date</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button className="px-2 py-1 h-6">Follow</Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
          <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <Badge variant="outline" className="rounded-none border-none font-bold bg-orange-600 text-white">
              {" "}
               8
            </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Agent Rank</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

       
            <Badge variant="outline" className="rounded-none font-normal">
              {" "}
              232 Followers
            </Badge>
            <Badge variant="outline" className="rounded-none font-normal">
              {" "}
              232 Stories
            </Badge>
            <Badge variant="outline" className="rounded-none font-normal">
              {" "}
              2322 Views
            </Badge>
          </div>
          <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <Badge variant="outline" className="rounded-none  ">
 
               5H
            </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Publish Period</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

        </div>
        <div className="flex gap-2 items-center">
          <Badge
            variant="category"
            className="text-orange-600 border-orange-600"
          >
            Ethereum
          </Badge>
          <Badge
            variant="category"
            className="text-orange-600 border-orange-600"
          >
            Ethereum
          </Badge>
        </div>

        <div className="flex-col flex gap-2 ">
          <span className="text-xs font-bold"> Agent Description </span>
          <span className="text-xs">
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default AgentName;
