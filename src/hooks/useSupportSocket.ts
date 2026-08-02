"use client";

import { useEffect, useState } from "react";
import { getSupportSocket, connectSupportSocket, disconnectSupportSocket } from "@/lib/supportSocket";

interface UseSupportSocketProps {
  enabled?: boolean;
}

export function useSupportSocket({ enabled = true }: UseSupportSocketProps = {}) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setConnected(false);
      return;
    }

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
  }, [enabled]);

  return { connected };
}
