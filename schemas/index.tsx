

///// NOTE REFACTORING REQUIRED  /////


import { z, ZodRawShape, ZodSchema, ZodTypeAny } from "zod";
// Enum Schemas

export const SourceTypeSchema = z.enum([
  "FARCASTER_USER",
  "FARCASTER_POST",
  "FARCASTER_CHANNEL",
]);

export const TaskStateSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const RunStatusSchema = z.enum([
  "CANCELLED",
  "PENDING",
  "RUNNING",
  "COMPLETED",
  "FAILED",
]);

export const VoteTypeSchema = z.enum(["UP", "DOWN", "NONE"]);

// Type Definitions

export interface Comment extends z.infer<typeof BaseSchema> {
  content: string;
  story: Story;
  storyId: string;
  user: User;
  userId: string;
  parent?: Comment;
  parentId?: string;
  children?: Comment[];
}

export interface User extends z.infer<typeof BaseSchema> {
  privyUserId: string;
  isAdmin: boolean;
  hasFinishedSetup: boolean;
  exWallet?: string;
  custodyAddress?: string;
  verifications: string[];
  verifiedAddresses: z.infer<typeof VerifiedAddressesSchema>[];
  votes: z.infer<typeof VoteSchema>[];
  agencies: z.infer<typeof AgencyOwnerSchema>[];
  profile?: z.infer<typeof ProfileSchema>;
  comments: Comment[];
  notifications: z.infer<typeof NotificationSchema>[];
  follow: z.infer<typeof FollowSchema>[];
  bookmarks: z.infer<typeof BookmarkSchema>[];
}

export interface Agency extends z.infer<typeof BaseSchema> {
  userName: string;
  name: string;
  owners: z.infer<typeof AgencyOwnerSchema>[];
  description: string;
  logo?: string;
  agents?: z.infer<typeof AgentSchema>[];
}

export interface AIModel extends z.infer<typeof BaseSchema> {
  llm: string;
  model: string;
  tools?: string;
  apiKey: string;
  agents?: Agent[];
}

export interface Source extends z.infer<typeof BaseSchema> {
  agentId: string;
  agent: Agent;
  type: z.infer<typeof SourceTypeSchema>;
  farUserIds?: string[];
  farPostIds?: string[];
  farChannelNames?: string[];
  scrapperRunId: string;
  scrapperRun: ScrapperRun;
}

export interface Category extends z.infer<typeof BaseSchema> {
  name: string;
  agents?: Agent[];
}

export interface Task extends z.infer<typeof BaseSchema> {
  agentId: string;
  agent: Agent;
  name: string;
  description?: string;
  scrapperRunId: string;
  scrapperRun?: ScrapperRun;
  LLMRunId: string;
  LLMRun?: LLMRun;
  isOneTimeRun: boolean;
  frequency?: string;
  state: z.infer<typeof TaskStateSchema>;
}

export interface ScrapperRun extends z.infer<typeof BaseSchema> {
  taskId: string;
  task: Task;
  start: Date;
  end?: Date;
  interval: string;
  scrapingData?: any;
  sources?: Source[];
  story?: Story;
}

export interface LLMRun extends z.infer<typeof BaseSchema> {
  taskId: string;
  task: Task;
  promptId?: string;
  prompt?: Prompt;
  aiModelId: string;
  AIModel: AIModel;
  start: Date;
  end?: Date;
  input: string;
  llmName: string;
  modelName: string;
  cost: number;
  tokens: number;
  output: string;
  storyId: string;
  story?: Story;
}

export interface Prompt extends z.infer<typeof BaseSchema> {
  prompt: string;
  temperature?: string;
  customInstructions?: string;
  responseFormat?: string;
  outputStyle?: string;
  role?: string;
  agent: Agent;
  agentId: string;
  LLMRun?: LLMRun[];
}

export interface Agent extends z.infer<typeof BaseSchema> {
  aiModel: AIModel;
  aiModelId: string;
  userName: string;
  categories?: Category[];
  sources?: Source[];
  tasks?: Task[];
  prompts?: Prompt[];
  stories?: Story[];
  follow: z.infer<typeof FollowSchema>[];
  profileId: string;
  profile: z.infer<typeof ProfileAgentSchema>;
  points: z.infer<typeof PointSchema>[];
}

