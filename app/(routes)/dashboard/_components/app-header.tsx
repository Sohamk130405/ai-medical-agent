import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const menuItems = [
  { id: 1, name: "Home", href: "/home" },
  { id: 2, name: "History", href: "/history" },
  { id: 3, name: "Pricing", href: "/pricing" },
  { id: 4, name: "Profile", href: "/profile" },
];

const AppHeader = () => {
  return (
    <div className="flex items-center justify-between px-10 md:px-20 lg:px-40 shadow py-4">
      <Image src={"/logo.svg"} height={40} width={40} alt="logo" />
      <div className="hidden md:flex items-center gap-12">
        {menuItems.map((item) => (
          <div key={item.id}>
            <Link href={item.href}>
              <h2 className="hover:font-semibold transition-all">
                {item.name}
              </h2>
            </Link>
          </div>
        ))}
      </div>
      <UserButton />
    </div>
  );
};

export default AppHeader;
