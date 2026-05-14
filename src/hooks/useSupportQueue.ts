"use client";

import { useEffect, useState, useCallback } from "react";
import { connectSupportSocket } from "@/lib/supportSocket";

interface PendingChat {
  id: number;
  userId: string | null;
  userName: string;
  userEmail: string;
  userImage: string | null;
  createdAt: string;
  isEscalated: boolean;
  aiContext: string;
}

export function useSupportQueue() {
  const [queue, setQueue] = useState<PendingChat[]>([]);
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentOnline, setAgentOnline] = useState(false);

  const goOnline = useCallback(() => {
    const socket = connectSupportSocket();
    socket.emit("agent:online");
    setAgentOnline(true);
  }, []);

  const goOffline = useCallback(() => {
    const socket = connectSupportSocket();
    socket.emit("agent:offline");
    setAgentOnline(false);
  }, []);

  const takeChat = useCallback((chatId: number) => {
    const socket = connectSupportSocket();
    socket.emit("agent:take_chat", { chatId });
  }, []);

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

    const handleQueue = (data: PendingChat[]) => {
      setQueue(data);
      setLoading(false);
      setAgentOnline(true);
    };

    const handleActiveChats = (data: any[]) => {
      setActiveChats(data);
      setLoading(false);
      setAgentOnline(true);
    };

    const handleQueueUpdated = () => {
      socket.emit("agent:online");
    };

    const handleChatTaken = (data: { chatId: number }) => {
      setQueue((prev) => prev.filter((c) => c.id !== data.chatId));
    };

    const handleConnect = () => {
      socket.emit("agent:online");
    };

    socket.on("agent:queue", handleQueue);
    socket.on("agent:active_chats", handleActiveChats);
    socket.on("agent:queue_updated", handleQueueUpdated);
    socket.on("agent:chat_taken", handleChatTaken);
    socket.on("connect", handleConnect);

    if (socket.connected) {
      socket.emit("agent:online");
    }

    return () => {
      socket.off("agent:queue", handleQueue);
      socket.off("agent:active_chats", handleActiveChats);
      socket.off("agent:queue_updated", handleQueueUpdated);
      socket.off("agent:chat_taken", handleChatTaken);
      socket.off("connect", handleConnect);
    };
  }, []);

  return {
    queue,
    activeChats,
    loading,
    agentOnline,
    goOnline,
    goOffline,
    takeChat,
    sendMessage,
    closeChat,
  };
}
