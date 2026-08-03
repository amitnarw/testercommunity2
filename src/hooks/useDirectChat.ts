"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/axios";
import API_ROUTES from "@/lib/apiRoutes";
import { connectSupportSocket, getSupportSocket } from "@/lib/supportSocket";

export interface DirectChatMessage {
  id: number;
  senderId: string | null;
  senderType: "USER" | "AGENT" | "AI" | "SYSTEM";
  messageType: string;
  message: string;
  createdAt: string;
  senderUser?: { id: string; name: string; image: string | null } | null;
}

export interface DirectChatData {
  id: number;
  status: string;
  subject: string | null;
  messages: DirectChatMessage[];
  user?: { id: string; name: string; email: string; image: string | null } | null;
}

const WELCOME_MESSAGE: DirectChatMessage = {
  id: -9999,
  senderId: null,
  senderType: "AGENT",
  messageType: "TEXT",
  message: "Hello! I'm the Testing Manager. How can I help you?",
  createdAt: new Date().toISOString(),
};

let tempIdCounter = 0;
function nextTempId(): number {
  return -(++tempIdCounter);
}

export function useDirectChat(
  dashboardAndHubId: number | null,
  enabled: boolean = false,
  selfSenderType: "USER" | "AGENT" = "USER",
) {
  const [chat, setChat] = useState<DirectChatData | null>(null);
  const [messages, setMessages] = useState<DirectChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentTyping, setAgentTyping] = useState(false);
  const socketInitialized = useRef(false);
  const chatRef = useRef<DirectChatData | null>(null);
  const pendingSentRef = useRef<number[]>([]);

  useEffect(() => {
    chatRef.current = chat;
  }, [chat]);

  const peekChat = useCallback(async () => {
    if (!dashboardAndHubId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${API_ROUTES.APP_CHAT}/peek/${dashboardAndHubId}`);
      const conversation = response.data?.data?.conversation || null;
      setChat(conversation);
      setMessages(
        (conversation?.messages || []).map((raw: {
          id: number;
          senderId?: string | null;
          senderType?: string;
          messageType?: string;
          message?: string;
          content?: string;
          createdAt: string;
          senderUser?: DirectChatMessage["senderUser"];
        }) => ({
          id: raw.id,
          senderId: raw.senderId ?? null,
          senderType: (raw.senderType ?? "USER") as DirectChatMessage["senderType"],
          messageType: raw.messageType ?? "TEXT",
          message: raw.message ?? raw.content ?? "",
          createdAt: raw.createdAt,
          senderUser: raw.senderUser ?? null,
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [dashboardAndHubId]);

  useEffect(() => {
    if (enabled) {
      peekChat();
      socketInitialized.current = false;
      pendingSentRef.current = [];
    } else {
      setChat(null);
      setMessages([]);
      setError(null);
      socketInitialized.current = false;
      pendingSentRef.current = [];
    }
  }, [enabled, peekChat]);

  const displayMessages = messages.length > 0 ? messages : [WELCOME_MESSAGE];

  useEffect(() => {
    if (!enabled || socketInitialized.current) return;
    socketInitialized.current = true;

    const socket = connectSupportSocket();

    const ensureChat = (conversationId: number) => {
      if (!chatRef.current) {
        setChat({ id: conversationId, status: "OPEN", subject: null, messages: [] } as DirectChatData);
      }
    };

    const onJoined = (data: { conversationId: number | null }) => {
      if (data?.conversationId) ensureChat(data.conversationId);
    };

    const onMessage = (data: {
      id: number;
      appId: number;
      conversationId?: number | null;
      senderId?: string | null;
      senderType?: string;
      message: string;
      createdAt: string;
    }) => {
      if (data.appId === dashboardAndHubId) {
        if (data.conversationId) ensureChat(data.conversationId);

        setMessages((prev) => {
          // If there's a pending optimistic message, replace it with the echo
          if (pendingSentRef.current.length > 0) {
            const pendingId = pendingSentRef.current[0];
            const idx = prev.findIndex((m) => m.id === pendingId);
            if (idx !== -1) {
              pendingSentRef.current.shift();
              const updated = [...prev];
              updated[idx] = {
                id: data.id,
                senderId: data.senderId || null,
                senderType: selfSenderType,
                messageType: "TEXT",
                message: data.message,
                createdAt: data.createdAt,
              };
              return updated;
            }
          }
          // Otherwise append (message from the other side)
          if (prev.some((m) => m.id === data.id)) return prev;
          return [
            ...prev,
            {
              id: data.id,
              senderId: data.senderId || null,
              senderType: (data.senderType as DirectChatMessage["senderType"]) || (selfSenderType === "USER" ? "AGENT" : "USER"),
              messageType: "TEXT",
              message: data.message,
              createdAt: data.createdAt,
            },
          ];
        });
      }
    };

    const onTyping = (data: { appId: number }) => {
      if (data.appId === dashboardAndHubId) {
        setAgentTyping(true);
        setTimeout(() => setAgentTyping(false), 3000);
      }
    };

    const onStopTyping = (data: { appId: number }) => {
      if (data.appId === dashboardAndHubId) {
        setAgentTyping(false);
      }
    };

    socket.on("app_chat:joined", onJoined);
    socket.on("app_chat:message", onMessage);
    socket.on("app_chat:typing", onTyping);
    socket.on("app_chat:stop_typing", onStopTyping);
    socket.emit("app_chat:join", { appId: dashboardAndHubId });

    return () => {
      socket.off("app_chat:joined", onJoined);
      socket.off("app_chat:message", onMessage);
      socket.off("app_chat:typing", onTyping);
      socket.off("app_chat:stop_typing", onStopTyping);
      socketInitialized.current = false;
    };
  }, [dashboardAndHubId, enabled, selfSenderType]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || sending) return;
      setSending(true);
      const tempId = nextTempId();
      const optimistic: DirectChatMessage = {
        id: tempId,
        senderId: null,
        senderType: selfSenderType,
        messageType: "TEXT",
        message: text,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);
      pendingSentRef.current.push(tempId);
      try {
        const socket = getSupportSocket();
        if (socket.connected) {
          socket.emit("app_chat:send_message", {
            appId: dashboardAndHubId,
            message: text,
          });
        } else {
          socket.once("connect", () => {
            socket.emit("app_chat:send_message", {
              appId: dashboardAndHubId,
              message: text,
            });
          });
          connectSupportSocket();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setSending(false);
      }
    },
    [sending, dashboardAndHubId, selfSenderType],
  );

  const refresh = useCallback(() => {
    peekChat();
  }, [peekChat]);

  const emitTyping = useCallback(() => {
    if (!dashboardAndHubId) return;
    try {
      const socket = getSupportSocket();
      if (socket.connected) {
        socket.emit("app_chat:typing", { appId: dashboardAndHubId });
      }
    } catch {
      // ignore typing emit failures
    }
  }, [dashboardAndHubId]);

  const emitStopTyping = useCallback(() => {
    if (!dashboardAndHubId) return;
    try {
      const socket = getSupportSocket();
      if (socket.connected) {
        socket.emit("app_chat:stop_typing", { appId: dashboardAndHubId });
      }
    } catch {
      // ignore typing emit failures
    }
  }, [dashboardAndHubId]);

  return {
    chat,
    messages: displayMessages,
    loading,
    sending,
    error,
    agentTyping,
    sendMessage,
    refresh,
    emitTyping,
    emitStopTyping,
  };
}
