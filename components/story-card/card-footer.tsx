import React, { useState } from "react";
import { useVoteMutation    } from "@/hooks/useVoteMutation";  
import { useSaveMutation   } from "@/hooks/useSaveMutation";  
import { useVoteStatus     } from "@/hooks/useVoteStatus";
import { useSaveStatus     } from "@/hooks/useSaveStatus";
import {
  Eye,
  CircleArrowDown,
  CircleArrowUp,
  Bookmark,
  Loader2,
  BookmarkCheck,
} from "lucide-react";
import { Button } from "../ui/button";

const CardFooter = ({ storyId, views }) => {
  const { data: voteStatus, refetch: refetchVoteStatus } = useVoteStatus(storyId);
  const { mutate: toggleVote, isPending: isVotePending } = useVoteMutation();

  const { data: saveStatus, refetch: refetchSaveStatus } = useSaveStatus(storyId);
  const { mutate: toggleSave, isPending: isSavePending } = useSaveMutation();

  const [localBookmarks, setLocalBookmarks] = useState(0); // Example initial state

  const handleVote = (voteAction:any) => {
    toggleVote(
      { storyId, voteAction },
      {
        onSuccess: () => {
          refetchVoteStatus();
        },
      }
    );
  };

  const handleBookmarkToggle = () => {
    const action = saveStatus?.isSaved ? "unsave" : "save";
    toggleSave(
      { storyId, action },
      {
        onSuccess: () => {
          refetchSaveStatus();
          setLocalBookmarks((prev) => (action === "save" ? prev + 1 : Math.max(0, prev - 1)));
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
          className="h-6"
          onClick={() => handleVote(voteStatus?.voteStatus === 'DOWN' ? 'NONE' : 'DOWN')}
          disabled={isVotePending}
        >
          <CircleArrowDown size={16} />
        </Button>

        <div className="text-xs font-bold">
          {/* Display the current vote status or count here */}
          {voteStatus?.voteStatus}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-6"
          onClick={() => handleVote(voteStatus?.voteStatus === 'UP' ? 'NONE' : 'UP')}
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
          ) : saveStatus?.isSaved ? (
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