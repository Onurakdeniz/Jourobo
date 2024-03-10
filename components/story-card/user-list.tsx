import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import UserListItem from './user-list-item'
import { Separator } from '../ui/separator'

const UserList = () => {
  return (
    <div className='flex-col flex w-80'> 
    <div className='text-sm font-seminold'>Story Sources</div>
    <Separator className='w-full my-2' />
     <ScrollArea className='min-h-fit max-h-48 flex overflow-y-scroll'>
        <div className='flex-col flex gap-2'> 
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            <UserListItem />
            </div>
        </ScrollArea>
   </div>

  )
}

export default UserList