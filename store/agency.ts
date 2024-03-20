import { create } from 'zustand';
import { getAgencySchema } from "../schemas";
import { z } from "zod";
 
type Agency = z.infer<typeof getAgencySchema>;

 
interface AgencyState {
  agencies: Agency[];
  selectedAgency?: Agency;  
}

interface AgencyActions {
  setAgencies: (agencies: Agency[]) => void;
  setSelectedAgency: (agency?: Agency) => void;  
}

 
export const useAgencyStore = create<AgencyState & AgencyActions>((set) => ({
  agencies: [],
  selectedAgency: undefined,  
  
  setAgencies: (agencies) => set(() => ({ agencies })),
  setSelectedAgency: (agency) => set(() => ({ selectedAgency: agency })),
}));
