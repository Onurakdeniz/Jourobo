'use client'

import Feed from '@/components/home/feed'
import Posts from '@/components/home/posts'
import React, { Suspense } from 'react'



const page = () => {
  return (
    <div className="flex h-full   md:mt-2  w-full" >
    <div className="flex h-full w-full md:w-7/12 mx-auto md:pr-4">
    <Suspense>
      <Feed />
    </Suspense>
    </div>
    <div className="hidden md:flex-col md:flex gap-2 border-l pl-4 h-full w-5/12">
    <Suspense>
      <Posts />
      </Suspense>
    </div>
  </div>
  )
}

export default page