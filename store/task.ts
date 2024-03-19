import { create } from "zustand";
import {  } from "../schemas";
import { z } from "zod";

type AgencyStore = {
  task : any
  setTask: (task : any) => void;
};

export const useTaskStore = create<AgencyStore>((set) => ({
  task: {},
  setTask: (task) => set({ task }),
}));
