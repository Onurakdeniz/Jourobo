import React from 'react'
import AgentListItem from './agent-list-item'
import { ScrollArea } from '@/components/ui/scroll-area'

const AgentList = () => {
  return (
<ScrollArea className="flex pr-2" style={{ height: 'calc(100vh - 430px)' }}>
 <div className='flex-col flex gap-2'>
    <AgentListItem />
    <AgentListItem />
    <AgentListItem />
    <AgentListItem />
 
 
    </div>
    </ScrollArea>
  )
}

export default AgentList