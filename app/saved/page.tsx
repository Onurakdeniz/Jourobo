"use client";

import FeedContent from "@/components/home/feed/feed-content";
import Posts from "@/components/home/posts";
import { useFetchStories } from "@/hooks/useFetchStories";
import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import BeatLoader from "react-spinners/BeatLoader";



const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  

const page = () => {
  const router = useRouter();

  const { storiesState, isLoading, error, refetch } = useFetchStories({
    bookmarked: true,
  });

  useEffect(() => {
    if (storiesState.length > 0) {
      router.push(`?id=${storiesState[0].id}`);
    }
  }, [storiesState]);

if (!isLoading && storiesState.length === 0) {
     
      <div className="flex h-full w-full justify-center items-center">
        <div className="text-xl font-bold">You do not have any saved stories.</div>
      </div>
 
  }
 

  return (
    <div className="flex h-full md:mt-2 w-full">
      <div className="flex-col flex h-full w-full md:w-7/12 mx-auto md:pr-4">
        <div className="font-bold text-3xl"> Saved Stories</div>
        <Suspense>
        {isLoading ? (
          <div className="flex w-full h-full justify-center pb-32 items-center">
            <BeatLoader
              color="orange"
              loading={isLoading}
              cssOverride={override}
              size={24}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <FeedContent stories={storiesState} />
        )}
        
        </Suspense>
      </div>
      <div className="hidden md:flex-col md:flex gap-2 border-l pl-4 h-full w-5/12">
        <Suspense>
          <Posts />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
