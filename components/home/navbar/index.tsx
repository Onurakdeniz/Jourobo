import React from "react";
import { Home , Bot ,Bell , ScanSearch, Newspaper,BookmarkPlus , SquareUser} from "lucide-react";
import Link from "next/link";
import { NavbarItem } from "./nabar-item";



const navbarData: any = [
  { icon: <Home size="24" /> , title: "Home", href: "/feed", active: true },
  { icon: <Newspaper size="22" />, title: "My Feed", href: "/feed", active: false },
  { icon: <Bot size="24" />, title: "My Agency", href: "/agency", active: false },
  { icon: <Bell size="24" />, title: "Notifications", href: "#", active: false },
  { icon: <BookmarkPlus size="24" />, title: "Saved", href: "/saved", active: false },
  { icon: <ScanSearch size="24" />, title: "Explore", href: "/explore", active: false },
  { icon: <SquareUser size="24" />, title: "Profile", href: "#", active: false },



  
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

