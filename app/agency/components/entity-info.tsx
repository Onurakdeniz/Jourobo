import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Define a type for the props
interface EntityInfoProps {
  entityName: string; // Renamed from agencyName
  entityCreatedDate: string; // Renamed from agencyCreatedDate
  entityLogo: string; // Renamed from agencyLogo
  ownerName: string;
  ownerAvatar: string;
}

const EntityInfo: React.FC<EntityInfoProps> = ({
  entityName,
  entityCreatedDate,
  entityLogo,
  ownerName,
  ownerAvatar,
}) => {
  return (
    <div className="flex gap-2 items-start my-auto justify-between w-full ">
      <div className="flex gap-1 pl-1 items-center">
        <Avatar className="h-12 w-12 rounded-md">
          <AvatarFallback className="h-12 w-12 text-lg font-bold rounded-md">
            {entityName ? entityName[0].toUpperCase() : ""}
          </AvatarFallback>
          <AvatarImage src={entityLogo} className="border-2" />
        </Avatar>
        <TooltipProvider>
          <div className="flex-col flex gap-1 items-start">
            <span className="font-bold text-sm truncate w-48 pl-1">
              {entityName}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="hidden lg:flex text-xs font-light">
                  {entityCreatedDate && !isNaN(Date.parse(entityCreatedDate))
                    ? new Date(entityCreatedDate).toLocaleDateString()
                    : "N/A"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Created Date</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div className="hidden lg:flex gap-2 self-center">
        <Avatar className="h-5 w-5">
          <AvatarFallback> D </AvatarFallback>
          <AvatarImage src={ownerAvatar} />
        </Avatar>
        <div className="flex gap-1 items-center">
          <div className="text-xs">@{ownerName}</div>
        </div>
      </div>
    </div>
  );
};

export default EntityInfo;
