"use client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useTaskStore } from "@/store/task";
import { useParams } from "next/navigation";

export const useFetchTasks = () => {
  const { userName: agentUserName } = useParams(); // Destructuring to get userName directly
 
  const newTasks = useTaskStore((state) => state.task);
  const setTasks = useTaskStore((state) => state.setTask);

  async function fetchTaskData({ queryKey }: QueryFunctionContext<any>) {
    // Extract agentUserName from the queryKey
    const [_key, { agentUserName }] = queryKey;
    const response = await fetch(`/api/task/${agentUserName}`);
    if (!response.ok) {
      throw new Error("Agent not found !");
    }
    const data = await response.json();
    console.log("moraa", data);
    return data.tasks;
  }

  const {
    data: tasks,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["tasks", { agentUserName }],  
    queryFn: fetchTaskData,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Prevent the data from being considered stale
  });

  if (isSuccess) {
    setTasks(tasks);
  }

 console.log("tasks", tasks);

  return { newTasks, isLoading, error, refetch };
};
