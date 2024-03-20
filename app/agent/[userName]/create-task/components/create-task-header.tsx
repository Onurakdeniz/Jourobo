import { Button } from '@/components/ui/button'
import { ClipboardCheck } from 'lucide-react'
import React from 'react'

const CreateTaskHeader = () => {
  return (
    <div className='flex justify-between items-center border-b pb-4'> 
    <div className="flex gap-4 items-center ">
      <ClipboardCheck size={32} />
      <span className='text-2xl font-bold'>Create Agent Task</span>
    </div>
  
    </div>
  )
}

export default CreateTaskHeader