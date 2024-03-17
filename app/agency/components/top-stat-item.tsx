// Import React and necessary icon wrapper type
import React from 'react';
import { Badge } from "@/components/ui/badge"; // Adjust the import path as needed

interface TopStatItemProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: number | string;
}

const TopStatItem: React.FC<TopStatItemProps> = ({ Icon, title, value }) => {
  return (
    <Badge variant="default" className="flex gap-1 items-center  ">
    <div className="flex gap-1 items-center">
    <Icon className="h-4 w-4 mr-2" />
      <span className="text-sm">{title}</span>
    </div>
    
    <div className="text-base font-bold items-center self-end">{value}</div>
    </Badge>
  );
};

export default TopStatItem;
