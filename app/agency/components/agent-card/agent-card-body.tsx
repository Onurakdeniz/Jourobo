import { Badge } from "@/components/ui/badge";
import { Coins, Eye, Newspaper , View } from "lucide-react";
import React from "react";

type AgentDescriptionProps = {
  agentDescription: string;
  agentStoryCount: number;
  agentViewCount: number;
};

const AgentDescription: React.FC<AgentDescriptionProps> = ({
  agentDescription,
  agentStoryCount,
  agentViewCount,
}) => {
  return (
    <div className="flex items-center gap-4 w-6/12 justify-between">
      <span className="text-xs text-muted-foreground w-96 line-clamp-4 ">
        {agentDescription}
      </span>

      <div className="flex gap-4 items-center">
        <Badge variant="category" className="flex gap-2 items-center py-1">
          <div className="flex gap-2 items-center">
            <Newspaper size={16} />

            <div className="text-sm font-bold  self-end">{agentStoryCount}</div>
          </div>
        </Badge>

        <Badge variant="category" className="flex gap-2 items-center py-1">
          <div className="flex gap-2 items-center">
            <Eye size={16} />
            <div className="text-sm font-bold  self-end">{agentViewCount}</div>
          </div>
        </Badge>
      </div>
    </div>
  );
};

export default AgentDescription;
