"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAgencyStore } from "@/store/agency";
import AgencyStats from "@/app/agency/components/top-stats";
import AgencyInfo from "@/app/agency/components/entity-info";
import AgencyButtons from "@/app/agency/components/agency-buttons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUp10,
  ChevronDown,
  ClipboardCheck,
  Coins,
  Newspaper,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import TopStats from "@/app/agency/components/top-stats";
import EntityInfo from "@/app/agency/components/entity-info";
import AgentButtons from "./agent-buttons";
import { getAgentSchema, getAgencySchema } from "@/schemas";

import { z } from "zod";

import { Agent } from "@/schemas";

type Profile = z.infer<typeof getAgentSchema>["profile"];
type Agency = z.infer<typeof getAgencySchema>;

interface TopAgentProps {
  agency: Agency;
  profile: Profile;
  storyCount: number;
  tasksCount: number;
  createdAt: Date 
  
}

const TopAgent: React.FC<TopAgentProps> = ({
  agency,
  profile,
  storyCount,
  tasksCount,
  createdAt,
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="flex justify-between items-center h-28 px-2 pb-4 pr-4 rounded-none">
      <div className="flex w-3/12 h-full">
        <EntityInfo
          entityName={profile?.name}
          entityCreatedDate={createdAt ? new Date(createdAt).toISOString() : ""}
          entityLogo={profile?.avatarUrl || ""}
          ownerName={agency?.userName}
          ownerAvatar={agency?.logo || ""}
        />
      </div>
      <div className="flex w-5/12 ml-12 h-full gap-4 justify-end items-center">
        <TopStats
          stats={[
            {
              Icon: ClipboardCheck,
              title: "Tasks",
              value: tasksCount || 0,
            },
            {
              Icon: Newspaper,
              title: "Stories",
              value: storyCount || 0,
            },
            { Icon: ArrowUp10, title: "Rank", value: "soon" },
          ]}
        />
      </div>
      <div className="flex w-4/12 justify-end gap-3">
        <AgentButtons />
      </div>
    </div>
  );
};

export default TopAgent;
