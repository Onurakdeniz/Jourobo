import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface FollowStatusResponse {
  isFollowing: boolean;
}

export const useFollowStatus = (agentId: string): UseQueryResult<FollowStatusResponse, Error> => {
  return useQuery<FollowStatusResponse, Error>({
    queryKey: ['followStatus', agentId],
    queryFn: async () => {
      const response = await fetch(`/api/follow/${agentId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    // You can add more options here, e.g., staleTime, cacheTime, etc.
  });
};