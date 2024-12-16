"use client";

import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationTabs {
  title: string;
  href: string;
}

const navigationTabs: NavigationTabs[] = [
  { title: "Profile", href: "/user/profile" },
  { title: "My Books", href: "/user/my-books" },
  { title: "Enquires", href: "/user/enquiries" },
  { title: "My Rentals", href: "/user/rentals" },
  { title: "Sold Books", href: "/user/sold-books" },
  { title: "Referral", href: "/user/referral" },
  { title: "Coins", href: "/user/coins" },
  { title: "Customer Support", href: "/user/customer-support" },
];

export function NavigationTabs() {
  const pathname = usePathname();

  return (
    <nav className="max-w-sm w-full mx-auto bg-white border rounded-xl my-4 shadow-md py-5">
      <div className="">
        {navigationTabs.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "block py-3 px-5 text-xl cursor-pointer text-[#202124] font-medium  transition-colors",
              pathname === item.href
                ? "text-blue-600 border-y-0 border-r-0 border border-l-4 border-l-[#0070C4] "
                : " hover:bg-gray-100"
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>

      <div className=" border-t">
        <Link
          href="/login"
          className={`block py-4 px-5 font-medium  transition-colors   text-red-500   text-xl ${pathname === "/logout" ? "text-blue-600 border-y-0 border-r-0 border border-l-4 border-l-[#0070C4] " : "hover:bg-gray-100"}`}
          onClick={() => signOut()}
        >
          Log Out
        </Link>
      </div>
    </nav>
  );
}
