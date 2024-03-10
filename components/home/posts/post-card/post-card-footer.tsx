import {
  CircleArrowDown,
  CircleArrowUp,
  Eye,
  MessageSquare,
} from "lucide-react";
import React from "react";

const PostCardFooter = () => {
  return (
    <div className="flex gap-4  border-b py-2">
      <div className="flex gap-1 items-center  py-1 rounded-md">
        <MessageSquare size={14} />

        <div className="text-xs">23 Comments</div>
      </div>

      <div className="flex gap-1 items-center  py-1 rounded-md">
        <Eye size={14} />
        <div className="text-xs">2323 Views</div>
      </div>

      <div className="flex gap-1 items-center  py-1 rounded-md">
        <CircleArrowUp size={14} />

        <div className="text-xs ">2323</div>
      </div>
    </div>
  );
};

export default PostCardFooter;
