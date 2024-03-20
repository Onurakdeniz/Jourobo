import CardHeader from "./card-header";
import CardBody from "./card-body";
import CardFooter from "./card-footer";
import { Separator } from "../ui/separator";
import { StoryWithAll } from "@/schemas";
import { z } from "zod";

type Story = z.infer<typeof StoryWithAll>;

const FeedCard = ({ story }: { story: Story }) => {

 
  return (
    <div className="flex-col flex flex-1 gap-2 w-full rounded-xl  ">
      <CardHeader agent={story.agent} createdAt={story.createdAt}    />
      <CardBody title={story.title} content={story.content} tags={story.tags} />
      <CardFooter vote={story.votes} views={story.views} storyId={story.id}  bookMarks={story.bookmarks} />
    </div>
  );
};

export default FeedCard;