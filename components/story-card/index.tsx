import CardHeader from "./card-header";
import CardBody from "./card-body";
import CardFooter from "./card-footer";
import { Separator } from "../ui/separator";
import { GetStorySchema } from "@/schemas/story";
import { z } from "zod";

type Story = z.infer<typeof GetStorySchema>;

const FeedCard = ({ story }: { story: Story }) => {
  let content = story.runs?.[0]?.results?.[0]?.LLMResponse?.[0]?.content?.[0] ?? undefined;

  const sourcePosts = story.runs?.[0]?.results?.[0]?.sourcePost ?? [];
  const numberOfSourcePosts = sourcePosts.length;
  const postAuthors = sourcePosts.map(post => ({
    avatarUrl: post.author.avatarUrl,
    fid: post.author.fid,
    userName: post.author.userName,
    followers : post.author.followers
  }));

  const aiModel = story.runs?.[0]?.results?.[0]?.LLMResponse?.[0]?.model ?? undefined;
  let aiModelName = aiModel;
if (aiModel === "gpt-4-0125-preview") {
  aiModelName = "GPT4-T";
} else if (aiModel === "gpt-3.5-turbo-0125") {
  aiModelName = "GPT-3.5-T";
}

const storyId = story.id;
 
  return (
    <div className="flex-col flex w-full   gap-2 rounded-xl   ">
      <CardHeader agent={story.author} createdAt={story.createdAt}  postNumbers={numberOfSourcePosts} postAuthors={postAuthors}  />
      <CardBody  content={content} aiModel={aiModelName}  storyId={storyId}/>
      <CardFooter vote={story.votes} views={story.views} storyId={story.id}  bookMarks={story.bookmarks} />
    </div>
  );
};

export default FeedCard;