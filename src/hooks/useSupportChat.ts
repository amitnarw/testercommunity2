"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import API_ROUTES from "@/lib/apiRoutes";
import api from "@/lib/axios";
import { connectSupportSocket, disconnectSupportSocket, getSupportSocket } from "@/lib/supportSocket";
import { authClient } from "@/lib/auth-client";

export type ChatMode = "AI" | "WAITING" | "HUMAN" | "OFFLINE_OPTIONS" | "CHECKING" | "RESOLVED";

export interface SupportChatAI {
  messages: any[];
  status: string;
  setMessages: (msgs: any[] | ((prev: any[]) => any[])) => void;
  sendMessage: (msg: any) => void;
  error?: Error | undefined;
}

export function useSupportChat(chat: SupportChatAI) {
  const { messages, status, setMessages, sendMessage, error: aiError } = chat;
  const isLoading = status === "streaming" || status === "submitted";

  const [chatMode, setChatMode] = useState<ChatMode>("AI");
  const [queuePosition, setQueuePosition] = useState(0);
  const [agentName, setAgentName] = useState("");
  const [humanMessages, setHumanMessages] = useState<any[]>([]);
  const [humanChatId, setHumanChatId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [agentTyping, setAgentTyping] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [agentsOnline, setAgentsOnline] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [userChoseAlex, setUserChoseAlex] = useState(false);
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false);
  const [isWaitingForGreeting, setIsWaitingForGreeting] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  const { data: session } = authClient.useSession();

  const requestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetingScheduledRef = useRef(false);
  const greetingShownRef = useRef(false);
  const lastTypingEmitRef = useRef(0);
  const socketInitialized = useRef(false);

  // -- Error helpers --
  const clearError = useCallback(() => {
    setErrorMessage(null);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  }, []);

  const showError = useCallback((msg: string) => {
    setErrorMessage(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setErrorMessage(null), 10000);
  }, []);

  // -- AI message sending --
  const sendAiMessage = useCallback((text: string) => {
    if (greetingTimeoutRef.current) {
      clearTimeout(greetingTimeoutRef.current);
      greetingTimeoutRef.current = null;
      greetingScheduledRef.current = false;
      setIsWaitingForGreeting(false);
    }
    if (sendMessage) sendMessage({ text });
  }, [sendMessage]);

  // -- Sync displayed messages --
  useEffect(() => {
    setDisplayedMessages(messages);
  }, [messages]);

  // -- transfer_to_human tool detection --
  useEffect(() => {
    const transferTool = messages.find((m: any) =>
      m.toolInvocations?.some((t: any) => t.toolName === "transfer_to_human" && t.state === "result")
    );
    if (transferTool && chatMode === "AI") {
      const context = messages
        .filter((m: any) => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map((m: any) => {
          const text = m.content || (m.parts || [])
            .filter((p: any) => p.type === "text")
            .map((p: any) => p.text)
            .join("\n");
          return { role: m.role, content: text };
        });
      const s = connectSupportSocket();
      s.emit("user:request_human", { context });
      setChatMode("WAITING");
    }
  }, [messages, chatMode]);

  // -- Greeting on first open --
  useEffect(() => {
    if (isOpen && messages.length === 0 && !greetingScheduledRef.current && !greetingShownRef.current) {
      greetingScheduledRef.current = true;
      greetingShownRef.current = true;
      setIsWaitingForGreeting(true);
      greetingTimeoutRef.current = setTimeout(() => {
        setMessages((prev: any[]) => {
          if (prev.some((m: any) => m.id === "greeting")) return prev;
          return [...prev, {
            id: "greeting",
            role: "assistant",
            content: "Hello! I'm Alex from the inTesters support team. How can I help you today?"
          }];
        });
        setIsWaitingForGreeting(false);
        greetingScheduledRef.current = false;
        greetingTimeoutRef.current = null;
      }, 1500);
    }
    return () => {
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current);
        greetingTimeoutRef.current = null;
      }
    };
  }, [isOpen, messages.length, setMessages]);

  // -- open-alex-chat event --
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-alex-chat", handleOpenChat);
    return () => window.removeEventListener("open-alex-chat", handleOpenChat);
  }, []);

  // -- Socket.IO integration --
  useEffect(() => {
    if (socketInitialized.current || !session) return;
    socketInitialized.current = true;

    const s = getSupportSocket();

    // Store handler references so cleanup only removes our own handlers
    // (not other components' handlers on the shared singleton socket)
    const on = <T extends (...args: any[]) => void>(event: string, handler: T): T => {
      s.on(event, handler);
      return handler;
    };

    const h = {
      connect: on("connect", () => {
        clearError();
        s.emit("user:rejoin");
      }),
      connect_error: on("connect_error", (err: any) => {
        if (s.connected) return;
        if (err.message.includes("Authentication required")) {
          showError("Login required. Please sign in to use live support.");
        }
      }),
      chat_requested: on("chat:requested", (data: { chatId: number; position: number }) => {
        if (requestTimeoutRef.current) {
          clearTimeout(requestTimeoutRef.current);
          requestTimeoutRef.current = null;
        }
        setHumanChatId(data.chatId);
        setQueuePosition(data.position);
        setChatMode("WAITING");
        clearError();
      }),
      chat_fallback_to_ai: on("chat:fallback_to_ai", (data: { message: string; chatId: number }) => {
        if (requestTimeoutRef.current) {
          clearTimeout(requestTimeoutRef.current);
          requestTimeoutRef.current = null;
        }
        setHumanChatId(data.chatId);
        setMessages((prev: any) => [...prev, {
          id: "fallback-" + Date.now(),
          role: "assistant",
          content: data.message,
        }]);
        clearError();
      }),
      chat_unavailable: on("chat:unavailable", (data: { reason?: string }) => {
        const msg = data?.reason || "No agents are available right now. Alex can help!";
        setMessages((prev: any) => [...prev, {
          id: "fallback-" + Date.now(),
          role: "assistant",
          content: msg + " A human agent will review your conversation when they come online.",
        }]);
        clearError();
      }),
      chat_assigned: on("chat:assigned", (data: { chatId: number; agentName: string }) => {
        clearError();
        setHumanChatId(data.chatId);
        setAgentName(data.agentName);
        setChatMode("HUMAN");
      }),
      chat_message: on("chat:message", (data: any) => {
        setHumanMessages((prev) => {
          if (prev.some((m) => m.id === data.id)) return prev;
          const filtered = prev.filter(
            (m) => !(m._optimistic && m.senderType === "USER" && m.message === data.message)
          );
          return [...filtered, data];
        });
      }),
      chat_closed: on("chat:closed", (data: { chatId: number; reason?: string }) => {
        const reason = data?.reason || "";
        const isResolved = reason === "Resolved" || reason === "Resolved by support agent";
        const isAgentGone = reason === "Agent disconnected" || reason === "Agent went offline";

        setCloseReason(reason);
        setHumanMessages((prev) => [...prev, {
          id: "closed",
          senderType: "SYSTEM",
          senderName: "System",
          message: isResolved
            ? "Your chat has been resolved. Thank you for contacting support!"
            : isAgentGone
            ? "The support agent is no longer available. You can submit a ticket or chat with Alex."
            : "This chat has been closed.",
          createdAt: new Date().toISOString(),
        }]);
        setHumanChatId(null);
        setAgentName("");
        setAgentTyping(false);
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setChatMode(isResolved ? "RESOLVED" : "OFFLINE_OPTIONS");
      }),
      chat_error: on("chat:error", (data: { message?: string }) => {
        showError(data?.message || "Something went wrong. Please try again.");
      }),
      agent_typing: on("agent:typing", () => {
        setAgentTyping(true);
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => setAgentTyping(false), 3000);
      }),
      agent_stop_typing: on("agent:stop_typing", () => {
        setAgentTyping(false);
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current);
          typingTimerRef.current = null;
        }
      }),
      chat_position_updated: on("chat:position_updated", (data: { position: number }) => {
        setQueuePosition(data.position);
      }),
      agent_status_changed: on("agent:status_changed", (data?: { online?: boolean }) => {
        if (data && typeof data.online === "boolean") {
          setAgentsOnline(data.online);
        } else {
          api.get(API_ROUTES.SUPPORT + "/agent-status")
            .then((r) => {
              setAgentsOnline(r?.data?.data?.online || false);
            })
            .catch(() => setAgentsOnline(false));
        }
      }),
    };

    return () => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
        errorTimerRef.current = null;
      }
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      // Only remove OUR specific handlers — others on the shared socket are untouched
      s.off("connect", h.connect);
      s.off("connect_error", h.connect_error);
      s.off("chat:requested", h.chat_requested);
      s.off("chat:fallback_to_ai", h.chat_fallback_to_ai);
      s.off("chat:unavailable", h.chat_unavailable);
      s.off("chat:assigned", h.chat_assigned);
      s.off("chat:message", h.chat_message);
      s.off("chat:closed", h.chat_closed);
      s.off("chat:error", h.chat_error);
      s.off("agent:typing", h.agent_typing);
      s.off("agent:stop_typing", h.agent_stop_typing);
      s.off("chat:position_updated", h.chat_position_updated);
      s.off("agent:status_changed", h.agent_status_changed);
      socketInitialized.current = false;
    };
  }, [session, clearError, showError, setMessages]);

  // -- Disconnect socket on session loss --
  useEffect(() => {
    if (!session) {
      disconnectSupportSocket();
      socketInitialized.current = false;
    }
  }, [session]);

  // -- Request human chat --
  const requestHumanChat = useCallback(() => {
    clearError();
    const s = connectSupportSocket();
    if (s.connected) {
      s.emit("user:request_human", {});
      requestTimeoutRef.current = setTimeout(() => {
        showError("Support request timed out. Please try again.");
      }, 15000);
    } else {
      s.once("connect", () => {
        s.emit("user:request_human", {});
        requestTimeoutRef.current = setTimeout(() => {
          showError("Support request timed out. Please try again.");
        }, 15000);
      });
      const timeout = setTimeout(() => {
        if (!s.connected) {
          showError("Could not connect to the support server. Please try again.");
        }
      }, 5000);
      s.once("connect", () => clearTimeout(timeout));
    }
  }, [showError, clearError]);

  // -- Agent comes online while in OFFLINE_OPTIONS --
  useEffect(() => {
    if (agentsOnline && chatMode === "OFFLINE_OPTIONS" && !userChoseAlex) {
      requestHumanChat();
      setChatMode("WAITING");
    }
  }, [agentsOnline, chatMode, userChoseAlex, requestHumanChat]);

  // -- Agent goes offline while in WAITING (no active chat yet) --
  useEffect(() => {
    if (!agentsOnline && chatMode === "WAITING" && !humanChatId) {
      setMessages((prev: any) => [...prev, {
        id: "agent-offline-" + Date.now(),
        role: "assistant",
        content: "No agents are currently available. You can submit a ticket or chat with Alex.",
      }]);
      setChatMode("OFFLINE_OPTIONS");
    }
  }, [agentsOnline, chatMode, humanChatId, setMessages]);

  // -- On open: trigger CHECKING or skip to AI --
  useEffect(() => {
    if (isOpen && !hasCheckedStatus) {
      if (userChoseAlex || ticketSubmitted) {
        setChatMode("AI");
        setHasCheckedStatus(true);
        return;
      }
      setChatMode("CHECKING");
    }
  }, [isOpen, hasCheckedStatus, userChoseAlex, ticketSubmitted]);

  // -- Reset hasCheckedStatus when chat is closed so it re-checks on next open --
  useEffect(() => {
    if (!isOpen) {
      setHasCheckedStatus(false);
    }
  }, [isOpen]);

  // -- CHECKING flow: check agent status --
  useEffect(() => {
    if (chatMode !== "CHECKING") return;

    api.get(API_ROUTES.SUPPORT + "/agent-status")
      .then((r) => {
        const online = r?.data?.data?.online || false;
        setAgentsOnline(online);
        setHasCheckedStatus(true);
        if (online) {
          requestHumanChat();
          setChatMode("WAITING");
        } else {
          setChatMode("OFFLINE_OPTIONS");
        }
      })
      .catch(() => {
        setAgentsOnline(false);
        setHasCheckedStatus(true);
        setChatMode("OFFLINE_OPTIONS");
      });
  }, [chatMode, requestHumanChat]);

  // -- Typing indicator --
  const emitHumanTyping = useCallback(() => {
    if (!humanChatId) return;
    const now = Date.now();
    if (now - lastTypingEmitRef.current > 2000) {
      lastTypingEmitRef.current = now;
      const s = connectSupportSocket();
      if (s.connected) {
        s.emit("chat:typing", { chatId: humanChatId });
      }
    }
  }, [humanChatId]);

  const emitHumanStopTyping = useCallback(() => {
    if (!humanChatId) return;
    const s = connectSupportSocket();
    if (s.connected) {
      s.emit("chat:stop_typing", { chatId: humanChatId });
    }
  }, [humanChatId]);

  // -- Human message sending --
  const sendHumanMessage = useCallback((message: string) => {
    if (!humanChatId) return;
    const socket = connectSupportSocket();
    if (!socket.connected) {
      showError("Connection lost. Trying to reconnect...");
      return;
    }
    setSendingMessage(true);
    socket.emit("chat:send_message", { chatId: humanChatId, message });
    setHumanMessages((prev) => [...prev, {
      id: -Date.now(),
      senderType: "USER",
      senderName: "You",
      message,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    }]);
    setAgentTyping(false);
    emitHumanStopTyping();
    setTimeout(() => setSendingMessage(false), 800);
  }, [humanChatId, showError, emitHumanStopTyping]);

  // -- Back to Alex --
  const handleBackToAlex = useCallback(() => {
    setHumanMessages([]);
    setHumanChatId(null);
    setAgentName("");
    setChatMode("AI");
  }, []);

  // -- End chat --
  const handleEndChat = useCallback(() => {
    if ((chatMode === "HUMAN" || chatMode === "WAITING") && humanChatId) {
      const s = connectSupportSocket();
      s.emit("chat:close", { chatId: humanChatId });
    }
    if (greetingTimeoutRef.current) {
      clearTimeout(greetingTimeoutRef.current);
      greetingTimeoutRef.current = null;
    }
    greetingScheduledRef.current = false;
    greetingShownRef.current = false;
    setHumanMessages([]);
    setHumanChatId(null);
    setAgentName("");
    setQueuePosition(0);
    setMessages([]);
    setTicketSubmitted(false);
    setUserChoseAlex(false);
    setHasCheckedStatus(false);
    setIsOpen(false);
  }, [chatMode, humanChatId, setMessages]);

  // -- Mode switchers --
  const chooseAlex = useCallback(() => {
    if (greetingTimeoutRef.current) {
      clearTimeout(greetingTimeoutRef.current);
      greetingTimeoutRef.current = null;
    }
    greetingScheduledRef.current = false;
    greetingShownRef.current = false;
    setMessages([]);
    setUserChoseAlex(true);
    setIsWaitingForGreeting(false);
    setChatMode("AI");
  }, [setMessages]);

  const refreshAgentStatus = useCallback(() => {
    setRefreshing(true);
    api.get(API_ROUTES.SUPPORT + "/agent-status")
      .then((r) => {
        const online = r?.data?.data?.online || false;
        setAgentsOnline(online);
        if (online && chatMode === "OFFLINE_OPTIONS") {
          requestHumanChat();
          setChatMode("WAITING");
        }
      })
      .catch(() => setAgentsOnline(false))
      .finally(() => setRefreshing(false));
  }, [chatMode, requestHumanChat]);

  const openOfflineOptions = useCallback(() => {
    setChatMode("OFFLINE_OPTIONS");
  }, []);

  const startNewChat = useCallback(() => {
    setHumanMessages([]);
    setHumanChatId(null);
    setAgentName("");
    setQueuePosition(0);
    setCloseReason(null);
    setAgentTyping(false);
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setChatMode("CHECKING");
  }, []);

  return {
    // Mode
    chatMode,
    agentsOnline,

    // AI chat
    displayedMessages,
    isLoading,
    isWaitingForGreeting,
    sendAiMessage,

    // Human chat
    humanMessages,
    humanChatId,
    agentName,
    agentTyping,
    sendingMessage,
    queuePosition,
    sendHumanMessage,
    emitHumanTyping,
    emitHumanStopTyping,
    closeReason,
    startNewChat,

    // Ticket
    ticketSubmitted,

    // Error
    errorMessage,
    clearError,
    aiError,

    // Actions
    requestHumanChat,
    refreshAgentStatus,
    refreshing,
    handleEndChat,
    handleBackToAlex,
    chooseAlex,
    openOfflineOptions,
    isOpen,
    setIsOpen,
  };
}
