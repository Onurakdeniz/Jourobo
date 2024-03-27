import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useBookmarkedStore } from "@/store";

interface SaveStatusResponse {
  isBookmarked: boolean;
}

export const useSaveStatus = (
  storyId: string
): UseQueryResult<SaveStatusResponse, Error> => {
  const isBookMarkedState = useBookmarkedStore((state) => state.isBookMarked);
  const setIsBookMarked = useBookmarkedStore((state) => state.setIsBookMarked);

  return useQuery<SaveStatusResponse, Error>({
    queryKey: ["saveStatus", storyId],
    queryFn: async () => {
      const response = await fetch(`/api/save/${storyId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      let isBookmarked = false;

      if (data) {
        setIsBookMarked(data.isBookmarked);
         isBookmarked = isBookMarkedState
      }

      return { isBookmarked };
    },
    // Additional options can be specified here
  });
};
