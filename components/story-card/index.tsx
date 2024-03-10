import React from 'react'
import CardHeader from './card-header'
import CardBody from './card-body'
import CardFooter from './card-footer'

const FeedCard = () => {
  return (
    <div className='flex-col flex gap-2 w-full '>
        <CardHeader />
        <CardBody />
        <CardFooter />
    </div>
  )
}

export default FeedCard