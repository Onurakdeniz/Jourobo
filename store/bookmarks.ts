import { create } from "zustand";
import { GetStorySchema } from  "../schemas/story";
import { z } from "zod";


type Story = z.infer<typeof GetStorySchema>;
 
interface AgencyState {
  bookmarks:  Story[];
  selectedBookmark?:  Story;
}

interface AgencyActions {
  setBookmarks: (stories: Story[]) => void;
  setSelectedBookmark:  (story: Story) => void;
}

export const useBookmarksStore = create<AgencyState & AgencyActions>((set) => ({
  bookmarks: [],
  selectedBookmark: undefined,  

  setBookmarks: (stories) => set(() => ({ bookmarks : stories})),
  setSelectedBookmark: (story) => set(() => ({ selectedBookmark: story })),
}));
