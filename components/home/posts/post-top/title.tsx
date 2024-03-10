import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

const PostTitle = () => {
  return (
    <div className="flex ">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className=" line-clamp-2 text-base font-bold">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </span>
          </TooltipTrigger>
          <TooltipContent
            className="w-72"
            side="bottom"
            align="start"
            sideOffset={2}
          >
            <p>
              {" "}
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s{" "}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default PostTitle;