export interface Story extends z.infer<typeof BaseSchema> {
  title: string;
  content: string;
  LLMRunId: string;
  LLMRun: LLMRun;
  scrapperRunId: string;
  scrapperRun: ScrapperRun;
  agent: Agent;
  agentId: string;
  tags: string[];
  views: number;
  comments?: Comment[];
  votes: z.infer<typeof VoteSchema>[];
  bookmarks: z.infer<typeof BookmarkSchema>[];
  points: z.infer<typeof PointSchema>[];
}

// Base Schemas

export const BaseSchema = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const AgencyOwnerSchema = z.object({
  username: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().optional(),
  fid: z.string(),
});

export const VerifiedAddressesSchema = z.object({
  id: z.string().uuid(),
  ethAddresses: z.array(z.string()),
  solAddresses: z.array(z.string()),
  userId: z.string(),
});

export const VoteSchema = z.object({
  id: z.string(),
  voteType: VoteTypeSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  storyId: z.string().optional(),
  commentId: z.string().optional(),
});

export const BookmarkSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  bookmarked: z.boolean(),
  userId: z.string(),
  storyId: z.string(),
});

// id , fid , bioText , username  ,displayName , avatarUrl , farcasterfolloer , farcaster following
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string(),
  avatarUrl: z.string().max(500).optional(),
  bioText: z.string(),
  mentioned_profiles: z.array(z.string()),
  farcasterFollowerCount: z.number().int(),
  farcasterFollowingCount: z.number().int(),
  activeStatus: z.string().optional(),
  userId: z.string(),
});

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.string(),
  isRead: z.boolean(),
  readAt: z.date().optional(),
  message: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  agentId: z.string(),
  storyUrl: z.string(),
  storyTitle: z.string(),
});

export const FollowSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  agentId: z.string(),
});

export const ProfileAgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional(),
  description: z.string(),
  defaultInstructions: z.string().optional(),
  focus: z.string().optional(),
  agentId: z.string(),
});

export const PointSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  storyId: z.string().optional(),
  agentId: z.string().optional(),
  points: z.number(),
});

// Type Definitions

// Circular Reference Schemas

export const CommentSchema: z.ZodType<Comment> = BaseSchema.extend({
  content: z.string(),
  story: z.lazy(() => StorySchema),
  storyId: z.string(),
  user: z.lazy(() => UserSchema),
  userId: z.string(),
  parent: z.lazy(() => CommentSchema).optional(),
  parentId: z.string().optional(),
  children: z.array(z.lazy(() => CommentSchema)).optional(),
});

export const UserSchema: z.ZodType<User> = BaseSchema.extend({
  privyUserId: z.string(),
  isAdmin: z.boolean(),
  hasFinishedSetup: z.boolean(),
  exWallet: z.string().optional(),
  custodyAddress: z.string().optional(),
  verifications: z.array(z.string()),
  verifiedAddresses: z.array(VerifiedAddressesSchema),
  agencies: z.array(AgencyOwnerSchema),
  profile: ProfileSchema.optional(),
  votes: z.array(VoteSchema),
  follow: z.array(FollowSchema),
  bookmarks: z.array(BookmarkSchema),
  comments: z.array(CommentSchema),
  notifications: z.array(NotificationSchema),
});

// Agency Schemas
export const AgencySchema = BaseSchema.extend({
  userName: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Name is required"),
  owners: z.array(AgencyOwnerSchema),
  description: z.string().min(3, "Description must be at least 3 characters"),
  logo: z.string().optional(),
  agents: z.array(z.lazy(() => AgentSchema)).optional(),
}).strict();

// Extended Agency Schemas

export const AgentbyAgency = z.object({
  id: z.string(),
  createdAt: z.date(),
  userName: z.string(),
  categories: z.array(z.lazy(() => CategorySchema)).optional(),
  profile: z.lazy(() => ProfileAgentSchema),
  viewCount: z.number().int(),
  storyCount: z.number().int(),
});

export const MidSchema = AgencySchema.omit({
  agents: true,
});

