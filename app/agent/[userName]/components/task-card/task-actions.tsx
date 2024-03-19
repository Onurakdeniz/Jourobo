import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CirclePlay, CircleStop, Ellipsis, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface TaskActionsProps {
  taskId: string;
  taskPromptId: string;
}

const TaskActions: React.FC<TaskActionsProps> = ({ taskId, taskPromptId }) => {
  const { userName } = useParams();

  const router = useRouter();

  const isActive = Math.random() > 0.5;

  return (
    <div className="flex w-2/12 justify-end gap-4 ">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex gap-2 items-center"
              onClick={() => {
                if (isActive) {
                  // Call your stop function
                } else {
                  // Call your start function
                }
              }}
            >
              {isActive ? <CircleStop size={20} /> : <CirclePlay size={20} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isActive ? " Stop Runing Task" : "Start Running Task"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex gap-2 items-center"
              onClick={() =>
                router.push(`/agent/${userName}/task?id=${taskId}`)
              }
            >
              <Eye size={14} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Agent</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TaskActions;
