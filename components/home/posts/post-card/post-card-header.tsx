import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import React from "react";

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
}) => {
  let createdDate;
  if (postCreatedAt) {
    createdDate = calculateTimeDifference(postCreatedAt);
  }
  return (
    <div className="flex justify-between items-center  h-10 ">
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
    </div>
  );
};

export default PostCardHeader;
