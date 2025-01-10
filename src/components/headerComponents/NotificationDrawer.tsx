/* eslint-disable brace-style */
/* eslint-disable camelcase */
"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationPanel } from "@/components/headerComponents/NotificationPanel";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "@/utils/AxiosConfig";
import { isAxiosError } from "axios";
import { NotificationTypes } from "@/types/common-types";
import { toast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import GlobalContext from "@/contexts/GlobalContext";

export function NotificationDropdown() {
  const { setChangeProfile, refreshNotifications } = useContext(GlobalContext);
  const [notifications, setNotifications] = useState<NotificationTypes[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notificationReadStatus, setNoticationReadStatus] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNotificationRead = async (notificationId: number) => {
    try {
      const response = await axiosInstance.patch(
        `/notifications/${notificationId}`
      );
      if (response.status === 200)
        setNoticationReadStatus(!notificationReadStatus);
      setChangeProfile((prev) => !prev);
      // eslint-disable-next-line brace-style
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.status &&
        error.status >= 400 &&
        error.status < 500 &&
        error.response
      )
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
      else
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong",
        });
    }
  };

  const handleNotificationClick = async (notification: NotificationTypes) => {
    try {
      await handleNotificationRead(notification.id);
      sessionStorage.setItem("ticketId", notification.ticket_number);
      sessionStorage.setItem("ownerName", notification.owner_name);
      sessionStorage.setItem("itemId", notification.model_id.toString());
      sessionStorage.setItem("requestStatus", notification.status);
      if (
        notification.type === "book_request" &&
        pathname === "/user/received-requests"
      )
        window.dispatchEvent(new Event("storage"));
      else if (
        notification.type === "book_request_response" &&
        pathname === "/user/my-requests"
      )
        window.dispatchEvent(new Event("storage"));

      if (notification.type === "book_request")
        router.push(`/user/received-requests`);
      else router.push(`/user/my-requests`);
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.status &&
        error.status >= 400 &&
        error.status < 500 &&
        error.response
      )
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
      else
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong",
        });
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/notifications");
        if (response.status === 200) {
          setNotifications(response.data.data);
          const count = response.data.data.filter(
            (notification: NotificationTypes) => notification.read_at === null
          ).length;
          setNotificationCount(count);
          setLoading(false);
        }
        // eslint-disable-next-line brace-style
      } catch (error) {
        setLoading(false);
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
  }, [notificationReadStatus, refreshNotifications]);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative p-2 md:p-3 w-auto h-auto border border-[#D0CCCB] rounded-full"
          >
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 md:max-w-max md:max-h-max p-2.5 rounded-full bg-[#FF851B] text-[8px] md:text-[10px] font-medium text-white flex items-center justify-center">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-xs md:max-w-sm mt-2" align="end">
          <NotificationPanel
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            loader={loading}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
