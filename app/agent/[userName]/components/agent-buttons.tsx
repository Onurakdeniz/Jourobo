import { Button } from "@/components/ui/button";
import { ClipboardCheck, FileText, Bot, ClipboardType } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Link from "next/link";
import { useParams } from "next/navigation";
import CreatePrompt from "./create-prompt";

const AgentButtons = () => {
  const [openAgency, setOpenAgency] = React.useState(false);
  const [openAgent, setOpenAgent] = React.useState(false);
  const [editAgent, setEditAgent] = React.useState(false);
  const [openPrompt, setOpenPrompt] = React.useState(false);

  const params = useParams();
  const agentId = params.userName;

  return (
    <div className="flex gap-2 items-center">
      <TooltipProvider>
        <Dialog open={editAgent} onOpenChange={setEditAgent}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Bot size={20} />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Current Agent</p>
            </TooltipContent>
          </Tooltip>

          <DialogContent className="w-full max-w-xl mx-auto flex-col flex h-fit py-6">
            <DialogHeader>
              <DialogTitle>Edit Agent</DialogTitle>
              <DialogDescription>
                Please fill in the information below to edit your agency.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TooltipProvider>

      <TooltipProvider>
        <Dialog open={openPrompt} onOpenChange={setOpenPrompt}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-1 h-full p-2"
                >
                  <ClipboardType size={16} />
                  <span>Create Prompt</span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Current Agent</p>
            </TooltipContent>
          </Tooltip>

          <DialogContent className="w-full max-w-xl mx-auto flex-col flex h-fit py-6">
            <DialogHeader>
              <DialogTitle>Create Prompt</DialogTitle>
              <DialogDescription>
                Please fill in the information below to create a new prompt.
              </DialogDescription>
            </DialogHeader>
            <CreatePrompt setOpen={setOpenPrompt} />
          </DialogContent>
        </Dialog>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link className="w-full" href={`/agent/${agentId}/create-task`}>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 h-full p-2"
              >
                <ClipboardCheck size={16} />
                <span>Create Task</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create Task</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AgentButtons;
