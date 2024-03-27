import { create } from "zustand";
import { z } from "zod";

type BookmarkedStore = {
  isBookMarked: boolean;
 setIsBookMarked: (isBookMarked: boolean) => void;
};

export const useBookmarkedStore = create<BookmarkedStore>((set) => ({
    isBookMarked: false,
    setIsBookMarked: (isBookMarked) => set({ isBookMarked }),
}));
