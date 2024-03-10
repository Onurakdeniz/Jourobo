import React from 'react'
import { Bot } from 'lucide-react';

const Logo = () => {
  return (
    <div className='font-bold items-center gap-2  px-0 flex w-2/12 text-orange-600 pb-1'>
      <Bot size={32} />
      <span className='text-2xl'>  Robo Juorno </span> </div>
  )
}

export default Logo