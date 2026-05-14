"use client";

import { useEffect, useState, useCallback } from "react";
import { connectSupportSocket } from "@/lib/supportSocket";

interface ChatMessage {
  id: number;
  senderType: "USER" | "AGENT";
  senderName: string;
  message: string;
  isAi?: boolean;
  createdAt: string;
}

interface ActiveChat {
  id: number;
  userId: string | null;
  userName: string;
  userEmail: string;
  userImage: string | null;
  messages: ChatMessage[];
  createdAt: string;
}

export function useActiveChats() {
  const [chats, setChats] = useState<ActiveChat[]>([]);

  const sendMessage = useCallback((chatId: number, message: string) => {
    const socket = connectSupportSocket();
    socket.emit("agent:send_message", { chatId, message });
  }, []);

  const closeChat = useCallback((chatId: number) => {
    const socket = connectSupportSocket();
    socket.emit("agent:close_chat", { chatId });
  }, []);

  useEffect(() => {
    const socket = connectSupportSocket();

    const handleActiveChats = (data: ActiveChat[]) => {
      setChats(data);
    };

    const handleChatMessage = (data: { chatId: number } & ChatMessage) => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === data.chatId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: data.id,
                  senderType: data.senderType,
                  senderName: data.senderName,
                  message: data.message,
                  createdAt: data.createdAt,
                },
              ],
            };
          }
          return chat;
        })
      );
    };

    const handleChatClosed = (data: { chatId: number; reason: string }) => {
      setChats((prev) => prev.filter((c) => c.id !== data.chatId));
    };

    socket.on("agent:active_chats", handleActiveChats);
    socket.on("chat:message", handleChatMessage);
    socket.on("chat:closed", handleChatClosed);

    return () => {
      socket.off("agent:active_chats", handleActiveChats);
      socket.off("chat:message", handleChatMessage);
      socket.off("chat:closed", handleChatClosed);
    };
  }, []);

  return { chats, sendMessage, closeChat };
}
