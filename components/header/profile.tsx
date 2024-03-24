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
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const { ready, authenticated, user, getAccessToken, isModalOpen, logout } =
    usePrivy();

  const displayName = user?.farcaster?.displayName || "User";
 
  // to get updated user data
  const { login } = useLogin({
    onComplete: async (user, isNewUser) => {
      await fetch("/api/register", { method: "POST" });
    },
  });

 

  if (!ready) {
    return     <Skeleton className=" flex items-center mt-3 h-5 w-[160px]" />
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  }

 
  return (
    <>
      {ready && authenticated ? (
        <div className="flex w-3/12 gap-2 items-center justify-end">
          <ModeToggle />
          <Avatar className="h-8 w-8">
            <AvatarFallback> {displayName.charAt(0)} </AvatarFallback>
            <AvatarImage src={user?.farcaster?.pfp || ""} />
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
          
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex w-3/12 gap-2 items-center justify-end">
          <ModeToggle />
          <Button onClick={login} className="px-4 py-2 rounded-md">
            Login
          </Button>
        </div>
      )}
    </>
  );
};

export default Profile;
