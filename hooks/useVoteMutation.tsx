import { useMutation } from "@tanstack/react-query";

// TypeScript interfaces for the request and response
type VoteRequest = {
  storyId: string;
  voteAction: "UP" | "DOWN" | "NONE"; // Actions based on your voting logic
};

interface VoteResponse {
  message: string; // Assuming the response contains a message
  vote: {
    voteStatus: "UP" | "DOWN" | "NONE";
    // Additional fields can be included based on your actual response structure
  };
}

export const useVoteMutation = () => {
  return useMutation<VoteResponse, Error, VoteRequest>({
    mutationFn: async ({ storyId, voteAction }: VoteRequest) => {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storyId, voteAction }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });
};