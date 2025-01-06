/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { NotificationTypes } from "@/types/common-types";
import React from "react";
import NotificationSkeleton from "@/components/common/loaders/NotificationSkeleton";

export function NotificationPanel({
  notifications,
  onNotificationClick,
  loader,
}: {
  notifications: NotificationTypes[];
  // eslint-disable-next-line no-unused-vars
  onNotificationClick: (notification: NotificationTypes) => void;
  loader?: boolean;
}) {
  // Const unreadCount = notifications.filter((n) => n.read_at === null).length;

  return (
    <div className="bg-white rounded-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 border-b-2">Notifications</h2>
        {/* <Tabs defaultValue="all" className="w-full"> */}
        {/* <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 text-xl font-medium data-[state=active]:border-blue-500 rounded-none pb-2 px-4"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="data-[state=active]:border-b-2 text-xl font-medium data-[state=active]:border-blue-500 rounded-none pb-2 px-4 flex items-center gap-2"
            >
              Unread
              {unreadCount > 0 && (
                <Badge className="bg-[#FF851B] flex justify-center text-xs items-center hover:bg-[#FF851B] rounded-full max-w-6 max-h-6">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList> */}
        <ScrollArea className="h-[300px] overflow-y-auto">
          {/* <TabsContent value="all" className="mt-4"> */}
          <div className="space-y-4">
            {loader ? (
              Array.from({ length: 10 }).map((_, index) => (
                <NotificationSkeleton key={index} />
              ))
            ) : notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 items-center cursor-pointer`}
                  onClick={() => {
                    onNotificationClick(notification);
                  }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        notification.read_at === null
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <h3
                      className={` ${!notification.read_at ? "font-semibold text-gray-900" : "text-gray-500"} `}
                    >
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-500">{notification.body}</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <section
                  id="no-notification"
                  className="flex flex-col items-center justify-center"
                >
                  <Image
                    src="/svgs/no-notifications.svg"
                    alt="No notifications"
                    width={300}
                    height={400}
                    className="max-w-max"
                  />
                  <p className="text-xl font-semibold text-red-500">
                    No notifications found!
                  </p>
                </section>
              </>
            )}
          </div>
          {/* </TabsContent> */}
          {/* <TabsContent value="unread" className="mt-4">
              <div className="space-y-4">
                {loader ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <NotificationSkeleton key={index} />
                  ))
                ) : notifications && notifications.length > 0 ? (
                  notifications.filter(
                    (notification) => notification.read_at === null
                  ).length > 0 ? (
                    notifications
                      .filter((notification) => notification.read_at === null)
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className="flex gap-3 items-center cursor-pointer"
                          onClick={() => onNotificationClick(notification)}
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {notification.body}
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <section
                      id="no-notification"
                      className="flex flex-col items-center justify-center"
                    >
                      <Image
                        src="/svgs/no-notifications.svg"
                        alt="No notifications"
                        width={300}
                        height={400}
                        className="max-w-max"
                      />
                      <p className="text-xl font-semibold text-red-500">
                        No new notifications found!
                      </p>
                    </section>
                  )
                ) : (
                  <section
                    id="no-notification"
                    className="flex flex-col items-center justify-center"
                  >
                    <Image
                      src="/svgs/no-notifications.svg"
                      alt="No notifications"
                      width={300}
                      height={400}
                      className="max-w-max"
                    />
                    <p className="text-xl font-semibold text-red-500">
                      No notifications found!
                    </p>
                  </section>
                )}
              </div>
            </TabsContent> */}
        </ScrollArea>
        {/* </Tabs> */}
      </div>
    </div>
  );
}
