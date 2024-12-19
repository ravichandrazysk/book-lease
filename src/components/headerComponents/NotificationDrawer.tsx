"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationPanel } from "@/components/headerComponents/NotificationPanel";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/AxiosConfig";
import { isAxiosError } from "axios";

interface NotificationTypes {
  id: number;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  active: boolean;
}
export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<NotificationTypes[]>([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get("/notifications");
        if (response.status === 200) setNotifications(response.data.data);
        // eslint-disable-next-line brace-style
      } catch (error) {
        if (
          isAxiosError(error) &&
          error.status &&
          error.status >= 400 &&
          error.status < 500 &&
          error.response &&
          error.response.data
        )
          // eslint-disable-next-line no-console
          console.log(error.response.data.message);
        // eslint-disable-next-line no-console
        else console.log("Something went wrong", error);
      }
    };
    fetchNotifications();
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-2 md:p-3 w-auto h-auto border border-[#D0CCCB] rounded-full"
        >
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          <span className="absolute top-0 right-0 h-3 w-3 md:max-w-max md:max-h-max p-2.5 rounded-full bg-[#FF851B] text-[8px] md:text-[10px] font-medium text-white flex items-center justify-center">
            {notifications && notifications.length > 99
              ? "99+"
              : notifications.length}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[375px] md:w-[500px] mt-2" align="end">
        <NotificationPanel notifications={notifications} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
