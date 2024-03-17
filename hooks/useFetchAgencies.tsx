"use client";
import { useQuery } from "@tanstack/react-query";
import { useAgencyStore } from "@/store/agency";

async function fetchAgencyData() {
  const response = await fetch("/api/agency");
  if (!response.ok) {
    throw new Error("Failed to fetch agencies. Please try again later.");
  }
  const data = await response.json();
  console.log("datafata", data);
  return data.agencies; // directly return the array
}

export const useFetchAgencies = () => {
  const setAgencies = useAgencyStore((state) => state.setAgencies);
  const agenciesState = useAgencyStore((state) => state.agencies);

  const {
    data: agencies,
    isLoading,
    error,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["agency"],
    queryFn: fetchAgencyData,
    refetchOnWindowFocus: false, // Disable automatic refetching on window focus
    staleTime: Infinity, // Prevent the data from being considered stale
  });

  if (isSuccess) {
    setAgencies(agencies);
  }

  console.log("agenciesState", agenciesState);

  return { agenciesState, isLoading, error, refetch };
};