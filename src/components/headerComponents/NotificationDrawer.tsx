"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationPanel } from "@/components/headerComponents/NotificationPanel";

export function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-2 md:p-3 w-auto h-auto border border-[#D0CCCB] rounded-full"
        >
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          <span className="absolute top-0 right-0 h-3 w-3 md:h-4 md:w-4 rounded-full bg-[#FF851B] text-[8px] md:text-[10px] font-medium text-white flex items-center justify-center">
            2
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[375px] md:w-[500px] mt-2" align="end">
        <NotificationPanel />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
