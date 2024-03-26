import { UserList } from "@/components/story-card/user-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePostStore } from "@/store/posts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { CircleArrowUp, Eye, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const calculateTimeDifference = (dateString: any) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null; // Or render some fallback UI
  }
  const timeDifference = formatDistanceToNow(date, { addSuffix: true });
  return timeDifference.replace("about ", "");
};
const PostsStat = () => {
  const storyInformation = usePostStore((state) => state.storyInformation);
  const sourceState = usePostStore((state) => state.source);
  let storyDate;
  if (storyInformation && storyInformation.createdAt) {
    storyDate = calculateTimeDifference(storyInformation.createdAt);
  }

  return (
    <div className="flex-col flex gap-2">
      <div className="flex justify-between items-center border-b pb-3">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="default"
                  className="rounded-sm border-none font-bold   mr-2"
                >
                  {storyDate}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Published Date</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="flex px-1 gap-2 border-none rounded-none font-normal"
                >
                  <CircleArrowUp size={16} />
                  {storyInformation?.voteAmount}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p></p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="flex gap-2  px-1 border-none rounded-none font-normal"
                >
                  <Eye size={16} />
                  {storyInformation?.views}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Views</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex gap-2 items-center pt-2">
        <div className=" text-sm items-center">
          {sourceState?.inputType === "FARCASTER_CHANNEL" ? (
            <div className="items-center flex gap-1">
              <span className="  font-normal"> Channel Name</span>{" "}
              <Badge
                variant="default"
                className="ml-2 px-3 py-1    capitalize"
              >
                {" "}
                {sourceState.sourceId}{" "}
              </Badge>
            </div>
          ) : sourceState?.inputType === "FARCASTER_USER" ? (
            <div className="items-center flex gap-1">
              <span className="  font-normal"> Farcaster User Ids : </span>{" "}
              <Badge
                variant="default"
                className="ml-2 px-3 py-1   capitalize"
              >
                {" "}
                {sourceState.sourceId}{" "}
              </Badge>
            </div>
          ) : ( null
           
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsStat;
