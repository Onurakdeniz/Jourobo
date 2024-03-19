import React from "react";
import TaskCard from "./task-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgencyStore } from "@/store/agency";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAgentByAgentUserNameSchema } from "@/schemas";
import { z } from "zod";
import { useFetchAgent } from "@/hooks/useFetchAgent";

const TaskList = () => {
  const agentUserName = useParams().userName;

  const { agentState, isLoading, error, refetch } = useFetchAgent();

  const tasks = agentState?.tasks || [];

  // Conditional rendering logic moved outside the return statement
  if (tasks && tasks.length > 0) {
    return (
      <ScrollArea
        className="flex overflow-auto pr-4"
        style={{ height: "calc(100vh - 160px)" }}
      >
        <div className="flex-col flex py-6 gap-4 w-full">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    );
  } else {
    return (
      <div
        className="flex w-full   justify-center items-center"
        style={{ height: "calc(100vh - 160px)" }}
      >
        <div className="flex-col flex gap-8 mb-20 justify-center items-center">
          <Bot size={100} className="text-muted-foreground" />
          <span className="text-muted-foreground text-base">
            You do not have any agents, please create one.
          </span>

          <Link className="w-full" href={`/agent/${agentUserName}/create-task`}>
            <Button className="w-full">Create Your First Task</Button>{" "}
          </Link>
        </div>
      </div>
    );
  }
};

export default TaskList;
