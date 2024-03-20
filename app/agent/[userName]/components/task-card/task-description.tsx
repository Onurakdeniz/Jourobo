import { Badge } from "@/components/ui/badge";
import { Coins, Eye, Newspaper, RefreshCcwDot , Clock2} from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TaskDescription = (
  {
    taskDescription,
    taskTotalViews,
    taskRunsCount,
    taskInterval,
  }: {
    taskDescription: string;
    taskTotalViews: number;
    taskRunsCount: number;
    taskInterval: string;
  
  }
) => {
  return (
    <div className="flex items-center gap-4 w-7/12 justify-between">
      <span className="text-xs text-muted-foreground w-96 line-clamp-3 ">
        {taskDescription}
      </span>

      <div className="flex gap-6 items-center">

      <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex gap-2 items-center">
                <Eye size={18} />

                <div className="text-lg font-bold flex gap-1 items-center self-end">
                  {taskTotalViews}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Total Story Views
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex gap-2 items-center">
                <RefreshCcwDot size={18} />

                <div className="text-lg font-bold flex gap-2 items-center self-end">
                  {taskRunsCount}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Number of Runs</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
            {taskInterval && (
  <div className="flex gap-2 items-center">
    <Clock2 size={18} />
    <div className="text-lg font-bold flex gap-1 items-center self-end">
      {taskInterval} <span>H</span>
    </div>
  </div>
)}
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Interval Run
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

       
      </div>
    </div>
  );
};

export default TaskDescription;
