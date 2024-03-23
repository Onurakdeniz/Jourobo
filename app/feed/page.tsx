'use client'

import Feed from '@/components/home/feed'
import Posts from '@/components/home/posts'
import React from 'react'

const page = () => {
  return (
    <div className="flex h-full   md:mt-4  w-full" >
    <div className="flex h-full w-full md:w-7/12 mx-auto md:pr-4">
      <Feed />
    </div>
    <div className="hidden md:flex-col md:flex gap-2 border-l pl-4 h-full w-5/12">
      <Posts />
    </div>
  </div>
  )
}

export default page