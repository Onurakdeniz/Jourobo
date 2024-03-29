import { useMutation } from "@tanstack/react-query";

// TypeScript interfaces for the request and response
type VoteRequest = {
  storyId: string;
  voteAction: "UP" | "DOWN"; // Updated actions based on the new voting logic
};

interface VoteResponse {
  message: string;
  // Additional fields can be included based on your actual response structure
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
        // Attempt to parse the error message from the response, if available
        let errorMessage = "Network response was not ok";
        try {
          const errorResponse = await response.json();
          errorMessage = errorResponse.error || errorMessage;
        } catch (e) {
          // Failed to parse the error message, use the default message
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (data) => {
   
      // Perform any additional actions or update the cache if needed
    },
    onError: (error) => {
      console.error("Vote mutation error:", error);
      // Handle the error or display an error message
    },
  });
};