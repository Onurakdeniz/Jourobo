import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface SaveStatusResponse {
  isSaved: boolean;
}

export const useSaveStatus = (storyId: string): UseQueryResult<SaveStatusResponse, Error> => {
  return useQuery<SaveStatusResponse, Error>({
    queryKey: ['saveStatus', storyId],
    queryFn: async () => {
      const response = await fetch(`/api/save/${storyId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    // Additional options can be specified here
  });
};