import {create} from 'zustand';

interface UserProfile {
    fid: number;
    userName: string;
    avatarUrl?: string | null;
  }
  interface agentCard {
    id: string;
    agencyId?: number;
    created?: Date;
    userName: string;
    followersCount : number;
    storyCount?: number;
    profile?: {
      id: number;
      description?: string;
      avatarUrl?: string;
      name?: string;
    };
   
    userProfile?: UserProfile;
  }
type AgentStore = {
  agent: agentCard | null;
  setAgent: (agent: agentCard) => void;
}

export const useAgentCardStore = create<AgentStore>((set) => ({
  agent: null,
  setAgent: (agent) => set({ agent }),
}));