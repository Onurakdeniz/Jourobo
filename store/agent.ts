import { create } from "zustand";
import { getAgentByAgentUserNameSchema } from "../schemas";
import { z } from "zod";

type Agent = z.infer<typeof getAgentByAgentUserNameSchema>;

interface AgentState {
  agent: Agent 
}

interface AgentActions {
  setAgent: (agent: Agent) => void;
}

export const useAgentStore = create<AgentState & AgentActions>((set) => ({
  agent: {} as Agent,
  setAgent: (agent) => set(() => ({ agent })),
}));
