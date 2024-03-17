"use client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useAgentStore } from "@/store/agent";
import { useParams } from "next/navigation";

export const useFetchAgent = () => {
  const { userName: agentUserName } = useParams(); // Destructuring to get userName directly

  const agentState = useAgentStore((state) => state.agent);
  const setAgent = useAgentStore((state) => state.setAgent);

  async function fetchAgentData({ queryKey }: QueryFunctionContext<any>) {
    // Extract agentUserName from the queryKey
    const [_key, { agentUserName }] = queryKey;
    const response = await fetch(`/api/agent/${agentUserName}`);
    if (!response.ok) {
      throw new Error("Agent not found !");
    }
    const data = await response.json();
    console.log("moraa", data);
    return data.agent;
  }

  const {
    data: agent,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["agent", { agentUserName }], // Include agentUserName in the queryKey
    queryFn: fetchAgentData,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Prevent the data from being considered stale
  });

  if (isSuccess) {
    setAgent(agent);
  }

  console.log("agentState", agentState);

  return { agentState, isLoading, error, refetch };
};
