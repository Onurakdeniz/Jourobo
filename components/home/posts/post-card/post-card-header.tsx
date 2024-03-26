import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const calculateTimeDifference = (dateString: any) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null; // Or render some fallback UI
  }
  const timeDifference = formatDistanceToNow(date, { addSuffix: true });
  return timeDifference.replace("about ", "");
};

const PostCardHeader = ({
  authorDisplayName,
  authorAvatar,
  authorFollowers,
  authorUserName,
  authorId,
  postCreatedAt,
  hash,
}) => {
  let createdDate;
  if (postCreatedAt) {
    createdDate = calculateTimeDifference(postCreatedAt);
  }
  return (
    <div className="flex-col flex gap-1 ">
      <div className="flex gap-1 items-center">
        <Avatar className="h-5 w-5">
          <AvatarFallback> sds </AvatarFallback>
          <AvatarImage src={authorAvatar} />
        </Avatar>

        <div className="text-sm hover:cursor-pointer ">
          <span>{authorDisplayName}</span>

          <span className="pl-2 text-muted-foreground">@{authorUserName}</span>
        </div>
        <div className="text-xs ml-1 text-muted-foreground">
          {createdDate}
        </div>
      </div>
      <TooltipProvider>
      <Tooltip>
        <TooltipTrigger  className="flex w-full mx-0">
        <Badge variant={"outline"} className="w-fit font-light my-1 mx-0" >{hash} </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          <p>Farcast Hash</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider> 

    </div>
  );
};

export default PostCardHeader;
