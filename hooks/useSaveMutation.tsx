import { useMutation } from "@tanstack/react-query";

// TypeScript interface for the request
type SaveUnsaveRequest = {
  storyId: string;
};

// TypeScript interface for the response
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