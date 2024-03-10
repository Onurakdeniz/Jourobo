import React from 'react'
import CardHeader from './card-header'
import CardBody from './card-body'
import CardFooter from './card-footer'
import { Separator } from '../ui/separator';
import Comments from './comments';
 

interface FeedCardProps {
  isActive?: boolean;
}

const FeedCard: React.FC<FeedCardProps> = ({ isActive = false }) => {
  return (
    <div className={`flex-col flex gap-2 w-full px-4 py-2 border rounded-xl  ${isActive ? 'bg-primary/5 ' : ''}`}>
        <CardHeader isActive={isActive} />
        <CardBody />
        <CardFooter />
  
 
    </div>
  )
}

export default FeedCard