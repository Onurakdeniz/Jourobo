import React from 'react'
import { Bot } from 'lucide-react';
import { VT323 } from "next/font/google";

const VT323font = VT323({ subsets: ["latin"], weight: "400" });

const Logo = () => {
  return (
    <div className='font-semibold items-center gap-2 px-0 flex w-2/12 dark:text-white text-black '>
      <Bot size={36} />
      {/* Apply the font family directly from your imported font */}
      <span className='hidden md:flex text-3xl   '>
          JOU
      </span>
    </div>
  )
}

export default Logo;
