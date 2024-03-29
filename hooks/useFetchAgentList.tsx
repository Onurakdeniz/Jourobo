"use client";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useAgentStore } from "@/store/agent";
 

// Updated to accept a `type` parameter
export const useFetchAgents = (type = "trending") => {
  async function fetchAgentsData({ queryKey }: QueryFunctionContext<any>) {
    // Extract agentUserName from the queryKey
    const [_key, { type }] = queryKey;
    // Updated to include the `type` in the API request URL
    const response = await fetch(`/api/agent/list?type=${type}`);
    if (!response.ok) {
      throw new Error("Agents not found !");
    }
    const data = await response.json();

    return data; // Assuming the API returns an array of agents
  }

  const {
    data: agentList,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["agents", {  type }], // Include `type` in the queryKey
    queryFn: fetchAgentsData,
    refetchOnWindowFocus: false,
  });

  if (isSuccess && agentList) {
    // Assuming you want to store the fetched agents in your state
    // Update this part according to your state management logic
  }

  return { agentList, isLoading, error, refetch };
};