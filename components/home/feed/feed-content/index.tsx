import FeedCard from '@/components/story-card'
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

const FeedContent = () => {
  return (
    <ScrollArea className='flex p-2 items-center gap-2 overflow-auto pr-4' style={{ height: 'calc(100vh - 160px)' }}>
      <div className='flex-col flex gap-6'> 
        <FeedCard isActive={true} />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        </div>
    </ScrollArea>
  )
}

export default FeedContent