import React, { useEffect, useState } from "react";
import { useSaveStatus } from "@/hooks/useSaveStatus";
import { useSaveMutation } from "@/hooks/useSaveMutation";
import { Eye, CircleArrowDown, CircleArrowUp, Bookmark } from "lucide-react";
import { Button } from "../ui/button";

const CardFooter = ({
  storyId, // Assuming you pass the storyId as a prop to CardFooter
  vote,
  bookMarks,
  views,
}) => {
  const { data: saveStatus, refetch } = useSaveStatus(storyId);
  const { mutate: toggleSave } = useSaveMutation();

  // State to manage local bookmark count, to avoid immediate re-fetching after toggling
  const [localBookmarks, setLocalBookmarks] = useState(bookMarks);

  // Effect to update local state when bookmark status is fetched
  

  const handleBookmarkToggle = () => {
    const action = saveStatus?.isBookmarked ? "unsave" : "save";
    toggleSave(
      { storyId, action },
      {
        onSuccess: () => {
          // Refetch the bookmark status after toggling
          refetch();
          // Adjust the local bookmark count based on the action performed
          if (action === "save") {
            // If saving, set the bookmark count to 1
            setLocalBookmarks(1);
          } else {
            // If unsaving, set the bookmark count to 0
            setLocalBookmarks(0);
          }
        },
      }
    );
  };

  return (
    <div className="flex gap-2">
      {/* Other parts of the component remain unchanged */}
      <div className="flex gap-1 items-center border px-2 py-1 bg-primary/5 rounded-full">
        <Button variant="ghost" size="sm" className="h-6 px-1" onClick={handleBookmarkToggle}>
          <Bookmark size={16} />
        </Button>
        <div className="text-xs flex gap-1 items-center">
          {localBookmarks}
        </div>
      </div>
    </div>
  );
};

export default CardFooter;

/*
  <div className="flex gap-1 items-center border px-1 py-1 bg-primary/5 rounded-full">
    <Button variant="ghost" size="sm" className="h-6">
      <CircleArrowDown size={16} />
    </Button>

    <div className="text-xs font-bold">
      {vote}
    </div>
    <Button variant="ghost" size="sm" className="h-6">
      <CircleArrowUp size={16} />
    </Button>
  </div>
*/

// Implementation: This part of the code was responsible for rendering the voting buttons and the vote count.
// The vote count is displayed between the downvote and upvote buttons.
// Each button is rendered using the Button component with the 'ghost' variant and 'sm' size.
// The downvote button has a CircleArrowDown icon and the upvote button has a CircleArrowUp icon.
// The vote count is rendered inside a div with the 'text-xs font-bold' classes.