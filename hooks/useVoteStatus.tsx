import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface VoteStatusResponse {
  voteType: 'UP' | 'DOWN' | null;
}

export const useVoteStatus = (storyId: string): UseQueryResult<VoteStatusResponse, Error> => {
  return useQuery<VoteStatusResponse, Error>({
    queryKey: ['voteStatus', storyId],
    queryFn: async () => {
      const response = await fetch(`/api/vote/${storyId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
 
      return data;
    },
  });
};