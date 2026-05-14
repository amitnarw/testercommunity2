"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let listeners: Array<() => void> = [];

export function getSupportSocket(): Socket {
  if (!socket) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const nsUrl = baseUrl ? `${baseUrl.replace(/\/+$/, "")}/support` : "/support";
    socket = io(nsUrl, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });
  }
  return socket;
}

export function connectSupportSocket(): Socket {
  const s = getSupportSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSupportSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function onSocketReady(cb: () => void): () => void {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

if (typeof window !== "undefined") {
  const s = getSupportSocket();

  s.on("connect", () => {
    console.log(`[SocketClient] Connected to ${process.env.NEXT_PUBLIC_BACKEND_URL || "same origin"}`);
    listeners.forEach((l) => l());
  });

  s.on("disconnect", (reason) => {
    console.log(`[SocketClient] Disconnected: ${reason}`);
  });

  s.on("connect_error", (err) => {
    console.error(`[SocketClient] Connection error:`, err.message);
  });
}

export function getSocketStatus(): "connected" | "connecting" | "disconnected" {
  if (!socket) return "disconnected";
  if (socket.connected) return "connected";
  if (socket.active) return "connecting";
  return "disconnected";
}
