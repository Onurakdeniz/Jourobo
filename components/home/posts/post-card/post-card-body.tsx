import React from "react";

const PostCardBody = (
  {
    content 
  }
) => {
  return (
    <div>
        <span className="flex text-sm font-light  dark:text-neutral-400 text-neutral-600"> 
          {content}
      </span>
    </div>
  );
};

export default PostCardBody;
