import { useMutation } from "@tanstack/react-query";

// TypeScript interfaces for the request and response
type SaveUnsaveRequest = {
  storyId: string;
};

interface SaveUnsaveResponse {
  message: string;  
 
}

export const useSaveMutation = () => {
  return useMutation<SaveUnsaveResponse, Error, SaveUnsaveRequest>({
    mutationFn: async ({ storyId }: SaveUnsaveRequest) => {
      const response = await fetch(`/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storyId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });
};
