/* eslint-disable indent */
/* eslint-disable no-extra-parens */
/* eslint-disable no-nested-ternary */
"use client";

import GlobalContext from "@/contexts/GlobalContext";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const navigationTabs: { title: string; href: string }[] = [
  { title: "Profile", href: "/user/profile" },
  { title: "My Books", href: "/user/my-books" },
  { title: "My Sent Requests", href: "/user/my-requests" },
  { title: "Received Requests", href: "/user/received-requests" },
  { title: "My Rentals", href: "/user/rentals" },
  { title: "Sold Books", href: "/user/sold-books" },
  { title: "Referral", href: "/user/referral" },
  { title: "Coins", href: "/user/coins" },
  { title: "Customer Support", href: "/user/customer-support" },
];

export function NavigationTabs() {
  const pathname = usePathname();
  const { profileDetails, setMyBooksTabActive } = useContext(GlobalContext);

  return (
    <nav className="max-w-sm w-full mx-auto bg-white border rounded-xl my-4 shadow-md py-5">
      <div>
        {navigationTabs.map((item, index) => {
          const isActive = pathname === item.href;
          const notificationCount =
            item.title === "My Sent Requests"
              ? profileDetails?.notification_counts?.my_requests
              : item.title === "Received Requests"
                ? profileDetails?.notification_counts?.received_requests
                : 0;

          return (
            <Link
              key={index}
              href={item.href}
              onClick={() =>
                item.title === "My Books" && setMyBooksTabActive(true)
              }
              className={cn(
                "block py-3 px-5 text-xl cursor-pointer text-[#202124] font-medium transition-colors",
                isActive
                  ? "text-blue-600 border-y-0 border-r-0 border border-l-4 border-l-[#0070C4]"
                  : "hover:bg-gray-100",
                (item.title === "My Sent Requests" ||
                  item.title === "Received Requests") &&
                  "relative"
              )}
            >
              {item.title}
              {notificationCount! > 0 && (
                <span
                  className={`absolute ${item.title === "My Sent Requests" ? "top-3 left-[185px]" : "top-2 left-48"} h-3 w-3 md:max-w-max md:max-h-max p-2.5 rounded-full bg-[#FF851B] text-[8px] md:text-[10px] font-medium text-white flex items-center justify-center`}
                >
                  {notificationCount! > 99 ? "99+" : notificationCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="border-t">
        <p
          className={cn(
            "block py-4 px-5 font-medium transition-colors cursor-pointer text-red-500 text-xl",
            pathname === "/logout"
              ? "text-blue-600 border-y-0 border-r-0 border border-l-4 border-l-[#0070C4]"
              : "hover:bg-gray-100"
          )}
          onClick={(e) => {
            e.preventDefault();
            signOut({ callbackUrl: "/login" });
          }}
        >
          Log Out
        </p>
      </div>
    </nav>
  );
}
