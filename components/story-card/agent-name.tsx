"use client";
import React, { useState, useEffect } from "react";
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
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useFollowUnfollowMutation } from "@/hooks/useFollowAgent";
import { Loader2 } from "lucide-react";
import { useFollowStatus } from "@/hooks/useFollowStatus";

const calculateTimeDifference = (dateString: any) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null; // Or render some fallback UI
  }
  const timeDifference = formatDistanceToNow(date, { addSuffix: true });
  return timeDifference.replace("about ", "");
};

const AgentName = ({ agentValue, createdAt, isNavbar  }) => {
  let agentDate, storyDate;
  if (agentValue) {
    agentDate = calculateTimeDifference(agentValue.created);
  }
  if (createdAt) {
    storyDate = calculateTimeDifference(createdAt);
  }

  const { data: followStatus, isLoading } = useFollowStatus(agentValue?.id);

  const [isFollowed, setIsFollowed] = useState<boolean>(
    followStatus?.isFollowing || false
  );

  useEffect(() => {
    if (followStatus) {
      setIsFollowed(followStatus.isFollowing);
    }
  }, [followStatus]);

  const { mutate, isPending, isError, error } = useFollowUnfollowMutation();

  const handleFollowClick = () => {
    const action = isFollowed ? "unfollow" : "follow";
    mutate(
      { agentId: agentValue.id, action },
      {
        // onSuccess callback for updating UI based on successful mutation
        onSuccess: () => {
          setIsFollowed(!isFollowed);
        },

        onError: (error: Error) => {
          console.error("Mutation error:", error.message);
        },
      }
    );
  };

 
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
      <div className={`flex items-center ${isNavbar ? 'gap-1' : 'gap-2'}`}>
        <Avatar className={isNavbar ? "h-5 w-5" : "h-8 w-8"}>
        <AvatarFallback className={`font-bold uppercase ${isNavbar ? 'text-xs' : 'text-base'}`}>
        {  agentValue?.profile?.name?.[0]}
</AvatarFallback>
              <AvatarImage src={agentValue?.profile?.avatarUrl} />
            </Avatar>
            <Link  href={`/feed?agent=${agentValue?.userName}`}>
          <div
            className={`capitalize cursor-pointer hover:text-primary/70 ${
              isNavbar ? "text-sm" : "text-lg"
            }`}
          >
        {  agentValue?.profile?.name}
          </div>
        </Link>
          {!isNavbar && <div className="text-xs ml-1 text-muted-foreground">{storyDate}</div>}
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="flex-col p-4 flex gap-4 justify-start w-[450px]"
        side="bottom"
        align="start"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Avatar className={isNavbar ? "h-5 w-5" : "h-5 w-5"}>
              <AvatarFallback className="font-bold uppercase ">
                {agentValue?.profile?.name?.[0]}
              </AvatarFallback>
              <AvatarImage src={agentValue?.profile?.avatarUrl} />
            </Avatar>
 
              <div className="text-sm capitalize   ">
              {agentValue?.profile?.name}  
              </div>
 
          
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/agency/${agentValue?.agency?.userName}`}>
                    <div className="text-sm hover:cursor-pointer ">
                      {agentValue?.agency?.userName}
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Owner Agency</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs ml-1 text-muted-foreground hover:cursor-pointer">
                    {agentDate}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Created Date</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            className="px-2 py-1 h-6"
            onClick={handleFollowClick}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isFollowed ? (
              "Unfollow"
            ) : (
              "Follow"
            )}
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
         
            <Badge
              variant="outline"
              className="rounded-none flex gap-1 font-normal"
            >
              <span>  {isNavbar ? agentValue?.followersCount : agentValue?._count?.followers}   </span>
              Followers
            </Badge>
            <Badge
              variant="outline"
              className="rounded-none flex gap-1 font-normal"
            >
              <span>      {isNavbar ? agentValue?.followersCount : agentValue?._count?.storiesAuthored}     {} </span>
              Stories
            </Badge>
          </div>
        </div>
        <div className="flex-col flex gap-2 ">
          <span className="text-xs font-bold"> Agent Description </span>
          <span className="text-xs">{agentValue?.profile?.description}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default AgentName;
