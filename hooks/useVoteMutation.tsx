import { useMutation } from "@tanstack/react-query";

// TypeScript interfaces for the request and response
type VoteRequest = {
  storyId: string;
  voteAction: "UP" | "DOWN";
};


export const useVoteMutation = () => {
  return useMutation<VoteResponse, Error, VoteRequest>({
    mutationFn: async ({ storyId, voteAction }: VoteRequest) => {
      console.log("voteActioaaan", voteAction);
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
    onSuccess: (data) => {
      console.log("Vote mutation successful:", data);
      // Perform any additional actions or update the cache if needed
      // For example, you might want to invalidate or refetch the vote status query here
    },
    onError: (error) => {
      console.error("Vote mutation error:", error);
      // Handle the error or display an error message
      // This could involve setting an error state or showing a toast notification
    },
  });
};
