'use client'

import FeedCard from '@/components/story-card'
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useFetchStories } from '@/hooks/useFetchStories'
import { StoryWithAll } from "@/schemas";
import { z } from 'zod'

type Story = z.infer<typeof StoryWithAll>;

const FeedContent = (
  { stories } : { stories: Story[] }
) => {
  return (
    <ScrollArea className='flex w-full  mt-4 items-center gap-2 overflow-auto pr-4  ' style={{ height: 'calc(100vh - 120px)' }}>
          <div  className='contents'>
      <div className='flex-col flex w-full gap-10'> 
        {stories.map((story : any, index :number) => (
          <FeedCard key={index} story={story}  />
        ))}
      </div>
      </div>
    </ScrollArea>
  )
}

export default FeedContent


