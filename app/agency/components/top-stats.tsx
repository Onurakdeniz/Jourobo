import React from "react";
import TopStatItem from "./top-stat-item";

interface Stat {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: number | string;
}

interface TopStatsProps {
  stats: Stat[];
}

const TopStats: React.FC<TopStatsProps> = ({ stats }) => {
  return (
    <div className="hidden lg:flex w-full gap-4 items-center justify-end">
      {stats.map((stat, index) => (
        <TopStatItem key={index} Icon={stat.Icon} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
};

export default TopStats;
