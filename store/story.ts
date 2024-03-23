import { create } from "zustand";
import { GetStorySchema } from  "../schemas/story";
import { z } from "zod";


type Story = z.infer<typeof GetStorySchema>;
 
interface AgencyState {
  stories:  Story[];
  selectedStory?:  Story;
}

interface AgencyActions {
  setStories: (stories: Story[]) => void;
  setSelectedStory:  (story: Story) => void;
}

export const useStoryStore = create<AgencyState & AgencyActions>((set) => ({
  stories: [],
  selectedStory: undefined,  

  setStories: (stories) => set(() => ({ stories })),
  setSelectedStory: (story) => set(() => ({ selectedStory: story })),
}));
