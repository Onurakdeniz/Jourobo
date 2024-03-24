import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from '../ui/separator'

export const UserList = ({ authors }) => {
  // Sort authors by followers in descending order
  const sortedAuthors = [...authors].sort((a, b) => b.followers - a.followers);

  const uniqueAuthors = sortedAuthors.reduce((unique, author) => {
    if (!unique.some(item => item.userName === author.userName)) {
      unique.push(author);
    }
    return unique;
  }, []);

  return (
    <div className='flex-col flex w-80'> 
      <div className='text-sm font-seminold'>Story Sources</div>
      <Separator className='w-full my-2' />
      <ScrollArea className='min-h-fit max-h-48 flex overflow-y-scroll'>
        <div className='flex-col flex gap-2'> 
          {uniqueAuthors.map((author, index) => (
            <UserListItem key={index} author={author} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
};

 


export const UserListItem = ({ author }) => {
  return (
    <div className="flex gap-1 items-center">
      <Avatar className="w-6 h-6  border-2">
        <AvatarImage src={author.avatarUrl} alt="avatar" />
        <AvatarFallback className="text-xs">{author.userName[0]}</AvatarFallback>
      </Avatar>

      <div className="text-xs text-muted-foreground">@{author.userName}</div>
    </div>
  );
};
