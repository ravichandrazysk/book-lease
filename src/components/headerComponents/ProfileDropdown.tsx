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
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { Session } from "next-auth";

interface CustomUser extends User {
  coins?: number;
  profile_photo?: string | null;
}
interface CustomSession extends Session {
  accessToken?: string;
  user?: CustomUser;
}
export function ProfileDropdown() {
  const { data: session } = useSession() as { data: CustomSession };
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 md:h-10 md:w-10 cursor-pointer border-2">
          <AvatarImage
            src={
              session?.user?.profile_photo
                ? session.user.profile_photo
                : "/svgs/profile-img.svg"
            }
            alt="User"
          />
          <AvatarFallback>&#9888;</AvatarFallback>
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
