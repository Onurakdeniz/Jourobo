import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Newspaper, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchAgent } from "@/hooks/useFetchAgent";
import { useSearchParams } from "next/navigation";
import { useFollowStatus } from "@/hooks/useFollowStatus";
import { useFollowUnfollowMutation } from "@/hooks/useFollowAgent";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const AgentTop = () => {
  const searchParams = useSearchParams();
  const agent = searchParams.get("agent");

  const userName = agent as string;

  console.log("userName", userName);

  const withDetails = false;
  const { agentState, error, isLoading, refetch } = useFetchAgent(
    withDetails,
    userName
  );

  const { data: followStatus, isLoading: isLoadingStatus } = useFollowStatus(
    agentState?.id
  );

  const [isFollowed, setIsFollowed] = useState<boolean>(
    followStatus?.isFollowing || false
  );

  useEffect(() => {
    if (followStatus) {
      setIsFollowed(followStatus.isFollowing);
    }
  }, [followStatus]);

  const { mutate, isPending, isError } = useFollowUnfollowMutation();

  const handleFollowClick = () => {
    const action = isFollowed ? "unfollow" : "follow";
    mutate(
      { agentId: agentState.id, action },
      {
        // onSuccess callback for updating UI based on successful mutation
        onSuccess: () => {
          setIsFollowed(!isFollowed);
        },

        onError: (error: Error) => {
          console.error("Mutation error:", error.message);
        },
      }
    );
  };

  console.log("agentStatefoo", agentState);

  if (isLoading || isLoadingStatus) {
    return agentTopSkeleton();
  }

  return (
    <div className="flex-col flex gap-4 w-full mb-6 px-2 pb-2 border-b">
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-1 items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-base font-bold uppercase">
              DE
            </AvatarFallback>
            <AvatarImage src={agentState?.profile?.avatarUrl} />
          </Avatar>
          <div className=" text-2xl  font-semibold ">
            {agentState?.profile?.name || "No name provided"}
          </div>
          <div className="flex gap-2 items-center ml-2">
            <Badge variant={"outline"} className="flex  gap-2 m-0 py-2 px-3">
              <Newspaper className="h-4 w-4" />
              <span> {agentState?.storyCount}</span>
            </Badge>

            <Badge variant={"outline"} className="flex  gap-2 m-0 py-2 px-3">
              <User className="h-4 w-4" />
              <span> {agentState?.followersCount}</span>
            </Badge>
          </div>
          <div className="flex gap-1 items-center">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs  uppercase">DE</AvatarFallback>
              <AvatarImage src={agentState?.userProfile?.avatarUrl} />
            </Avatar>
            <div className="text-xs text-muted-foreground">
              @{agentState?.userProfile?.userName}
            </div>
          </div>
        </div>
        <Button
          className="px-2 py-1 h-6"
          onClick={handleFollowClick}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isFollowed ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </Button>
      </div>
      <div>
        <p className="text-sm ">
          {agentState?.profile?.description || "No description provided"}
        </p>
      </div>
    </div>
  );
};

const agentTopSkeleton = () => {
  return (
    <div className="h-28 flex flex-col gap-3"> 
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-12 w-full" />
        </div>
  );
};
