import Navbar from "@/components/home/navbar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Agents from "@/components/home/agents";
import Feed from "@/components/home/feed";
import Posts from "@/components/home/posts";

export default function Home() {
  return (
    <div className="flex h-full mt-1 md:mt-4  w-full" >
      <div className="flex h-full w-full md:w-8/12 md:pr-4">
        <Feed />
      </div>
      <div className="hidden md:flex-col md:flex gap-2 h-full w-4/12">
        <Posts />
      </div>
    </div>
  );
}
