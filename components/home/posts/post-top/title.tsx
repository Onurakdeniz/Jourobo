import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { usePostStore } from "@/store/posts";

const PostTitle = () => {

  const summary = usePostStore((state) => state.summary);
  return (
    <div className="flex ">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className=" line-clamp-5 text-xl font-thin">
              {summary}
            </span>
          </TooltipTrigger>
          <TooltipContent
            className="w-72"
            side="bottom"
            align="start"
            sideOffset={2}
          >
            <p>
            {summary}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default PostTitle;
