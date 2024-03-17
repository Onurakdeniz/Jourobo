import React from 'react'
import Logo from './logo'
import Profile from './profile'
import SearchBar from './search-bar'

const Header = () => {
  return (
    <div className='flex justify-between  container px-0 pt-2 my-2 pb-4 border-b '>
        <Logo />
        <SearchBar />
        <Profile />
    </div>
  )
}

export default Header