"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  description: string;
  isUnread: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "The Picy Mouse Story",
    description:
      "A user wants to lease The Great Gatsby. Review their request now.",
    isUnread: true,
  },
  {
    id: "2",
    title: "Request Accepted",
    description:
      "Your lease request for The Catcher in the Rye has been approved! Contact the owner.",
    isUnread: true,
  },
  {
    id: "3",
    title: "Request Declined",
    description:
      "The owner declined your request for 1984. Browse similar listings.",
    isUnread: true,
  },
  {
    id: "4",
    title: "New Query",
    description: "New query on Moby Dick: 'Can you confirm its condition?'",
    isUnread: true,
  },
  {
    id: "5",
    title: "The Picy Mouse Story",
    description:
      "A user wants to lease The Great Gatsby. Review their request now.",
    isUnread: false,
  },
];

export function NotificationPanel() {
  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <div className="bg-white rounded-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Notification</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none">
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
                <Badge className="bg-[#FF851B] flex justify-center text-md items-center hover:bg-[#FF851B] rounded-full w-6 h-6">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[300px] overflow-y-auto">
            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex gap-3 items-center"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          notification.isUnread ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="unread" className="mt-4">
              <div className="space-y-4">
                {notifications
                  .filter((notification) => notification.isUnread)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="flex gap-3 items-center"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
