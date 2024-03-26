import React, { useEffect, useState } from "react";
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

const CardFooter = ({ storyId, views, vote, bookMarks }) => {
  const { data: voteStatus, refetch: refetchVoteStatus } =
    useVoteStatus(storyId);
  const { mutate: toggleVote, isPending: isVotePending } = useVoteMutation();

  const { data: saveStatus, refetch: refetchSaveStatus } =
    useSaveStatus(storyId);
  const { mutate: toggleSave, isPending: isSavePending } = useSaveMutation();

  const [localBookmarks, setLocalBookmarks] = useState(bookMarks);
  const [localBookmarkStatus, setLocalBookmarkStatus] = useState(
    saveStatus?.isBookmarked
  );
  const [localViews, setLocalViews] = useState(views); // Example initial state

  const [voteStatusState, setVoteStatusState] = useState(voteStatus);
  const [localVotes, setLocalVotes] = useState(vote);

  console.log("voteStatus", voteStatus);
  console.log("voteStatusState", voteStatusState);
  console.log("localBookmarkStatus", localBookmarkStatus);

  const handleVote = (voteAction: "UP" | "DOWN") => {
    toggleVote(
      { storyId, voteAction },
      {
        onSuccess: () => {
          let voteIncrement = 0;
          if (voteStatusState === null) {
            voteIncrement = voteAction === "UP" ? 1 : -1;
          } else if (voteStatusState === "UP") {
            voteIncrement = voteAction === "UP" ? -1 : -2;
          } else if (voteStatusState === "DOWN") {
            voteIncrement = voteAction === "UP" ? 2 : 1;
          }

          setVoteStatusState(prevState => 
            prevState === voteAction ? null : voteAction
          );
          setLocalVotes(prev => prev + voteIncrement);
          refetchVoteStatus();
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
          setLocalBookmarkStatus((prev) => !prev);

          // Update the local bookmarks count based on the new status
          // Assuming localBookmarkStatus is true when the story is currently bookmarked (before toggling)
          setLocalBookmarks((prev) =>
            localBookmarkStatus ? Math.max(0, prev - 1) : prev + 1
          );
        },
      }
    );
  };

  return (
    <div className="flex gap-2">
      <div className="flex gap-1 items-center border px-1 py-1 bg-primary/5 rounded-full">
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 ${
            voteStatusState === "DOWN" ? "text-orange-600" : "text-white"
          }`}
          onClick={() => handleVote("DOWN")}
          disabled={isVotePending}
        >
          <CircleArrowDown size={16} />
        </Button>
        <div className="text-xs font-bold">{localVotes}</div>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 ${
            voteStatusState === "UP" ? "text-orange-600" : "text-white"
          }`}
          onClick={() => handleVote("UP")}
          disabled={isVotePending}
        >
          <CircleArrowUp size={16} />
        </Button>
      </div>

      <div className="flex gap-1 items-center border px-2 py-1 bg-primary/5 rounded-full">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-1"
          onClick={handleBookmarkToggle}
          disabled={isSavePending}
        >
          {isSavePending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : localBookmarkStatus ? (
            <BookmarkCheck size={16} />
          ) : (
            <Bookmark size={16} />
          )}
        </Button>
        <div className="text-xs flex gap-1 items-center">{localBookmarks}</div>
      </div>
    </div>
  );
};

export default CardFooter;
