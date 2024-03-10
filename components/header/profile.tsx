import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "../theme-toggle";

const Profile = () => {
  return (
    <div className="flex w-3/12 gap-2 items-center justify-end">
        <ModeToggle />
      <Avatar className="h-8 w-8">
        <AvatarFallback> sds </AvatarFallback>
        <AvatarImage src="/soty.png" />
      </Avatar>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex gap-1 items-center">
            <div className="text-sm">Onur Akdeniz</div>
            <ChevronDown size={16} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44" side="bottom" align="end" sideOffset={15} alignOffset={0}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
