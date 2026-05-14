"use client";

import { useEffect, useState } from "react";
import { getSupportSocket, connectSupportSocket, disconnectSupportSocket } from "@/lib/supportSocket";

export function useSupportSocket() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = connectSupportSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      setConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return { connected };
}
