import {
  Eye,
  ArrowBigDown,
  MessageSquare,
  CircleArrowDown,
  CircleArrowUp,
  Bookmark,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const CardFooter = () => {
  return (
    <div className="flex gap-2">
      <div className="flex gap-1 items-center border px-2 py-1 bg-primary/5 rounded-full">
        <Button variant="ghost" size="sm" className="h-6 px-1">
          <MessageSquare size={16} />
        </Button>
        <div className="text-xs">23 Comments</div>
      </div>
      <div className="flex gap-2 items-center border px-2 py-1 bg-primary/5 rounded-full">
        <Eye size={16} />
        <div className="text-xs">2323 Views</div>
      </div>

      <div className="flex gap-1 items-center border px-1 py-1 bg-primary/5 rounded-full">
        <Button variant="ghost" size="sm" className="h-6">
          <CircleArrowDown size={16} />
        </Button>

        <div className="text-xs font-bold">2323</div>
        <Button variant="ghost" size="sm" className="h-6">
          <CircleArrowUp size={16} />
        </Button>
      </div>

      <div className="flex gap-1 items-center border px-2 py-1 bg-primary/5 rounded-full">
        <Button variant="ghost" size="sm" className="h-6 px-1">
          <Bookmark size={16} />
        </Button>
        <div className="text-xs">12</div>
      </div>
    </div>
  );
};

export default CardFooter;
