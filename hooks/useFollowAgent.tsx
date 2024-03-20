import { useMutation } from "@tanstack/react-query";

// Define TypeScript interfaces for your request and response

type FollowUnfollowRequest = {
  agentId: string;
  action: "follow" | "unfollow";
};

interface FollowUnfollowResponse {
  message: string; // Assuming the response contains a message
  // Add other fields based on your actual response structure
}
export const useFollowUnfollowMutation = () => {
  return useMutation<FollowUnfollowResponse, Error, FollowUnfollowRequest>({
    mutationFn: async ({ agentId, action }: FollowUnfollowRequest) => {
      const response = await fetch(`/api/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId, action }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });
};
