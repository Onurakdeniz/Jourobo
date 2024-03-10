import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserListItem = () => {
  return (
    <div className="flex gap-1 items-center">
      <Avatar className="w-6 h-6  border-2">
        <AvatarImage src="/soty.png" alt="avatar" />
        <AvatarFallback className="text-xs">OA</AvatarFallback>
      </Avatar>

      <div className="text-xs text-muted-foreground">@onurakdeniz</div>
    </div>
  );
};

export default UserListItem;
