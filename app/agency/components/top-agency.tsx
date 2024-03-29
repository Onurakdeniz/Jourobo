"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAgencyStore } from "@/store/agency";
import AgencyStats from "./top-stats";
import AgencyInfo from "./entity-info";
import AgencyButtons from "./agency-buttons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { Newspaper, Users, Eye, Coins } from "lucide-react";
import TopStats from "./top-stats";
import EntityInfo from "./entity-info";
const TopAgency = () => {
  const router = useRouter();
  const params = useParams();

  const agencies = useAgencyStore((state) => state.agencies);
  const selectedAgency = useAgencyStore((state) => state.selectedAgency);
  const setSelectedAgency = useAgencyStore((state) => state.setSelectedAgency);

  const agencyUserName = params.userName;
  console.log("selectedAgency", selectedAgency);

  useEffect(() => {
    if (agencyUserName) {
      const agency = agencies.find((a) => a.userName === agencyUserName);
      if (agency) {
        setSelectedAgency(agency);
        router.push(`/agency/${agency.userName}`);
      } else if (agencies.length > 0) {
        setSelectedAgency(agencies[0]);
        router.push(`/agency/${agencies[0].userName}`);
      }
    } else if (!selectedAgency && agencies.length > 0) {
      setSelectedAgency(agencies[0]);
      router.push(`/agency/${agencies[0].userName}`);
    }
  }, [agencyUserName, agencies, router, setSelectedAgency]);

  // Handler for select change to update the selectedAgency and modify the URL

  const handleSelectChange = (selectedUserName: string) => {
    const newSelectedAgency = agencies.find(
      (agency) => agency.userName === selectedUserName
    );
    if (newSelectedAgency) {
      setSelectedAgency(newSelectedAgency);
      router.push(`/agency/${newSelectedAgency.userName}`);
    }
  };


  return (
    <div className="flex justify-between items-center h-28 px-2 pb-4 pr-4 rounded-none">
      <div className="flex w-3/12 h-full">
        <EntityInfo
          entityName={selectedAgency?.name || ""}
          entityCreatedDate={
            selectedAgency?.createdAt
              ? new Date(selectedAgency.createdAt).toISOString()
              : ""
          }
          entityLogo={selectedAgency?.logo || ""}
          ownerName={selectedAgency?.owners[0]?.user?.profile?.userName || ""}
          ownerAvatar={
            selectedAgency?.owners[0]?.user?.profile?.avatarUrl || ""
          }
        />
      </div>
      <div className="flex w-6/12 ml-12 h-full gap-4 justify-end items-center">
       <Select
  value={selectedAgency?.userName}
  onValueChange={handleSelectChange}
>
  <SelectTrigger className="min-w-[180px] max-w-[180px]">
    <SelectValue placeholder="Select an agency" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {agencies.map((agency) => (
        <SelectItem key={agency.id} value={agency.userName}>
          {agency.name}
        </SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
</Select>

        <TopStats
          stats={[
            {
              Icon: Users,
              title: "Agents",
              value: selectedAgency?.agentCount || 0,
            },
            {
              Icon: Newspaper,
              title: "Stories",
              value: selectedAgency?.totalStoryCount || 0,
            },
            { Icon: Coins, title: "Points", value: "soon" },
          ]}
        />
      </div>
      <div className="flex w-3/12 justify-end gap-3">
        <AgencyButtons />
      </div>
    </div>
  );
};

export default TopAgency;
