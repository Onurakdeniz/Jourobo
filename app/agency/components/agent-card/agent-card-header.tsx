import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAgentSchema } from "@/schemas";
import { z } from "zod";

type AgentInfoProps = {
  agentName: string;
  agentRank: string;
  agentCreated: string;
  agentAvatar: string;
  categories: z.infer<typeof getAgentSchema>["categories"];
};

const AgentInfo: React.FC<AgentInfoProps> = ({
  agentName,
  agentRank,
  agentCreated,
  agentAvatar,
  categories,
}) => {
  return (
    <div className="flex items-center   w-5/12  gap-8">
      <div>
        <div className="flex gap-3 items-center">
          <Avatar className="h-12 w-12 rounded-full">
            <AvatarFallback> D </AvatarFallback>
            <AvatarImage src={agentAvatar} />
          </Avatar>

          <div className="flex-col flex gap-1 items-start">
            <span className=" font-bold text-sm truncate w-48  ">
              {agentName}
            </span>
            <div className="flex gap-2 items-center">
              <Badge
                variant="default"
                className=" flex px-2 text-white py-0 text-xs rounded-sm font-bold bg-orange-600"
              >
                {agentRank}
              </Badge>
              <Badge variant="outline" className="   flex text-xs font-light">
                {agentCreated && !isNaN(Date.parse(agentCreated))
                  ? new Date(agentCreated).toLocaleDateString()
                  : "N/A"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-col flex gap-1">
        <div className="flex gap-2 items-center w-full">
          {categories &&
            categories.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className="flex font-light py-1 text-[10px] rounded-sm"
              >
                {category.name}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AgentInfo;
