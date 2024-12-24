/* eslint-disable multiline-ternary */
"use client";
import {
  Search,
  Menu,
  Settings,
  User as LucideUser,
  Coins,
  BookCheckIcon,
  Library,
  Headset,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MdOutlineAttachEmail } from "react-icons/md";
import Image from "next/image";
import { ProfileDropdown } from "@/components/headerComponents/ProfileDropdown";
import { NotificationDropdown } from "@/components/headerComponents/NotificationDrawer";
import { useState } from "react";
import { SearchHeader } from "../homePageComponents/SearchHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session, User } from "next-auth";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomUser extends User {
  coins?: number;
}
interface CustomSession extends Session {
  accessToken?: string;
  user?: CustomUser;
}
export function Header() {
  const { data: session } = useSession() as { data: CustomSession };
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: "Profile", icon: LucideUser, path: "/user/profile" },
    { label: "Coins", icon: Coins, path: "/user/coins" },
    { label: "My Books", icon: BookCheckIcon, path: "/user/my-books" },
    { label: "All Books", icon: Library, path: "/filtered-books" },
    { label: "Enquiries", icon: Headset, path: "/user/enquiries" },
    {
      label: "Customer Support",
      icon: MdOutlineAttachEmail,
      path: "/user/customer-support",
    },
    { label: "Settings", icon: Settings, path: "/user/settings" },
  ];

  return (
    <header className="sticky max-sm:px-[15px] top-0 z-50 w-full border-b bg-background">
      {isSearching ? (
        <div className=" min-h-20 flex items-center justify-center">
          <SearchHeader onClose={() => setIsSearching(false)} />
        </div>
      ) : (
        <div className="w-full flex h-20 items-center justify-between max-w-[85rem] mx-auto">
          <div className=" cursor-pointer" onClick={() => router.push("/")}>
            <Image
              src="/svgs/app-logo.svg"
              alt="app-logo"
              width={250}
              height={250}
              className="max-w-36 max-h-36 md:min-w-60 md:min-h-60 "
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-between space-x-4">
              <Button
                variant="ghost"
                className="text-lg font-normal border border-[#D0CCCB] text-[#202124] rounded-[1000px] max-sm:hidden"
                onClick={() => {
                  localStorage.setItem("category", "All Books");
                  router.push("/filtered-books");
                }}
              >
                All Books
              </Button>
              {session && (
                <Badge className="bg-gradient-to-r h-9 px-4 py-2 text-xl font-medium from-[#FDD55E] to-[#FF7A09] hover:bg-gradient-to-r hover:from-[#FF7A09] hover:to-[#FDD55E] w-24 items-center gap-2 justify-center text-white rounded-[760px] hidden md:flex ">
                  <Image
                    src="/svgs/coin-badge-icon.svg"
                    alt="coin-icon"
                    width={100}
                    height={100}
                    className=" !max-h-8 !max-w-8 min-h-full "
                  />
                  <p className="flex shrink-0">{session?.user?.coins}</p>
                </Badge>
              )}
              <div className="flex items-center gap-6 max-sm:gap-3">
                <Button
                  variant="ghost"
                  className="p-2 sm:p-3 w-auto h-auto border border-[#D0CCCB] rounded-full max-sm:hidden"
                  onClick={() => setIsSearching(true)}
                >
                  <Search className="!h-4 !w-4 sm:!h-5 sm:!w-5" />
                </Button>

                {session && (
                  <Button
                    variant="ghost"
                    className="p-3 w-auto h-auto border border-[#D0CCCB] rounded-full max-sm:hidden"
                    onClick={() => router.push("/user/customer-support")}
                  >
                    <MdOutlineAttachEmail className="!h-5 !w-5" />
                  </Button>
                )}
                {!session && (
                  <>
                    <Button
                      variant="ghost"
                      className="p-2 max-w-16 max-h-8 sm:max-w-24 sm:max-h-10 border text-white text-xs sm:text-lg bg-[#FF7A09] flex-shrink-0"
                      onClick={() => router.push("/login")}
                    >
                      Login
                    </Button>
                    <Button
                      variant="ghost"
                      className="p-2 max-w-16 max-h-8 sm:max-w-24 sm:max-h-10 border text-white text-xs sm:text-lg bg-[#FF7A09] rounded-md flex-shrink-0"
                      onClick={() => router.push("/register")}
                    >
                      Register
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="p-3 w-8 h-8 sm:hidden"
                        >
                          <Menu className="!h-5 !w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-10 mr-5">
                        <DropdownMenuLabel onClick={() => setIsSearching(true)}>
                          Search
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel
                          onClick={() => router.push("/filtered-books")}
                        >
                          All Books
                        </DropdownMenuLabel>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
                {session && (
                  <>
                    {" "}
                    <NotificationDropdown />
                    <div className="hidden md:flex">
                      <ProfileDropdown />
                    </div>
                  </>
                )}
                <Sheet>
                  <SheetTrigger asChild>
                    {session && (
                      <Button variant="ghost" className="p-3 w-8 h-8 md:hidden">
                        <Menu className="!h-5 !w-5" />
                      </Button>
                    )}
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] sm:w-[400px] min-h-screen"
                  >
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                      <SheetDescription className="hidden"></SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col space-y-4 p-4">
                      {menuItems.map((item) => (
                        <Button
                          key={item.label}
                          variant="ghost"
                          className={`p-3 w-auto h-auto border rounded-full flex justify-start ${
                            pathname === item.path
                              ? "bg-[#FF7A09] text-white"
                              : "border-[#D0CCCB]"
                          }`}
                          onClick={() => router.push(item.path)}
                        >
                          <item.icon className="!h-5 !w-5 mr-2" />
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
