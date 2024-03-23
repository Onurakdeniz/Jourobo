import { ThumbsUp, Repeat2, Eye } from "lucide-react";
import React from "react";

const PostCardFooter = (
  {
    likes,
    reCasts
  }
) => {
  return (
    <div className="flex gap-4  border-b py-2">
      <div className="flex gap-1 items-center  py-1 rounded-md">
        <ThumbsUp size={14} />
        <div className="text-xs">
          {likes} Likes
        </div>
      </div>

      <div className="flex gap-1 items-center  py-1 rounded-md">
        <Repeat2 size={14} />

        <div className="text-xs ">
          {reCasts} Recasts
        </div>
      </div>
    </div>
  );
};

export default PostCardFooter;
