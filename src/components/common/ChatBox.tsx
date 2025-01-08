/* eslint-disable no-nested-ternary */
/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
"use client";

import React, { useEffect, useState } from "react";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { axiosInstance } from "@/utils/AxiosConfig";
import { ChatBoxProps, Message } from "@/types/common-types";
import { toast } from "@/hooks/use-toast";

const ChatBox = ({ owner, ticketId, isOwner }: ChatBoxProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const getMessages = async (ticketId: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/tickets/${ticketId}/conversations`
      );
      if (response.status === 200) {
        setMessages(response.data.conversations);
        setLoading(false);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      setLoading(false);
      // eslint-disable-next-line no-console
      console.log("Something went wrong", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!ticketId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ticket ID not found",
      });
      return;
    }
    getMessages(ticketId);
  }, [ticketId]);

  const sendMessage = async () => {
    if (currentMessage.trim() === "") return;
    if (!ticketId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ticket ID not found",
      });
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/tickets/${ticketId}/conversations`,
        { message: currentMessage }
      );

      if (response.status === 201) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: response.data.conversation.id,
            user: response.data.conversation.user,
            role: response.data.conversation.role,
            message: response.data.conversation.message,
            // eslint-disable-next-line camelcase
            created_at: response.data.conversation.created_at,
          },
        ]);
        setCurrentMessage("");
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to send message:", error);
    }
  };

  return (
    <section className="h-full w-full">
      <ScrollArea className="h-[85%] overflow-y-auto py-4">
        <ChatMessageList>
          {loading ? (
            <div className="flex flex-col space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? "justify-end" : ""} space-x-4`}
                >
                  {index % 2 === 0 ? (
                    <>
                      <Skeleton className="h-12 w-[180px] sm:w-[250px]" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </>
                  ) : (
                    <>
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-12  w-[180px] sm:w-[250px]" />
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            messages?.map((message) => {
              const variant = isOwner
                ? message?.role === "Owner"
                  ? "sent"
                  : "received"
                : message?.role === "Requester"
                  ? "sent"
                  : "received";
              return (
                <ChatBubble
                  key={message?.id}
                  variant={variant}
                  className=" max-w-full sm:max-w-[90%]"
                >
                  <ChatBubbleAvatar
                    fallback={
                      variant === "sent"
                        ? "ME"
                        : owner?.slice(0, 2).toUpperCase() || "OW"
                    }
                  />
                  <ChatBubbleMessage
                    className={`rounded-t-3xl ${variant === "sent" ? "bg-[#FF7A09] rounded-bl-3xl" : "rounded-br-3xl"}`}
                  >
                    {message?.message}
                    <div className="text-xs mt-2 text-right">
                      {message?.created_at.split(" ")[0]}
                    </div>
                  </ChatBubbleMessage>
                </ChatBubble>
              );
            })
          )}
        </ChatMessageList>
      </ScrollArea>
      <div className="flex items-center justify-between gap-2">
        <ChatInput
          className="border-gray-300 border-2 rounded-2xl"
          placeholder="Type a message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <Button
          type="submit"
          size="icon"
          disabled={currentMessage.trim() === ""}
          className="bg-[#FF7A09] hover:bg-[#FF7A09]"
          onClick={sendMessage}
        >
          <Send className="size-5" />
        </Button>
      </div>
    </section>
  );
};

export default ChatBox;
