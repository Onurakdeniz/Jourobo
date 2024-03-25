import React from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Sue_Ellen_Francisco } from "next/font/google";
import { LLMContentSchema } from "@/schemas/story";
import { z } from "zod";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type content = z.infer<typeof LLMContentSchema>;

const CardBody = ({
  content,
  aiModel,
  storyId,
}: {
  content: content;
  aiModel: string;
  storyId: string;
}) => {
  return (
    <div className="flex w-full flex-wrap">
      <div className="flex-col flex gap-4 w-full  flex-1">
        <div className="flex w-full justify-between mt-2 text-pretty   capitalize  text-lg  ">
          <Link href={`/feed?id=${storyId}`}>
            <div
              className="font-semibold overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {content?.title}
            </div>
          </Link>
        </div>
        <div className="flex justify-between w-full items-center ">
          <div className="flex gap-2 w-full items-center ">
            {content &&
              content.tags &&
              content.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex gap-2 items-center   font-light rounded-sm text-xs    dark:bg-orange-950  bg-orange-100 border-none border-orange-700 text-orange-600  px-3 dark:text-orange-600"
                >
                  {tag.tag.name}
                </Badge>
              ))}
          </div>
          <div className="flex items-center gap-2 w-3/12 justify-end ">
            <Badge className="px-2  text-[10px]}" variant="outline">
              {aiModel}
            </Badge>
            <Badge className="px-2  text-[10px]}" variant="outline">
              OpenAI
            </Badge>
          </div>
        </div>
        <div className="flex-col flex gap-3 text-sm   font-light py-2 pr-2">
          <div className="flex-col flex w-full  text-base dark:text-neutral-400 text-neutral-600   text-balance overflow-hidden ">
            {content?.content?.split("\n\n").map((paragraph, index) => (
              <div key={index} className="mb-4 flex-wrap w-full flex leading-relax text-wrap text-justify overflow-hidden text-overflow-ellipsis whitespace-nowrap">
                {paragraph}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBody;

const UserHoverCard = ({ annotations }: { annotations: any }) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="flex items-center gap-2">
          <Image
            src={user.profile.avatarUrl}
            alt="avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-sm font-semibold">{user.profile.name}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex-col gap-2">
          <div className="text-sm font-semibold">{user.profile.name}</div>
          <div className="text-xs text-neutral-500">
            {user.profile.description}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
