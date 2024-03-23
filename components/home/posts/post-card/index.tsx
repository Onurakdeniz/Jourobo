import React from 'react'
import PostCardHeader from './post-card-header'
import PostCardBody from './post-card-body'
import PostCardFooter from './post-card-footer'



const PostCard = (
  {
    post 
  }
) => {
  
  return (
    <div className='flex-col flex gap-2'>
      <PostCardHeader
      authorDisplayName={post.authorDisplayName}
      authorAvatar={post.authorAvatar}
      postCreatedAt = {post.postCreatedAt}
      authorUserName = {post.authorUserName}
      
      />
      <PostCardBody 
      content={post.postContent}
      />
      <PostCardFooter
      likes = {post.postLikes}
      reCasts = {post.postReCasts}
      />
    </div>
  )
}

export default PostCard