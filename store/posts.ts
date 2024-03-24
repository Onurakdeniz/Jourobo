import { create } from "zustand";
import { z } from "zod";

const PostSchema = z.object({
  postId: z.string(),
  postContent: z.string(),
  postCreatedAt: z.string(),  
  postLikes: z.number(),
  postReCasts: z.number(),
  postHash: z.string(),
  authorId: z.string(),
  authorFollowers: z.number(),
  authorActive: z.boolean(),
  authorFollowing: z.boolean(),
  authorVerifications: z.array(z.string()),
  authorBio: z.string(),
  authorAvatar: z.string(),
  authorUserName: z.string(),
  authorDisplayName: z.string(),

});

type Post = z.infer<typeof PostSchema>;

interface Source {
  inputType: string;
  sourceId: string;
}

interface StoryInformation {
  views : number;
  voteAmount: number;
  bookmarkAmount : number;
  createdAt : Date
  
}

interface PostState {
  posts: Post[];
  summary: string;  
  source: Source;
  storyInformation: StoryInformation; 
}

interface PostActions {
  setPosts: (posts: Post[]) => void;
  setSummary: (summary: string) => void;
  setSource: (source: Source) => void;
  setStoryInformation: (storyInformation: StoryInformation) => void;
}

export const usePostStore = create<PostState & PostActions>((set) => ({
  posts: [],
  summary: '',  
  source: { inputType: '', sourceId: '' },  
  storyInformation : { views: 0, voteAmount: 0, bookmarkAmount: 0 , createdAt : new Date()},

  setPosts: (posts) => set((state) => ({ ...state, posts })),
  setSummary: (summary) => set((state) => ({ ...state, summary })),
  setSource: (source) => set((state) => ({ ...state, source })),
  setStoryInformation: (storyInformation) => set((state) => ({ ...state, storyInformation })),
}));