import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface VoteStatusResponse {
  voteType: 'UP' | 'DOWN' | "NONE";
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
  
      console.log ('datafota', data);
      if (data.error) {
        throw new Error(data.error);
      }
      
      return { voteType: data.voteType || "NONE" };
  
    },
  });
};