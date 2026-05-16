"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  const initRef = useRef(false);

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

  const fetchInitialState = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || ""}/api/admin/support/stats`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data?.data) {
        setAgentOnline(data.data.onlineAgents > 0);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const socket = connectSupportSocket();

    const handleQueue = (data: PendingChat[]) => {
      setQueue(data);
      setLoading(false);
    };

    const handleActiveChats = (data: any[]) => {
      setActiveChats(data);
      setLoading(false);
    };

    const handleQueueUpdated = () => {
      const s = connectSupportSocket();
      s.emit("agent:online");
    };

    const handleChatTaken = (data: { chatId: number }) => {
      setQueue((prev) => prev.filter((c) => c.id !== data.chatId));
    };

    const handleConnect = async () => {
      fetchInitialState();
    };

    socket.on("agent:queue", handleQueue);
    socket.on("agent:active_chats", handleActiveChats);
    socket.on("agent:queue_updated", handleQueueUpdated);
    socket.on("agent:chat_taken", handleChatTaken);
    socket.on("connect", handleConnect);

    if (socket.connected) {
      fetchInitialState();
    }

    return () => {
      socket.off("agent:queue", handleQueue);
      socket.off("agent:active_chats", handleActiveChats);
      socket.off("agent:queue_updated", handleQueueUpdated);
      socket.off("agent:chat_taken", handleChatTaken);
      socket.off("connect", handleConnect);
    };
  }, [fetchInitialState]);

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
