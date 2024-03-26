import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface SaveStatusResponse {
  isBookmarked: boolean;
}

export const useSaveStatus = (storyId: string): UseQueryResult<SaveStatusResponse, Error> => {
  return useQuery<SaveStatusResponse, Error>({
    queryKey: ['saveStatus', storyId],
    queryFn: async () => {
      const response = await fetch(`/api/save/${storyId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return 'isBookmarked' in data ? data : { isBookmarked: false };
    },
    // Additional options can be specified here
  });
};