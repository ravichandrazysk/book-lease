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
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/AxiosConfig";
import { isAxiosError } from "axios";
import { NotificationTypes } from "@/types/common-types";
import { NotificationDetails } from "../modals/NotificationDetails";
import { toast } from "@/hooks/use-toast";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<NotificationTypes[]>([]);
  const [readNotification, setReadNotification] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notificationReadStatus, setNoticationReadStatus] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [notificationDetails, setNotificationDetails] =
    useState<NotificationTypes>({
      id: 0,
      type: "",
      title: "",
      body: "",
      read_at: "",
      active: false,
    });

  const handleNotificationRead = async (notificationId: number) => {
    try {
      const response = await axiosInstance.patch(
        `/notifications/${notificationId}`
      );
      if (response.status === 200)
        setNoticationReadStatus(!notificationReadStatus);
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
  }, [notificationReadStatus]);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative p-2 md:p-3 w-auto h-auto border border-[#D0CCCB] rounded-full"
          >
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
            <span className="absolute top-0 right-0 h-3 w-3 md:max-w-max md:max-h-max p-2.5 rounded-full bg-[#FF851B] text-[8px] md:text-[10px] font-medium text-white flex items-center justify-center">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[375px] md:w-[500px] mt-2"
          align="end"
        >
          <NotificationPanel
            notifications={notifications}
            onNotificationClick={setNotificationDetails}
            onNotificationRead={setReadNotification}
            loader={loading}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <NotificationDetails
        open={readNotification}
        onOpenChange={setReadNotification}
        notificationDetails={notificationDetails}
        onNotificatoinClose={handleNotificationRead}
      />
    </>
  );
}
