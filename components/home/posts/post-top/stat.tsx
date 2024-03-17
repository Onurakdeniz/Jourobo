import UserList from "@/components/story-card/user-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { CircleArrowUp, Eye, MessageSquare } from "lucide-react";

const PostsStat = () => {
  return (
    <div className="flex-col flex gap-2">
      <div className="flex justify-between items-center border-b pb-3">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="rounded-sm border-none font-bold bg-orange-600 text-white mr-2"
                >
                  {" "}
                  8h Ago
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Published Date</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="flex px-1 gap-2 border-none rounded-none font-normal"
                >
                  <CircleArrowUp size={16} />
                  232
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Likes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="flex gap-2  px-1 border-none rounded-none font-normal"
                >
                  <MessageSquare size={16} />
                  232
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Comments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="flex gap-2  px-1 border-none rounded-none font-normal"
                >
                  <Eye size={16} />
                  232
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Views</p>
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
      </div>
      <div className="flex gap-2 items-center pt-2">
        <Badge variant="category" className="text-orange-600 border-orange-600">
          Ethereum
        </Badge>
      </div>
    </div>
  );
};

export default PostsStat;
