import Link from "next/link";

interface NavbarItemProps {
    icon: JSX.Element;
    title: string;
    href: string;
    active: boolean;
  }
  
  export const NavbarItem: React.FC<NavbarItemProps> = ({
    icon,
    title,
    href,
    active,
  }) => {
    return (
      <Link
        href={href}
        className={`w-full items-center flex gap-3 ${active ? "active" : ""}`}
      >
        <div className="flex items-center gap-4 text-base w-full">
          <div className="w-4"> {icon}</div>
          <span className="font-normal">{title}</span>
        </div>
      </Link>
    );
  };
  