import React from 'react'
import { BotMessageSquare } from 'lucide-react';
import { VT323 } from "next/font/google";

const VT323font = VT323({ subsets: ["latin"], weight: "400" });

const Logo = () => {
  return (
    <div className='font-bold items-center gap-2 px-0 flex w-2/12 text-orange-600'>
      <BotMessageSquare size={30} />
      {/* Apply the font family directly from your imported font */}
      <span className='hidden md:flex text-2xl uppercase'>
        Robojou
      </span>
    </div>
  )
}

export default Logo;
