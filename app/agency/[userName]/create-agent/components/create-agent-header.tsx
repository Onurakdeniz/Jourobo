import { Button } from '@/components/ui/button'
import { Bot } from 'lucide-react'
import React from 'react'

const CreateAgentHeader = () => {
  return (
    <div className='flex justify-between items-center border-b pb-4'> 
    <div className="flex gap-4 items-center ">
      <Bot size={36} />
      <span className='text-2xl font-bold'>Create Your Agent</span>
    </div>
  
    </div>
  )
}

export default CreateAgentHeader