"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/axios";
import API_ROUTES from "@/lib/apiRoutes";
import { connectSupportSocket, getSupportSocket } from "@/lib/supportSocket";

export type AppChatUnreadRole = "admin" | "user";

export function useAppChatUnreadCount(appId: number | null, role: AppChatUnreadRole = "admin", suppressLive: boolean = false) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const joinedRef = useRef(false);
  const suppressRef = useRef(suppressLive);
  suppressRef.current = suppressLive;

  const fetchUnreadCount = useCallback(async () => {
    if (!appId) return;
    setLoading(true);
    try {
      const endpoint =
        role === "admin"
          ? `${API_ROUTES.APP_CHAT}/admin/unread/${appId}`
          : `${API_ROUTES.APP_CHAT}/unread/${appId}`;
      const response = await api.get(endpoint);
      setCount(response.data?.data?.count || 0);
    } catch (error) {
      console.error("Failed to fetch app chat unread count:", error);
    } finally {
      setLoading(false);
    }
  }, [appId, role]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Live socket updates: bump the count when the OTHER side sends a message for this app.
  // user role counts AGENT messages; admin role counts USER messages.
  useEffect(() => {
    if (!appId) return;

    let socket: ReturnType<typeof getSupportSocket> | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const ensureJoin = () => {
      if (!socket?.connected || joinedRef.current) return;
      socket.emit("app_chat:join", { appId });
      joinedRef.current = true;
    };

    const onConnect = () => {
      joinedRef.current = false;
      ensureJoin();
    };

    const onMessage = (data: { appId: number; senderType?: string }) => {
      if (data.appId !== appId) return;
      if (suppressRef.current) return;
      const isOtherSide = role === "user" ? data.senderType === "AGENT" : data.senderType === "USER";
      if (isOtherSide) {
        setCount((prev) => prev + 1);
      }
    };

    const onDisconnect = () => {
      joinedRef.current = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => {
        socket = connectSupportSocket();
        socket.on("connect", onConnect);
        socket.on("app_chat:message", onMessage);
        socket.on("disconnect", onDisconnect);
        ensureJoin();
      }, 1000);
    };

    const connect = () => {
      socket = connectSupportSocket();
      socket.on("connect", onConnect);
      socket.on("app_chat:message", onMessage);
      socket.on("disconnect", onDisconnect);
      ensureJoin();
    };

    connect();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socket) {
        socket.off("connect", onConnect);
        socket.off("app_chat:message", onMessage);
        socket.off("disconnect", onDisconnect);
      }
      joinedRef.current = false;
    };
  }, [appId, role]);

  const markRead = useCallback(async () => {
    if (!appId) return;
    try {
      await api.post(`${API_ROUTES.APP_CHAT}/read/${appId}`);
      setCount(0);
    } catch (error) {
      console.error("Failed to mark app chat as read:", error);
    }
  }, [appId]);

  const reset = useCallback(() => setCount(0), []);

  return { count, loading, refetch: fetchUnreadCount, reset, markRead };
}
