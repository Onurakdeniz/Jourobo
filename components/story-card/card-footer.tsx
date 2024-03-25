import React, { useState } from "react";
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
  const { data: saveStatus, refetch: refetchSaveStatus } =
    useSaveStatus(storyId);
  const { mutate: toggleSave, isPending: isSavePending } = useSaveMutation();

  const [localBookmarks, setLocalBookmarks] = useState(bookMarks);

  const [localViews, setLocalViews] = useState(views);

  console.log("save", saveStatus);
  const handleBookmarkToggle = () => {
    const action = saveStatus?.isBookmarked ? "unsaved" : "saved";
    toggleSave(
      { storyId },
      {
        onSuccess: () => {
          refetchSaveStatus();
          setLocalBookmarks((prev) =>
            action === "saved" ? prev + 1 : Math.max(0, prev - 1)
          );
        },
      }
    );
  };

  return (
    <div className="flex gap-2">
      <div className="flex gap-1 items-center border px-1 py-1 bg-primary/5 rounded-full">
        <VoteComponent storyId={storyId} voteAmount={vote}   />
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
          ) : saveStatus?.isBookmarked ? (
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

const VoteComponent = ({ storyId, voteAmount }) => {
  const { data: voteStatus, refetch: refetchVoteStatus } =
    useVoteStatus(storyId);
  const { mutate: toggleVote, isPending: isVotePending } = useVoteMutation();

  const [localVotes, setLocalVotes] = useState(voteAmount);
  const [voteStatusState , setVoteStatusState] = useState(voteStatus?.voteType);

  console.log("vote", voteStatus);

  const handleVote = (voteAction) => {
    let newVoteAction = voteStatus?.voteType; // Default action is to keep the current status
    let voteChange = 0;
  
    if (!voteStatus?.voteType) {
      // If current status is null, the user did not vote before
      newVoteAction = voteAction;
      voteChange = voteAction === "UP" ? 1 : -1;
    } else if (voteStatus?.voteType === "UP") {
      // If the current status is UP
      if (voteAction === "UP") {
        // If the user clicks up again, revert to null
        newVoteAction = "UP"
        voteChange = -1;
      } else {
        // If the user clicks down, switch to down
        newVoteAction = "DOWN";
        voteChange = -2;
      }
    } else if (voteStatus?.voteType === "DOWN") {
      // If the current status is DOWN
      if (voteAction === "DOWN") {
        // If the user clicks down again, revert to null
        newVoteAction = "DOWN";
        voteChange = 1;
      } else {
        // If the user clicks up, switch to up
        newVoteAction = "UP";
        voteChange = 2;
      }
    }
  
    toggleVote(
      { storyId, voteAction: newVoteAction },
      {
        onSuccess: () => {
          refetchVoteStatus();
          setVoteStatusState(voteStatusState === newVoteAction ? null : newVoteAction);
          setLocalVotes((prev) => prev + voteChange);
        },
      }
    );
  };

  return (
    <div className="flex gap-1 items-center border px-1 py-1 bg-primary/5 rounded-full">
      <Button
        variant="ghost"
        size="sm"
        className={`h-6 ${voteStatusState === "DOWN" ? "text-orange-600" : ""}`}
        onClick={() => handleVote("DOWN")}
        disabled={isVotePending}
      >
        <CircleArrowDown size={16} />
      </Button>

      <div className="text-xs font-bold">{localVotes}</div>

      <Button
        variant="ghost"
        size="sm"
        className={`h-6 ${voteStatusState === "UP" ? "text-orange-600" : ""}`}
        onClick={() => handleVote("UP")}
        disabled={isVotePending}
      >
        <CircleArrowUp size={16} />
      </Button>
    </div>
  );
};
