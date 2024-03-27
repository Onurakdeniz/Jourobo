import React, { use, useEffect, useState } from "react";
import { useVoteMutation } from "@/hooks/useVoteMutation";
import { useSaveMutation } from "@/hooks/useSaveMutation";
import { useVoteStatus } from "@/hooks/useVoteStatus";
import { useSaveStatus } from "@/hooks/useSaveStatus";
import {
  Eye,
  CircleArrowDown,
  CircleArrowUp,
  Bookmark,
  Loader2,
  BookmarkCheck,
} from "lucide-react";
import { Button } from "../ui/button";
import { useBookmarkedStore } from "@/store";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useFetchStories } from "@/hooks/useFetchStories";

const CardFooter = ({ storyId, views, vote, bookMarks }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: voteStatus, refetch: refetchVoteStatus } =
    useVoteStatus(storyId);
  const { mutate: toggleVote, isPending: isVotePending } = useVoteMutation();

  const { data: saveStatus, refetch: refetchSaveStatus } =
    useSaveStatus(storyId);
  const { mutate: toggleSave, isPending: isSavePending } = useSaveMutation();
  const { storiesState, isLoading, error, refetch : refetchBookmarks } =
  useFetchStories( {bookmarked: true});
  const [localBookmarks, setLocalBookmarks] = useState(bookMarks);

  const [localViews, setLocalViews] = useState(views); // Example initial state
  const [currentAction, setCurrentAction] = useState("");
  const [localVotes, setLocalVotes] = useState(vote);
  const isBookMarked = useBookmarkedStore((state) => state.isBookMarked);

  console.log("voteStatus?.voteType", voteStatus?.voteType);

  const handleVote = (voteAction: "UP" | "DOWN") => {
    toggleVote(
      { storyId, voteAction },
      {
        onSuccess: () => {
          let voteIncrement = 0;

          switch (voteStatus?.voteType) {
            case "NONE":
              // No previous vote: increment/decrement by 1 based on the action
              voteIncrement = voteAction === "UP" ? 1 : -1;
              break;
            case "UP":
              // If previously upvoted
              voteIncrement = voteAction === "UP" ? -1 : -2; // Undo the upvote or switch to a downvote
              break;
            case "DOWN":
              // If previously downvoted
              voteIncrement = voteAction === "UP" ? 2 : 1; // Switch to an upvote or undo the downvote
              break;
          }
          const newStatus = refetchVoteStatus();
          setLocalVotes((prev) => prev + voteIncrement);
        },
      }
    );
  };

  const handleBookmarkToggle = () => {
    toggleSave(
      { storyId },
      {
        onSuccess: () => {
          // Toggle the local bookmark status
          refetchSaveStatus();
          pathname === "/bookmarks" && router.replace("/bookmarks");
          refetchBookmarks();
          // Update the local bookmarks count based on the new status
          // Assuming localBookmarkStatus is true when the story is currently bookmarked (before toggling)
          setLocalBookmarks((prev) =>
            isBookMarked ? Math.max(0, prev - 1) : prev + 1
          );
        },
      }
    );
  };

  return (
    <div className="flex gap-2">
      <div className="flex gap-1 items-center border px-1 py-1  rounded-md">
        <Button
          variant="link"
          size="sm"
          className={`h-8 ${
            voteStatus?.voteType === "DOWN" ? "text-orange-600" : "text-current"
          }`}
          onClick={() => {
            setCurrentAction("DOWN");
            handleVote("DOWN");
          }}
          disabled={isVotePending}
        >
          {isVotePending && currentAction === "DOWN" ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <CircleArrowDown size={20} />
          )}
        </Button>
        <div className=" text-base">{localVotes}</div>
        <Button
          variant="link"
          size="sm"
          className={`h-8 ${
            voteStatus?.voteType === "UP" ? "text-orange-600" : "text-current"
          }`}
          onClick={() => {
            setCurrentAction("UP");
            handleVote("UP");
          }}
          disabled={isVotePending}
        >
          {isVotePending && currentAction === "UP" ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <CircleArrowUp size={20} />
          )}
        </Button>
      </div>

      <div className="flex gap-1 items-center border px-2 py-1   rounded-md">
        <Button
          variant="link"
          size="sm"
          className="h-6 px-1"
          onClick={handleBookmarkToggle}
          disabled={isSavePending}
        >
          {isSavePending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : isBookMarked ? (
            <BookmarkCheck size={20} className="text-orange-600" />
          ) : (
            <Bookmark size={20} />
          )}
        </Button>
        <div className="text-base flex gap-1 items-center">{localBookmarks}</div>
      </div>
    </div>
  );
};

export default CardFooter;
