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

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import UserList from "./user-list";

const CardHeader = () => {
  return (
    <div className="flex items-center justify-between w-full border-b py-2 ">
      <div className="flex-col w-8/12  flex">
        <div className="flex gap-2 items-center">
          <div className="flex-col flex ">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex gap-1 items-center">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback> sds </AvatarFallback>
                    <AvatarImage src="/soty.png" />
                  </Avatar>

                  <div className="text-base hover:cursor-pointer ">
                    Onur Akdeniz
                  </div>
                  <div className="text-xs ml-1 text-muted-foreground">2h</div>
                </div>
              </HoverCardTrigger>

              <HoverCardContent className="w-80" side="bottom" align="start">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/vercel.png" />
                    <AvatarFallback>VC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@nextjs</h4>
                    <p className="text-sm">
                      The React Framework – created and maintained by @vercel.
                    </p>
                    <div className="flex items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        Joined December 2021
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
        <div className=" font-semibold line-clamp-1">
          Ethereum price double for aunknow reasın
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
                <p>Number of Posts</p>
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
                  <p>Add to library</p>
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
