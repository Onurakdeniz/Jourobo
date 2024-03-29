import React from 'react'
import { Bot } from 'lucide-react';
import { VT323 } from "next/font/google";

const VT323font = VT323({ subsets: ["latin"], weight: "400" });

const Logo = () => {
  return (
    <div className='font-semibold items-center justify-start gap-2  flex w-2/12  px-2 '>
      <div className='text-orange-600 dark:bg-inherit   flex gap-2     rounded-md'>


      {/* Apply the font family directly from your imported font */}
      <span className='hidden md:flex text-3xl font-bold  '>
          JOU
      </span>

      <Bot size={34}/>
      </div>
    </div>
  )
}

export default Logo;
