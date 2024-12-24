"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function ProfileDropdown() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 md:h-10 md:w-10 cursor-pointer">
          <AvatarImage src="/svgs/profile-img.svg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0 mt-2" align="end">
        <DropdownMenuLabel
          className="bg-[#0072E5] text-white p-3 cursor-pointer font-medium text-base rounded-r-sm rounded-l-sm rounded-b-none"
          onClick={() => router.push("/user/profile")}
        >
          Profile
        </DropdownMenuLabel>
        <DropdownMenuGroup className="p-2">
          <DropdownMenuItem
            className="py-3 cursor-pointer font-medium text-base"
            onClick={() => router.push("/user/coins")}
          >
            Coin
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 cursor-pointer font-medium text-base"
            onClick={() => router.push("/user/my-books")}
          >
            My Books
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 cursor-pointer font-medium text-base"
            onClick={() => router.push("/user/enquiries")}
          >
            Enquires
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer font-medium text-base">
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="py-3 cursor-pointer text-red-600 font-medium text-base"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
