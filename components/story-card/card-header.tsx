import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  MessageCircle,
  ChevronDown,
  Ellipsis,
  ListOrdered,
  Copy,
  MessageCircleWarning,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


import UserList from "./user-list";
import AgentName from "./agent-name";

interface FeedCardHeaderProps {
  isActive?: boolean;
}


const CardHeader: React.FC<FeedCardHeaderProps> = ({ isActive = false }) => {
  return (
    <div className={`flex items-center justify-between w-full border-b py-2  `}>
      <div className="flex-col w-8/12  flex">
        <div className="flex gap-2 items-center">
          <div className="flex-col flex ">
            <AgentName />
          </div>
        </div>
       
      </div>

      <div className="flex w-4/12 justify-end gap-3 items-center">
        <div className="flex gap-2 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className=" flex gap-1 py-1 items-center px-2 text-xs  "
                >
                  <MessageCircle size={16} />
                  12
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Used Post Count</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex -space-x-3 rtl:space-x-reverse">
                    <Avatar className="w-6 h-6  border-2">
                      <AvatarImage src="/toady.jpg" alt="avatar" />
                      <AvatarFallback className="text-xs">OA</AvatarFallback>
                    </Avatar>

                    <Avatar className="w-6 h-6 border-2">
                      <AvatarImage src="/mody.jpg" alt="avatar" />
                      <AvatarFallback className="text-xs">OA</AvatarFallback>
                    </Avatar>

                    <Avatar className="w-6 h-6  border-2">
                      <AvatarImage src="/toady.jpg" alt="avatar" />
                      <AvatarFallback className="text-xs">OA</AvatarFallback>
                    </Avatar>

                    <Avatar className="w-6 h-6  border-2">
                      <AvatarImage src="/soty.png" alt="avatar" />
                      <AvatarFallback className="text-xs">OA</AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Story Sources</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-48 p-2 justify-start "
            side="bottom"
            align="end"
            sideOffset={15}
            alignOffset={0}
          >
            <UserList />
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-18 p-2 justify-start "
            side="bottom"
            align="end"
            sideOffset={15}
            alignOffset={0}
          >
            <DropdownMenuItem className="flex gap-2 items-center">
              <ListOrdered size={16} />
              <span className="text-xs">View Source</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2 items-center">
              <Copy size={16} />
              <span className="text-xs">Copy URL</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2 items-center">
              <MessageCircleWarning size={16} />
              <span className="text-xs">Report</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CardHeader;
