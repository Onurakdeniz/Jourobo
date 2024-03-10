import React from "react";
import { Home , Bot ,Bell , BotMessageSquare, Newspaper} from "lucide-react";
import Link from "next/link";
import { NavbarItem } from "./nabar-item";



const navbarData: any = [
  { icon: <Home size="16" /> , title: "Home", href: "/item1", active: true },
  { icon: <Newspaper size="16" />, title: "My Feed", href: "/item3", active: false },
  { icon: <Bot size="18" />, title: "Create Agency", href: "/item3", active: false },
  { icon: <Bell size="16" />, title: "Notifications", href: "/item3", active: false },
  { icon: <BotMessageSquare size="16" />, title: "My Agency", href: "/item2", active: false },

  
];

const Navbar = () => {
  return (
    <div className="flex-col w-full flex gap-2">
      <div className="flex gap-4 flex-col mt-2 w-full">
        {navbarData.map((item : any, index : any) => (
          <NavbarItem
            key={index}
            icon={item.icon}
            title={item.title}
            href={item.href}
            active={item.active}
          />
        ))}
      </div>
    </div>
  );
};

export default Navbar;

