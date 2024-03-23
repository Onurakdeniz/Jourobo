import { z } from 'zod';

const AuthorProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string(),
  description: z.string(),
  focus: z.null(),
  agentId: z.string(),
  defaultInstructions: z.string(),
});

const AuthorSchema = z.object({
  id: z.string(),
  agencyId: z.string(),
  created: z.string(),
  updated: z.string(),
  userName: z.string(),
  defaultAiModelId: z.null(),
  profile: AuthorProfileSchema,
});

const AnnotationSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  llmcontentId: z.string(),
  userName: z.null(),
  annotationText: z.null(),
});

const TagSchema = z.object({
  tagId: z.string(),
  llmContentId: z.string(),
  tag: z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

const CategorySchema = z.object({
  categoryId: z.string(),
  llmContentId: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

const LLMContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  manipulation: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  LLMResponseId: z.string(),
  categories: z.array(CategorySchema),
  tags: z.array(TagSchema),
  annotations: z.array(AnnotationSchema),
});

const LLMResponseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  model: z.string(),
  promptToken: z.number(),
  completionToken: z.number(),
  systemFingerPrint: z.string(),
  finishReason: z.string(),
  runId: z.string(),
  runResultId: z.string(),
  output: z.null(),
  content: z.array(LLMContentSchema),
});

const SourcePostAuthorSchema = z.object({
  id: z.string(),
  fid: z.number(),
  createdAt: z.string(),
  userName: z.string(),
  displayName: z.string(),
  bioText: z.string(),
  verifications: z.array(z.string()),
  avatarUrl: z.string(),
  followers: z.number(),
  following: z.number(),
  activeStatus: z.string(),
});

const SourcePostSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  timestamp: z.string(),
  content: z.string(),
  likes: z.number(),
  reCasts: z.number(),
  output: z.null(),
  hash: z.string(),
  authorId: z.string(),
  runResultId: z.string(),
  author: SourcePostAuthorSchema,
});

const RunResultSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  runId: z.string(),
  sourcePost: z.array(SourcePostSchema),
  LLMResponse: z.array(LLMResponseSchema),
});

const RunSchema = z.object({
  id: z.string(),
  eventId: z.null(),
  triggerRunId: z.null(),
  taskId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.string(),
  storyId: z.string(),
  cost: z.null(),
  tokens: z.null(),
  results: z.array(RunResultSchema),
});

const GetStorySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  views: z.number(),
  status: z.string(),
  type: z.null(),
  authorId: z.string(),
  author: AuthorSchema,
  runs: z.array(RunSchema),
  votes: z.array(z.any()), // Adjust based on actual vote structure
  _count: z.object({
    bookmarks: z.number(),
    votes: z.number(),
  }),
});

export { GetStorySchema , LLMContentSchema};