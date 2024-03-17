import React from "react";
import { Home , Bot ,Bell , ScanSearch, Newspaper,BookmarkPlus , SquareUser} from "lucide-react";
import Link from "next/link";
import { NavbarItem } from "./nabar-item";



const navbarData: any = [
  { icon: <Home size="24" /> , title: "Home", href: "/", active: true },
  { icon: <Newspaper size="22" />, title: "My Feed", href: "/item3", active: false },
  { icon: <Bot size="24" />, title: "My Agency", href: "/agency", active: false },
  { icon: <Bell size="24" />, title: "Notifications", href: "/item3", active: false },
  { icon: <BookmarkPlus size="24" />, title: "Saved", href: "/item3", active: false },
  { icon: <ScanSearch size="24" />, title: "Explore", href: "/item2", active: false },
  { icon: <SquareUser size="24" />, title: "Profile", href: "/item2", active: false },

  
];

const Navbar = () => {
  return (
    <div className="flex-col w-full flex gap-4">
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

