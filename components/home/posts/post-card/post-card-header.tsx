import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

const PostCardHeader = () => {
  return (
    <div className='flex justify-between items-center  h-10 '>
         <div className="flex gap-1 items-center">
          <Avatar className="h-5 w-5">
            <AvatarFallback> sds </AvatarFallback>
            <AvatarImage src="/soty.png" />
          </Avatar>

          <div className="text-sm hover:cursor-pointer ">Onur Akdeniz</div>
          <div className="text-xs ml-1 text-muted-foreground">2h Ago</div>
        </div>

    </div>
  )
}

export default PostCardHeader