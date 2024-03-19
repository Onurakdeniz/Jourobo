import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAgentSchema } from "@/schemas";
import { z } from "zod";
import { CircleDot, CircleStop } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Generate a random date between now and 30 days ago
const agentCreated = new Date(
  Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30
).toISOString();

// Define some possible categories
const possibleCategories = [
  "Category 1",
  "Category 2",
  "Category 3",
  "Category 4",
  "Category 5",
];

// Randomly pick one or more categories
const categories = Array.from(
  { length: Math.floor(Math.random() * possibleCategories.length) },
  () =>
    possibleCategories[Math.floor(Math.random() * possibleCategories.length)]
);

const isActive = Math.random() > 0.5;

const TaskInfo = ({
  taskName,
  taskCreatedAt,
  isOneTimeRun,
  state,
}: {
  taskName: string;
  taskCreatedAt: string;
  isOneTimeRun: boolean;
  state: string;
}) => {
  return (
    <div className="flex items-center   w-3/12  gap-2">
      <div className="flex w-1/6 justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isActive ? (
                <CircleDot size={24} className="text-green-600" />
              ) : (
                <CircleDot size={24} className="text-red-600" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{isActive ? "Running" : "Stopped"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className=" flex justify-start  w-5/6 ">
        <div className="flex gap-3 items-center">
          <div className="flex-col flex gap-1 items-start">
            <span className=" font-semibold text-sm capitalize truncate w-60  ">
              {taskName}
            </span>
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="   flex text-xs font-light">
                {taskCreatedAt && !isNaN(Date.parse(taskCreatedAt))
                  ? new Date(taskCreatedAt).toLocaleDateString()
                  : "N/A"}
              </Badge>
              <Badge variant="default" className=" px-2  flex text-xs font-light">
                {isOneTimeRun ? "Static Run" : "Dynamic Run"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-col flex gap-1"></div>
    </div>
  );
};

export default TaskInfo;
