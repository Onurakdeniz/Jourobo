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
  const { data: voteStatus, refetch: refetchVoteStatus } =
    useVoteStatus(storyId);
  const { mutate: toggleVote, isPending: isVotePending } = useVoteMutation();

  const { data: saveStatus, refetch: refetchSaveStatus } =
    useSaveStatus(storyId);
  const { mutate: toggleSave, isPending: isSavePending } = useSaveMutation();

  const [localBookmarks, setLocalBookmarks] = useState(bookMarks); // Example initial state
  const [localViews, setLocalViews] = useState(views); // Example initial state
  const [localVotes, setLocalVotes] = useState(vote); // Example initial state

  const handleVote = (voteAction: any) => {
    toggleVote(
      { storyId, voteAction },
      {
        onSuccess: () => {
          refetchVoteStatus();
        },
      }
    );
  };

  console.log("save", saveStatus);
  const handleBookmarkToggle = () => {
    const action = saveStatus?.isBookmarked ? "save" : "unsave";
    toggleSave(
      { storyId, action },
      {
        onSuccess: () => {
          refetchSaveStatus();
          setLocalBookmarks((prev) =>
            action === "unsave" ? prev + 1 : Math.max(0, prev - 1)
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
            voteStatus?.voteType === "DOWN" ? "text-orange-600" : ""
          }`}
          onClick={() =>
            handleVote(voteStatus?.voteType === "DOWN" ? "NONE" : "DOWN")
          }
          disabled={isVotePending}
        >
          <CircleArrowDown size={16} />
        </Button>

        <div className="text-xs font-bold">{localVotes}</div>

        <Button
          variant="ghost"
          size="sm"
          className={`h-6 ${
            voteStatus?.voteType === "UP" ? "text-orange-600" : ""
          }`}
          onClick={() =>
            handleVote(voteStatus?.voteType === "UP" ? "NONE" : "UP")
          }
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
