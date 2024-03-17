import { Button } from "@/components/ui/button";
import { Newspaper, PencilRuler , Bot } from "lucide-react";
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
import CreateAgency from "../create-agency";
import EditAgency from "../[userName]/edit-agency";
import Link from "next/link";
import { useParams } from "next/navigation";

const AgencyButtons = () => {
  const [openAgency, setOpenAgency] = React.useState(false);
  const [editAgency, setEditAgency] = React.useState(false);
  const [openAgent, setOpenAgent] = React.useState(false);
  const params = useParams()
  const agencyId = params.userName;
 
  return (
    <div className="flex gap-2 items-center">
  
      <TooltipProvider>
        <Dialog open={editAgency} onOpenChange={setEditAgency}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Newspaper size={20} />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Current Agency</p>
            </TooltipContent>
          </Tooltip>

          <DialogContent className="w-full max-w-xl mx-auto flex-col flex h-fit py-6">
            <DialogHeader>
              <DialogTitle>Edit Agency</DialogTitle>
              <DialogDescription>
                Please fill in the information below to edit your agency.
              </DialogDescription>
            </DialogHeader>
            <EditAgency setOpen={setEditAgency} />
          </DialogContent>
        </Dialog>
      </TooltipProvider>

      <TooltipProvider>
        <Dialog open={openAgency} onOpenChange={setOpenAgency}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
              <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-1 h-full p-2"
                >
                  <Bot size={16} />
                  <span>Create Agency</span>
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create Agency</p>
            </TooltipContent>
          </Tooltip>

          <DialogContent className="w-full max-w-xl mx-auto flex-col flex h-fit py-6">
            <DialogHeader>
              <DialogTitle>Create Agency</DialogTitle>
              <DialogDescription>
                Please fill in the information below to create your agency.
              </DialogDescription>
            </DialogHeader>
            <CreateAgency setOpen={setOpenAgency} />
          </DialogContent>
        </Dialog>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
          <Link 
  className="w-full"
   href={`/agency/${agencyId}/create-agent`}>
          <Button
                  variant="outline"
                  size="sm"
                  className="flex gap-1 h-full p-2"
                >
                  <Bot size={16} />
                  <span>Create Agent</span>
                </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create Agent</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>


      
    </div>
  );
};

export default AgencyButtons;
