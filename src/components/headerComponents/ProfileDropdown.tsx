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
import GlobalContext from "@/contexts/GlobalContext";
import { useContext } from "react";

export function ProfileDropdown() {
  const { profileDetails } = useContext(GlobalContext);
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 md:h-10 md:w-10 cursor-pointer border-2">
          <AvatarImage
            src={
              profileDetails?.profile_photo
                ? profileDetails.profile_photo
                : "/svgs/profile-img.svg"
            }
            alt="User"
          />
          <AvatarFallback>&#9888;</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0 mt-2" align="end">
        <DropdownMenuLabel
          className="bg-[#FF851B] text-white p-3 cursor-pointer font-medium text-base rounded-r-sm rounded-l-sm rounded-b-none"
          onClick={() => router.push("/user/profile")}
        >
          Profile
        </DropdownMenuLabel>
        <DropdownMenuGroup className="p-2">
          <DropdownMenuItem
            className="py-3 cursor-pointer font-medium text-base"
            onClick={() => router.push("/user/coins")}
          >
            Coins
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3 cursor-pointer font-medium text-base"
            onClick={() => router.push("/user/my-books")}
          >
            My Books
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
