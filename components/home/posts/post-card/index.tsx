import React from 'react'
import PostCardHeader from './post-card-header'
import PostCardBody from './post-card-body'
import PostCardFooter from './post-card-footer'

const PostCard = () => {
  return (
    <div className='flex-col flex gap-2'>
      <PostCardHeader />
      <PostCardBody />
      <PostCardFooter />
    </div>
  )
}

export default PostCard