export const getAgencySchema = MidSchema.extend({
  agentCount: z.number().optional(),
  totalStoryCount: z.number().optional(),
  agents: z.array(z.lazy(() => AgentbyAgency)).optional(),
});

export const getAgencySchemawithCounts = AgencySchema.extend({
  totalStoryCount: z.number(),
  agentCount: z.number(),
});

export const CreateAgencySchema = AgencySchema.pick({
  userName: true,
  name: true,
  description: true,
  logo: true,
});

export const EditAgencySchema = AgencySchema.pick({
  id: true,
  userName: true,
  name: true,
  description: true,
  logo: true,
});

// AI Model Schemas
export const AIModelSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  llm: z.string(),
  model: z.string(),
  tools: z.string().optional(),
  apiKey: z.string(),
  agents: z.array(z.lazy(() => AgentSchema)).optional(),
});

export const SourceSchema: z.ZodType<Source> = BaseSchema.extend({
  agentId: z.string(),
  agent: z.lazy(() => AgentSchema),
  type: SourceTypeSchema,
  farUserIds: z.array(z.string()).optional(),
  farPostIds: z.array(z.string()).optional(),
  farChannelNames: z.array(z.string()).optional(),
  scrapperRunId: z.string(),
  scrapperRun: z.lazy(() => ScrapperRunSchema),
});

export const CategorySchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  name: z.string(),
  agents: z.array(z.lazy(() => AgentSchema)).optional(),
});

export const TaskSchema: z.ZodType<Task> = BaseSchema.extend({
  agentId: z.string(),
  agent: z.lazy(() => AgentSchema),
  name: z.string(),
  description: z.string().optional(),
  isOneTimeRun: z.boolean(),
  frequency: z.string().optional(),
  scrapperRunId: z.string(),
  scrapperRun: z.lazy(() => ScrapperRunSchema).optional(),
  LLMRunId: z.string(),
  LLMRun: z.lazy(() => LLMRunSchema).optional(),
  state: TaskStateSchema,
});

export const ScrapperRunSchema: z.ZodType<ScrapperRun> = BaseSchema.extend({
  taskId: z.string(),
  task: z.lazy(() => TaskSchema),
  start: z.date(),
  end: z.date().optional(),
  interval: z.string(),
  scrapingData: z.any(),
  sources: z.array(z.lazy(() => SourceSchema)).optional(),
  story: z.lazy(() => StorySchema).optional(),
  status: RunStatusSchema,
});

export const LLMRunSchema: z.ZodType<LLMRun> = BaseSchema.extend({
  taskId: z.string(),
  task: z.lazy(() => TaskSchema),
  promptId: z.string().optional(),
  prompt: z.lazy(() => PromptSchema).optional(),
  aiModelId: z.string(),
  AIModel: z.lazy(() => AIModelSchema),
  start: z.date(),
  end: z.date().optional(),
  input: z.string(),
  llmName: z.string(),
  modelName: z.string(),
  cost: z.number(),
  tokens: z.number(),
  output: z.string(),
  storyId: z.string(),
  story: z.lazy(() => StorySchema).optional(),
  status: RunStatusSchema,
});

export const PromptSchema: z.ZodType<Prompt> = BaseSchema.extend({
  prompt: z.string(),
  role: z.string().optional(),
  temperature: z.string().optional(),
  customInstructions: z.string().optional(),
  responseFormat: z.string().optional(),
  outputStyle: z.string().optional(),
  agent: z.lazy(() => AgentSchema),
  agentId: z.string(),
  LLMRun: z.array(z.lazy(() => LLMRunSchema)).optional(),
});

export const AgentSchema: z.ZodType<Agent> = z
  .object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userName: z.string(),
    aiModel: z.lazy(() => AIModelSchema),
    aiModelId: z.string(),
    categories: z.array(z.lazy(() => CategorySchema)).optional(),
    sources: z.array(z.lazy(() => SourceSchema)).optional(),
    tasks: z.array(z.lazy(() => TaskSchema)).optional(),
    prompts: z.array(z.lazy(() => PromptSchema)).optional(),
    stories: z.array(z.lazy(() => StorySchema)).optional(),
    profileId: z.string(),
    profile: z.lazy(() => ProfileAgentSchema),
    follow: z.array(z.lazy(() => FollowSchema)),
    points: z.array(z.lazy(() => PointSchema)),
  })
  .strict();

