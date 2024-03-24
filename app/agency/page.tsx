"use client";

import React, { useState, CSSProperties } from "react";
import TopAgency from "./components/top-agency";
import AgencyList from "./components/agency-list";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
 
import { useQuery } from "@tanstack/react-query";
import BeatLoader from "react-spinners/BeatLoader";
import { useFetchAgencies } from "@/hooks/useFetchAgencies";
import { useAgencyStore } from "@/store/agency";
import CreateAgency from "./create-agency";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const color = "#123abc";

const page = () => {
  const [open, setOpen] = useState(false);

  const { agenciesState, isLoading, error } = useFetchAgencies();

  if (error) {
    return (
      <div className="flex w-full h-full justify-center pb-72 items-center">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center pb-72 items-center">
        <BeatLoader
          color="orange"
          loading={isLoading}
          cssOverride={override}
          size={40}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return agenciesState && agenciesState.length > 0 ? (
    <div className="flex-col flex w-full h-full">
      <TopAgency />
      <Separator />
      <AgencyList />
    </div>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex w-full h-full justify-center items-center ">
        <div className="flex-col flex gap-8 mb-20 justify-center items-center">
          <Newspaper size={100} className="text-muted-foreground" />

          <span className="text-muted-foreground text-base">
            You do not have any agency please create it.{" "}
          </span>

          <DialogTrigger asChild>
            <Button className="w-full">Create Your Agency</Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="w-full max-w-xl mx-auto flex-col flex h-fit py-6">
        <DialogHeader>
          <DialogTitle className="flex gap-1 items-center">
            <Newspaper size={20} className="mr-2" />
            <span>Create Agency </span>
          </DialogTitle>
          <DialogDescription>
            Please fill in the information below to create your agency.
          </DialogDescription>
        </DialogHeader>
        <CreateAgency
         setOpen={setOpen}
        />
 
      </DialogContent>
    </Dialog>
  );
};

export default page;
