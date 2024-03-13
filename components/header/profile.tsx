"use client";
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
import { usePrivy, useLogin } from "@privy-io/react-auth";

const Profile = () => {
  const { ready, authenticated, user, getAccessToken, isModalOpen, logout } =
    usePrivy();

 
  const displayName = user?.farcaster?.displayName || "User";

  const { login } = useLogin({
    onComplete: async (user, isNewUser) => {
      await fetch("/api/register", { method: "POST" });
    },
  });

  console.log("usera", user);
  <button
    onClick={login}
    className="bg-primary-500 text-white px-4 py-2 rounded-md"
  >
    Login
  </button>;

  return (
    <>
      {ready && authenticated ? (
        <div className="flex w-3/12 gap-2 items-center justify-end">
          <ModeToggle />
          <Avatar className="h-8 w-8">
            <AvatarFallback> {displayName.charAt(0)} </AvatarFallback>
            <AvatarImage src={user?.farcaster?.pfp} />
          </Avatar>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex gap-1 items-center">
                <div className="text-sm">{displayName}</div>
                <ChevronDown size={16} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-44"
              side="bottom"
              align="end"
              sideOffset={15}
              alignOffset={0}
            >
              <DropdownMenuLabel>
                FID : {user?.farcaster?.fid}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex w-3/12 gap-2 items-center justify-end">
          <ModeToggle />
          <button
            onClick={login}
            className="bg-primary-500 text-white px-4 py-2 rounded-md"
          >
            Login
          </button>
        </div>
      )}
    </>
  );
};

export default Profile;
