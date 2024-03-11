import React from 'react'
import PostCard from '../post-card'
import { Scroll } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

const PostFeed = () => {
  return (
    <ScrollArea className='flex items-center gap-2 overflow-auto pr-4 mt-2  ' style={{ height: 'calc(100vh - 300px)' }}>
    <div className='flex-col flex gap-6'>
        <PostCard/>
        <PostCard/>
        <PostCard/>
        <PostCard/>
        <PostCard/>
        <PostCard/>

    </div>
</ScrollArea>
  )
}

export default PostFeed