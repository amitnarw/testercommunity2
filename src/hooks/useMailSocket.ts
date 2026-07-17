"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api", "") || "http://localhost:5000";

export function useMailSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let socket: Socket | null = null;

    try {
      socket = io(SOCKET_URL, {
        path: "/socket.io",
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      socket.on("connect", () => {
        socket?.emit("join", { room: "admin:mail" });
      });

      socket.on("mail:new", () => {
        queryClient.invalidateQueries({ queryKey: ["useAdminMails"] });
        queryClient.invalidateQueries({ queryKey: ["useMailUnreadCount"] });
      });

      socket.on("mail:updated", () => {
        queryClient.invalidateQueries({ queryKey: ["useAdminMails"] });
        queryClient.invalidateQueries({ queryKey: ["useMailUnreadCount"] });
      });
    } catch (err) {
      console.error("Mail socket connection error:", err);
    }

    return () => {
      socket?.disconnect();
    };
  }, [queryClient]);
}
