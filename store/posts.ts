import { create } from "zustand";
import { z } from "zod";

const PostSchema = z.object({
  postId: z.string(),
  postContent: z.string(),
  postCreatedAt: z.string(), // or z.date() if the timestamp is a Date object
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

interface PostState {
  posts: Post[];
}

interface PostActions {
  setPosts: (posts: Post[]) => void;
}

export const usePostStore = create<PostState & PostActions>((set) => ({
  posts: [],

  setPosts: (posts) => set(() => ({ posts })),
}));