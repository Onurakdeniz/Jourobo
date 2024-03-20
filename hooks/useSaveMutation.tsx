import { useMutation } from "@tanstack/react-query";

// TypeScript interfaces for the request and response
type SaveUnsaveRequest = {
  storyId: string;
  action: "save" | "unsave";
};

interface SaveUnsaveResponse {
  message: string; // Assuming the response contains a message
  // Additional fields can be included based on your actual response structure
}

export const useSaveMutation = () => {
  return useMutation<SaveUnsaveResponse, Error, SaveUnsaveRequest>({
    mutationFn: async ({ storyId, action }: SaveUnsaveRequest) => {
      const response = await fetch(`/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storyId, action }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });
};