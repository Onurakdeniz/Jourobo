import { create } from 'zustand';
import { getAgencySchema } from "../schemas";
import { z } from "zod";

// Infer the type for an Agency from the Zod schema
type Agency = z.infer<typeof getAgencySchema>;

// Define the state structure and the actions
interface AgencyState {
  agencies: Agency[];
  selectedAgency?: Agency; // Make selectedAgency optional
}

interface AgencyActions {
  setAgencies: (agencies: Agency[]) => void;
  setSelectedAgency: (agency?: Agency) => void; // Allow agency to be optional
}

// Combine state and actions in the store
export const useAgencyStore = create<AgencyState & AgencyActions>((set) => ({
  agencies: [],
  selectedAgency: undefined, // Explicitly set to undefined or omit
  
  setAgencies: (agencies) => set(() => ({ agencies })),
  setSelectedAgency: (agency) => set(() => ({ selectedAgency: agency })),
}));
