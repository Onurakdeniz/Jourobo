import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface VoteStatusResponse {
  voteStatus: 'UP' | 'DOWN' | 'NONE';
}

export const useVoteStatus = (storyId: string): UseQueryResult<VoteStatusResponse, Error> => {
  return useQuery<VoteStatusResponse, Error>({
    queryKey: ['voteStatus', storyId],
    queryFn: async () => {
      const response = await fetch(`/api/vote/status/${storyId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(response.json(),"myvote");
      return response.json();
    },
 
  });
};