export const getAgentByAgentUserNameSchema = z.object({
  createdAt: z.date(),
  id: z.string(),
  agency: z.lazy(() => getAgencySchema),
  userName: z.string(),
  agencyId: z.string(),
  prompt: z.lazy(() => PromptSchema),
  tasks: z.array(z.lazy(() => TaskSchema)).optional(),
  updattedAt: z.date(),
  storyCount: z.number().int(),
  categories: z.array(z.lazy(() => CategorySchema)).optional(),
  profile: z.lazy(() => ProfileAgentSchema),
});

export const AIModelSchemaWithoutId = AIModelSchema.omit({
  apiKey: true,
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const ProfileAgentSchemaWithoutId = ProfileAgentSchema.omit({
  id: true,
  createdAt: true,
  agentId: true,
});

export const CreateAgentSchema = z.object({
  userName: z.string(),
  aiModel: z.lazy(() => AIModelSchemaWithoutId),
  profile: z.lazy(() => ProfileAgentSchemaWithoutId),
  categories: z.string().array().optional(),
});

export const getAgentSchema = z
  .object({
    id: z.string(),
    createdAt: z.date(),
    categories: z.array(z.lazy(() => CategorySchema)).optional(),
    profile: z.lazy(() => ProfileAgentSchema),
  })
  .strict();

export const StorySchema: z.ZodType<Story> = BaseSchema.extend({
  title: z.string(),
  content: z.string(),
  LLMRunId: z.string(),
  LLMRun: z.lazy(() => LLMRunSchema),
  scrapperRunId: z.string(),
  scrapperRun: z.lazy(() => ScrapperRunSchema),
  agent: z.lazy(() => AgentSchema),
  agentId: z.string(),
  tags: z.array(z.string()),
  views: z.number().int(),
  comments: z.array(z.lazy(() => CommentSchema)).optional(),
  votes: z.array(VoteSchema),
  bookmarks: z.array(BookmarkSchema),
  points: z.array(PointSchema),
});

 

export const StoriesAgentProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatarUrl: z.string(),
  description: z.string(),
  focus: z.string().nullable(),

});



export const StoriesAgentSchema = z.object({
  id: z.string().uuid(),
  agencyId: z.string().uuid(),
  created: z.string().datetime(),
  updated: z.string().datetime(),
  userName: z.string(),
  defaultAiModelId: z.string().nullable(),
  profile: StoriesAgentProfileSchema,
  totalViews: z.number(),
});

export const StoriesSoucePostAuthorSchema = z.object({
  fid: z.string().uuid(),
  avatarUrl: z.string().url(),
  displayName: z.string(),
  username: z.string(),
  followers : z.number() ,
  following : z.number() 
});

export const StoriesSourcePostSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  author: StoriesSoucePostAuthorSchema,
  createdAt: z.string().datetime(),
  likes:  z.number(), 
  reCasts : z.number(),
});

export const StoryWithAll = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  agentId: z.string().uuid(),
  tags: z.array(z.string()),
  views: z.number(),
  runId: z.string().uuid(),
  votes:  z.number(),
  author: StoriesAgentSchema,
  post : StoriesSourcePostSchema,
});

//////////////////////////////////////////////////////////////////////////////////////

enum SourceType {
  FARCASTER_USER = "FARCASTER_USER",
  FARCASTER_POST = "FARCASTER_POST",
  FARCASTER_CHANNEL = "FARCASTER_CHANNEL",
}

export const CreateTaskSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  isStaticRun: z.boolean(),
  interval: z.string().optional(),
  prompt: z.object({
    promptMessage: z.object({
      content: z.string().min(1),
    }),
    systemMessage: z.object({
      content: z.string().optional(),
    }),
  }),
  aiModel: z.object({
    llm: z.string().optional(),
    model: z.string().optional(),
    apiKey: z.string().optional(),
  }),
  source: z.object({
    type: z.nativeEnum(SourceType),
    ids: z.array(z.string().min(1)),
  }),
});
