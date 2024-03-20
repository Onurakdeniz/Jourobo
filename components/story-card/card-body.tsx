import React from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Sue_Ellen_Francisco } from "next/font/google";

const VT323a = Sue_Ellen_Francisco({
  weight: "400",
  subsets: ["latin"],
});

const CardBody = ({
  title,
  content,
  tags,
}: {
  title: string;
  content: string;
  tags: string[];
}) => {
 
  return (
    <div className="flex w-full flex-wrap">
      <div className="flex-col flex gap-4 w-full  flex-1">
        <div className="flex w-full justify-between mt-2 text-pretty line-clamp-2 capitalize  text-lg  ">
          <Link href="/story/1">
          <div className="truncate font-semibold max-w-[600px]">{title}</div>
          </Link>
          <div className="flex items-center gap-2">
            <Badge
            className="px-4 py-1"
            variant= "secondary"
            >GPT4</Badge>
            <Badge
            className="px-4 py-1"
            variant= "secondary"
            >OpenAI</Badge>
          </div>
        </div>
        <div className="flex gap-2 w-full items-center">
          {tags &&
            tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="flex gap-2 items-center px-2 rounded-sm text-xs border-orange-600 text-orange-600"
              >
                {tag}
              </Badge>
            ))}
        </div>
        <div className="flex-col flex gap-3 text-sm   font-light py-2">
          <div className=" flex  w-full  items-start  text-base dark:text-neutral-400 text-neutral-600 font-sans leading-loose text-pretty ">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBody;
