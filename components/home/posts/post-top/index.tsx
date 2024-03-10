import React from 'react'
import PostTitle from './title'
import { Separator } from '@/components/ui/separator'
import PostsStat from './stat'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'

const PostTop = () => {
  return (
    <div className='flex-col flex w-full gap-4 '>
              <PostTitle/>
              <Separator/>
              <PostsStat/>
              
        <TabsList className="flex gap-4 p-0 w-full bg-background justify-start font-bold">
      <TabsTrigger className="justify-start text-base p-0 w-32 pb-2 rounded-none data-[state=active]:shadow-none data-[state=active]:border-orange-600 data-[state=active]:border-b-2" value="posts">Source Posts</TabsTrigger>
      <TabsTrigger className="justify-start text-base p-0 w-32 pb-2 rounded-none data-[state=active]:shadow-none data-[state=active]:border-orange-600 data-[state=active]:border-b-2" value="comments">Comments</TabsTrigger>
      <TabsTrigger className="justify-start text-base  p-0 w-32 pb-2 rounded-none data-[state=active]:shadow-none data-[state=active]:border-orange-600 data-[state=active]:border-b-2"  value="myfeed">Contribute</TabsTrigger>
    </TabsList>
        
    </div>
  )
}

export default PostTop