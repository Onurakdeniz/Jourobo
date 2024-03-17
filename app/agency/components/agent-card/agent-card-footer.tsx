import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Ellipsis, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const AgentCardFooter = ({ agentUserName }: { agentUserName: string }) => {
  const router = useRouter();

  return (
    <div className="flex w-1/12 justify-end gap-4 ">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex gap-2 items-center"
              onClick={() => router.push(`/agent/${agentUserName}`)}
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

export default AgentCardFooter;
