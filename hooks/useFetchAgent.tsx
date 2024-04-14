"use client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useAgentStore } from "@/store/agent";
import { useAgentCardStore } from "@/store/agent-card";


export const useFetchAgent = (withDetails = true , userName:string) => { // Added withDetails parameter
 
  const agentState = useAgentStore((state) => state.agent);
  const setAgent = useAgentStore((state) => state.setAgent);

  const agentCardState = useAgentCardStore((state) => state.agent);
  const setAgentCard = useAgentCardStore((state) => state.setAgent);

  async function fetchAgentData({ queryKey }: QueryFunctionContext<any>) {
    const [_key, { userName }] = queryKey;
    // Adjust the fetch URL based on withDetails
    const url = `/api/agent/${userName}${withDetails ? '?details=true' : ''}`;
    console.log(url,"url");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Agent not found !");
    }
 
    const data = await response.json();
 
    return data;
  }

  const {
    data: agent,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["agent", { userName, withDetails }], // Include withDetails in the queryKey to differentiate queries
    queryFn: fetchAgentData,
    refetchOnWindowFocus: false,
  });


  if (isSuccess) {
    if (withDetails) {
      setAgent(agent);
    } else {
      setAgentCard(agent);
    }
  }

  return withDetails 
  ? { agentState: agentState, isLoading, error, refetch }
  : { agentState: agentCardState, isLoading, error, refetch };
};