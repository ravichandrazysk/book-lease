"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface NotificationTypes {
  id: number;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  active: boolean;
}

export function NotificationPanel({
  notifications,
  // eslint-disable-next-line object-curly-newline
}: {
  notifications: NotificationTypes[];
}) {
  const router = useRouter();
  const unreadCount = notifications.filter((n) => n.read_at === null).length;

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
                <Badge className="bg-[#FF851B] flex justify-center text-xs items-center hover:bg-[#FF851B] rounded-full max-w-6 max-h-6">
                  {unreadCount > 99 ? "99+" : unreadCount}
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
                    className={`flex gap-3 items-center ${notification.read_at ? "" : "cursor-pointer"}`}
                    onClick={() => {
                      if (!notification.read_at)
                        router.push("/user/received-requests");
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
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {notification.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="unread" className="mt-4">
              <div className="space-y-4">
                {notifications
                  .filter((notification) => notification.read_at === null)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="flex gap-3 items-center cursor-pointer"
                      onClick={() => router.push("/user/received-requests")}
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
                  ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
