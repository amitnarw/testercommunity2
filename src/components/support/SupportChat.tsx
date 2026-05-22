"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Bot, Ticket, HelpCircle, Headphones, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { getSupportHistory, saveChatMessage, createSupportTicket } from "@/lib/apiCalls";
import API_ROUTES from "@/lib/apiRoutes";
import api from "@/lib/axios";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/transition-link";
import { connectSupportSocket } from "@/lib/supportSocket";

type ChatMode = "AI" | "WAITING" | "HUMAN" | "OFFLINE_OPTIONS" | "TICKET_FORM" | "CHECKING";

export function SupportChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [chatMode, setChatMode] = useState<ChatMode>("AI");
  const [queuePosition, setQueuePosition] = useState(0);
  const [agentName, setAgentName] = useState("");
  const [humanMessages, setHumanMessages] = useState<any[]>([]);
  const [humanChatId, setHumanChatId] = useState<number | null>(null);
  const [humanInput, setHumanInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [agentTyping, setAgentTyping] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [agentsOnline, setAgentsOnline] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketCategory, setTicketCategory] = useState("GENERAL");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [userChoseAlex, setUserChoseAlex] = useState(false);
  const [hasCheckedStatus, setHasCheckedStatus] = useState(false);
  const requestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingEmitRef = useRef(0);

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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [initialHistoryLoaded, setInitialHistoryLoaded] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isWaitingForGreeting, setIsWaitingForGreeting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayedMessages, setDisplayedMessages] = useState<any[]>([]);
  const humanScrollRef = useRef<HTMLDivElement>(null);

  const isSupportPath = pathname?.startsWith(ROUTES.PUBLIC.SUPPORT) ||
                       pathname?.startsWith("/help") ||
                       pathname?.startsWith(ROUTES.TESTER.SUPPORT);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: `${BACKEND_URL}/api/support/chat/stream`,
      credentials: "include",
    }),
  });

  const { messages, status, setMessages, sendMessage } = chat;
  const isLoading = status === "streaming" || status === "submitted";
  const [localInput, setLocalInput] = useState("");

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-alex-chat", handleOpenChat);
    return () => window.removeEventListener("open-alex-chat", handleOpenChat);
  }, []);

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput?.trim()) return;
    saveChatMessage({ message: localInput, role: "user" }).catch(() => {});
    if (sendMessage) sendMessage({ text: localInput });
    setLocalInput("");
  };

  useEffect(() => {
    setDisplayedMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (isOpen && !initialHistoryLoaded) {
      setIsHistoryLoading(true);
      setInitialHistoryLoaded(true);

      getSupportHistory().then(history => {
        if (history && history.length > 0) {
          const formatted = history.map((h: any, i: number) => ({
            id: `hist-${i}`,
            role: h.role,
            content: h.content || h.message
          }));
          setMessages(formatted);
          setIsHistoryLoading(false);
        } else {
          setIsHistoryLoading(false);
          setIsWaitingForGreeting(true);
          setTimeout(() => {
            setMessages((prev: any) => [...prev, {
              id: "greeting",
              role: "assistant",
              content: "Hello! I'm Alex from the inTesters support team. How can I help you today?"
            }]);
            setIsWaitingForGreeting(false);
          }, 1500);
        }
      }).catch(() => {
        setIsHistoryLoading(false);
        setIsWaitingForGreeting(true);
        setTimeout(() => {
          setMessages((prev: any) => [...prev, {
            id: "greeting",
            role: "assistant",
            content: "Hello! I'm Alex from the inTesters support team. How can I help you today?"
          }]);
          setIsWaitingForGreeting(false);
        }, 1500);
      });
    }
  }, [isOpen, initialHistoryLoaded, setMessages]);

  useEffect(() => {
    if (scrollRef.current && chatMode === "AI") {
      const el = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [displayedMessages, isLoading, isWaitingForGreeting, chatMode]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (humanScrollRef.current && chatMode === "HUMAN") {
        const el = humanScrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (el) el.scrollTop = el.scrollHeight;
      }
    });
  }, [humanMessages, chatMode]);

  // Socket.IO integration
  const socketInitialized = useRef(false);

  useEffect(() => {
    if (!isSupportPath) return;
    if (socketInitialized.current) return;
    socketInitialized.current = true;

    const s = connectSupportSocket();

    s.on("connect", () => {
      clearError();
      s.emit("user:rejoin");
    });

    s.on("connect_error", (err) => {
      showError(`Connection failed: ${err.message}. Please try again.`);
    });

    s.on("chat:requested", (data: { chatId: number; position: number }) => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }
      setHumanChatId(data.chatId);
      setQueuePosition(data.position);
      setChatMode("WAITING");
      clearError();
    });

    s.on("chat:fallback_to_ai", (data: { message: string; chatId: number }) => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }
      setHumanChatId(data.chatId);
      // Stay in AI mode but let the user know a ticket was created
      setMessages((prev: any) => [...prev, {
        id: "fallback-" + Date.now(),
        role: "assistant",
        content: data.message,
      }]);
      clearError();
    });

    s.on("chat:unavailable", (data: { reason?: string }) => {
      // Never go to OFFLINE_FAIL. Fallback to AI.
      const msg = data?.reason || "No agents are available right now. Alex can help!";
      setMessages((prev: any) => [...prev, {
        id: "fallback-" + Date.now(),
        role: "assistant",
        content: msg + " A human agent will review your conversation when they come online.",
      }]);
      clearError();
    });

    s.on("chat:assigned", (data: { chatId: number; agentName: string }) => {
      clearError();
      setHumanChatId(data.chatId);
      setAgentName(data.agentName);
      setChatMode("HUMAN");
    });

    s.on("chat:message", (data: any) => {
      setHumanMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        const filtered = prev.filter(
          (m) => !(m._optimistic && m.senderType === "USER" && m.message === data.message)
        );
        return [...filtered, data];
      });
    });

    s.on("chat:closed", () => {
      setHumanMessages((prev) => [...prev, {
        id: "closed",
        senderType: "SYSTEM",
        senderName: "System",
        message: "This chat has been closed.",
        createdAt: new Date().toISOString(),
      }]);
      setHumanInput("");
    });

    s.on("chat:error", (data: { message?: string }) => {
      showError(data?.message || "Something went wrong. Please try again.");
    });

    s.on("agent:typing", () => {
      setAgentTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setAgentTyping(false), 3000);
    });

    s.on("chat:position_updated", (data: { position: number }) => {
      setQueuePosition(data.position);
    });

    s.on("agent:status_changed", () => {
      // Re-fetch agent status (simple: just toggle a state to trigger re-evaluation)
      setAgentsOnline((prev) => !prev);
    });

    if (s.connected) {
      s.emit("user:rejoin");
    }

    // Agent status fetched when chat opens via CHECKING flow

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
      s.off("connect");
      s.off("connect_error");
      s.off("chat:requested");
      s.off("chat:fallback_to_ai");
      s.off("chat:unavailable");
      s.off("chat:assigned");
      s.off("chat:message");
      s.off("chat:closed");
      s.off("chat:error");
      s.off("chat:typing");
      s.off("agent:typing");
      s.off("chat:position_updated");
      s.off("agent:status_changed");
      socketInitialized.current = false;
    };
  }, [isSupportPath]);

  const requestHumanChat = useCallback(() => {
    clearError();
    const s = connectSupportSocket();
    if (s.connected) {
      s.emit("user:request_human", {});
      requestTimeoutRef.current = setTimeout(() => {
        showError("Support request timed out — no response from server. Please try again.");
      }, 15000);
    } else {
      s.once("connect", () => {
        s.emit("user:request_human", {});
        requestTimeoutRef.current = setTimeout(() => {
          showError("Support request timed out — no response from server. Please try again.");
        }, 15000);
      });
      const timeout = setTimeout(() => {
        if (!s.connected) {
          showError("Could not connect to the support server. Please check your connection and try again.");
        }
      }, 5000);
      s.once("connect", () => clearTimeout(timeout));
    }
  }, [showError, clearError]);

  useEffect(() => {
    if (agentsOnline && chatMode === "OFFLINE_OPTIONS") {
      setChatMode("AI");
    }
  }, [agentsOnline, chatMode, isOpen]);

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

  useEffect(() => {
    if (chatMode !== "CHECKING") return;

    api.get(API_ROUTES.SUPPORT + "/agent-status")
      .then((r) => {
        const online = r?.data?.data?.online || false;
        setAgentsOnline(online);
        setHasCheckedStatus(true);
        setChatMode(online ? "AI" : "OFFLINE_OPTIONS");
      })
      .catch(() => {
        setAgentsOnline(false);
        setHasCheckedStatus(true);
        setChatMode("OFFLINE_OPTIONS");
      });
  }, [chatMode]);

  const handleHumanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanInput.trim() || !humanChatId) return;
    const socket = connectSupportSocket();
    if (!socket.connected) {
      showError("Connection lost. Trying to reconnect...");
      return;
    }
    const msg = humanInput.trim();
    setSendingMessage(true);
    socket.emit("chat:send_message", { chatId: humanChatId, message: msg });
    setHumanMessages((prev) => [...prev, {
      id: -Date.now(),
      senderType: "USER",
      senderName: "You",
      message: msg,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    }]);
    setHumanInput("");
    setAgentTyping(false);
    setTimeout(() => setSendingMessage(false), 800);
  };

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

  const handleBackToAlex = useCallback(() => {
    setHumanMessages([]);
    setHumanChatId(null);
    setAgentName("");
    setChatMode("AI");
  }, []);

  const formatChatTranscript = useCallback(() => {
    const chatMessages = displayedMessages.filter(
      (m: any) => (m.role === "user" || m.role === "assistant") && m.id !== "greeting"
    );
    if (chatMessages.length === 0) return "";
    const transcript = chatMessages
      .map((m: any) => `${m.role === "user" ? "User" : "Alex"}: ${m.content}`)
      .join("\n");
    return `\n\n--- Chat Transcript ---\n${transcript}`;
  }, [displayedMessages]);

  const handleTicketSubmit = useCallback(async () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;
    setTicketSubmitting(true);
    clearError();
    try {
      const transcript = formatChatTranscript();
      const description = ticketDescription + transcript;
      const ticket = await createSupportTicket({
        subject: ticketSubject,
        description,
        category: ticketCategory,
      });
      setTicketSuccess(true);
      setMessages((prev: any) => [...prev, {
        id: "ticket-success-" + Date.now(),
        role: "assistant",
        content: `Thanks! Your ticket **#${ticket.id}** has been submitted. A human agent will review it when they come online. You can track your tickets in the [Tickets](/support/tickets) page.`,
      }]);
      setTimeout(() => {
        setTicketSubject("");
        setTicketDescription("");
        setTicketCategory("GENERAL");
        setTicketSuccess(false);
        setTicketSubmitting(false);
        setTicketSubmitted(true);
        setChatMode("AI");
      }, 2000);
    } catch (err) {
      showError("Failed to submit ticket. Please try again.");
      setTicketSubmitting(false);
    }
  }, [ticketSubject, ticketDescription, ticketCategory, formatChatTranscript, setMessages, showError, clearError]);

  const handleOpenOfflineOptions = useCallback(() => {
    setChatMode("OFFLINE_OPTIONS");
  }, []);

  if (!isSupportPath) return null;

  return (
    <div className={cn(
      "fixed z-50 flex flex-col items-end transition-all duration-300",
      isOpen ? "inset-4 sm:inset-auto sm:bottom-8 sm:right-8" : "bottom-8 right-4 sm:right-8"
    )}>
      <motion.div
        layout
        initial={false}
        animate={{
          width: isOpen ? (windowWidth < 640 ? "100%" : 380) : 180,
          height: isOpen ? (windowWidth < 640 ? "100%" : "70vh") : 52,
          borderRadius: isOpen ? (windowWidth < 640 ? 24 : 16) : 26,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="bg-card shadow-2xl flex flex-col border overflow-hidden origin-bottom-right"
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="button-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              onClick={() => setIsOpen(true)}
              className="w-full h-full flex items-center justify-between gap-3 p-2 bg-primary text-primary-foreground cursor-pointer hover:bg-primary/95 transition-colors"
            >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-primary rounded-full bg-green-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs tracking-tight whitespace-nowrap">
                      Chat with agent
                    </span>
                    <span className="text-xs text-primary-foreground/70 leading-none">
                      AI + Support
                    </span>
                  </div>
                </div>
            </motion.div>
          ) : (
            <motion.div
              key="window-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full w-full"
            >
              {/* Header */}
              <header className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                    {chatMode === "HUMAN" ? (
                      <Headphones className="h-6 w-6 text-primary-foreground" />
                    ) : chatMode === "TICKET_FORM" ? (
                      <Ticket className="h-6 w-6 text-primary-foreground" />
                    ) : (
                      <Bot className="h-6 w-6 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">
                      {chatMode === "HUMAN" ? `${agentName} @ inTesters` :
                       chatMode === "TICKET_FORM" ? "Submit a Ticket" :
                       chatMode === "OFFLINE_OPTIONS" ? "Leave a message" :
                       chatMode === "CHECKING" ? "Connecting..." :
                       "Alex @ inTesters"}
                    </h3>
                    <p className="text-[10px] text-primary-foreground/80 flex items-center gap-1.5">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        chatMode === "HUMAN" ? "bg-green-400 animate-pulse" :
                        chatMode === "WAITING" ? "bg-amber-400 animate-pulse" :
                        chatMode === "CHECKING" ? "bg-amber-400 animate-pulse" :
                        chatMode === "OFFLINE_OPTIONS" || chatMode === "TICKET_FORM" ? "bg-gray-400" :
                        "bg-green-400"
                      )} />
                      {chatMode === "WAITING" ? "Connecting..." :
                       chatMode === "HUMAN" ? "Live Agent" :
                       chatMode === "CHECKING" ? "Checking availability..." :
                       chatMode === "OFFLINE_OPTIONS" ? "Agent Offline" :
                       chatMode === "TICKET_FORM" ? (ticketSuccess ? "Submitted!" : "Fill details") :
                       "AI Assistant"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full hover:bg-white/10 text-primary-foreground">
                  <X className="h-5 w-5" />
                </Button>
              </header>

              {/* Messages - AI Mode */}
              {chatMode === "AI" && (
                <>
                  <ScrollArea className="flex-1 p-4 bg-background/50" ref={scrollRef}>
                    <div className="space-y-4 pb-4">
                      {displayedMessages.map((m: any, index: number) => {
                        const isLast = index === displayedMessages.length - 1;
                        const isCurrentlyStreaming = isLoading && m.role === "assistant" && isLast;
                        if (isCurrentlyStreaming) return null;

                        return (
                        <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                            m.role === "assistant" ? "bg-primary/10 border-primary/20" : "bg-muted"
                          )}>
                            {m.role === "assistant" ? (
                              <Bot className="h-4 w-4 text-primary" />
                            ) : (
                              <User className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className={cn("flex flex-col max-w-[80%] gap-1", m.role === "user" ? "items-end" : "items-start")}>
                            <div className={cn(
                              "px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed",
                              m.role === "user"
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-card border rounded-tl-none"
                            )}>
                              <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                <ReactMarkdown>{m.content}</ReactMarkdown>
                              </div>
                            </div>
                            {m.toolInvocations?.map((toolInvocation: any) => {
                              const { toolCallId, toolName } = toolInvocation;
                              if (toolName === "create_ticket") {
                                return (
                                  <div key={toolCallId} className="mt-2 p-3 bg-muted/50 rounded-xl border border-dashed flex items-center gap-3 w-full">
                                    <Ticket className="h-4 w-4 text-primary" />
                                    <div className="flex-1 overflow-hidden">
                                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Support Ticket</p>
                                      <p className="text-xs truncate italic">
                                        {"✅ Ticket created successfully"}
                                      </p>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      )})}

                      {(isLoading || isWaitingForGreeting || isHistoryLoading) && (
                        <div className="flex gap-3 animate-in fade-in duration-300">
                          <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                          <div className="bg-muted/30 px-4 py-3 rounded-2xl rounded-tl-none border">
                            <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <footer className="p-4 border-t bg-card/80 backdrop-blur-sm">
                    {errorMessage && (
                      <div className="mb-3 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 text-xs text-destructive">
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="flex-1">{errorMessage}</span>
                        <button type="button" onClick={clearError} className="text-destructive/70 hover:text-destructive flex-shrink-0">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <form onSubmit={handleLocalSubmit} className="relative flex items-center gap-2">
                      <input
                        ref={inputRef}
                        value={localInput}
                        onChange={(e) => setLocalInput(e.target.value)}
                        placeholder="How can Alex help you?"
                        autoFocus
                        className="flex-1 bg-muted/50 border-none focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                      />
                      <Button type="submit" size="icon" disabled={isLoading || !localInput?.trim()} className="rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                    <div className="mt-3 flex items-center justify-between px-1">
                      <div className="flex items-center gap-4">
                        {agentsOnline ? (
                          <button
                            onClick={requestHumanChat}
                            className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                          >
                            <Headphones className="h-3 w-3" />
                            Talk to a human
                          </button>
                        ) : (ticketSubmitted || userChoseAlex) ? null : (
                          <button
                            onClick={handleOpenOfflineOptions}
                            className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                          >
                            <Headphones className="h-3 w-3" />
                            Leave a message
                          </button>
                        )}
                        <TransitionLink href="/support/tickets" onClick={() => setIsOpen(false)} className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                          <Ticket className="h-3 w-3" />
                          Tickets
                        </TransitionLink>
                        <TransitionLink href={ROUTES.PUBLIC.SUPPORT} onClick={() => setIsOpen(false)} className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                          <HelpCircle className="h-3 w-3" />
                          Help
                        </TransitionLink>
                      </div>
                    </div>
                  </footer>
                </>
              )}

              {/* WAITING Mode */}
              {chatMode === "WAITING" && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background/50 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                    <Headphones className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">Connecting you to support...</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    {queuePosition > 0
                      ? `You're #${queuePosition} in the queue. A support agent will be with you shortly.`
                      : "Finding an available support agent..."}
                  </p>
                  <div className="flex gap-1 mt-2">
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                  </div>
                  {errorMessage && (
                    <div className="mt-4 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 text-xs text-destructive max-w-xs">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="flex-1">{errorMessage}</span>
                      <button type="button" onClick={clearError} className="text-destructive/70 hover:text-destructive flex-shrink-0">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-xs text-muted-foreground"
                    onClick={handleBackToAlex}
                  >
                    Back to Alex instead
                  </Button>
                </div>
              )}

              {/* CHECKING Mode */}
              {chatMode === "CHECKING" && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background/50 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                  </div>
                  <h3 className="font-bold text-lg">Connecting you...</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Checking agent availability...
                  </p>
                </div>
              )}

              {/* OFFLINE OPTIONS Mode */}
              {chatMode === "OFFLINE_OPTIONS" && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background/50 space-y-6">
                  <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                    <Headphones className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-bold text-lg">Support Agent Offline</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      No support agents are available right now. You can submit a ticket and we&apos;ll get back to you, or continue chatting with Alex.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    <Button
                      onClick={() => setChatMode("TICKET_FORM")}
                      className="rounded-2xl h-12 font-semibold w-full shadow-lg"
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      Submit a Support Ticket
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUserChoseAlex(true);
                        setChatMode("AI");
                      }}
                      className="rounded-2xl h-12 font-semibold w-full"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Chat with Alex
                    </Button>
                  </div>
                </div>
              )}

              {/* TICKET FORM Mode */}
              {chatMode === "TICKET_FORM" && (
                <div className="flex-1 flex flex-col bg-background/50">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-base">Submit a Ticket</h3>
                        <p className="text-xs text-muted-foreground">
                          Describe your issue and our team will get back to you.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <select
                          value={ticketCategory}
                          onChange={(e) => setTicketCategory(e.target.value)}
                          disabled={ticketSubmitting || ticketSuccess}
                          className="w-full rounded-xl bg-muted/50 border px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/30"
                        >
                          <option value="GENERAL">General Inquiry</option>
                          <option value="TECHNICAL">Technical Issue</option>
                          <option value="BILLING">Billing &amp; Payments</option>
                          <option value="BUG_REPORT">Bug Report</option>
                        </select>
                        <input
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          placeholder="Subject"
                          disabled={ticketSubmitting || ticketSuccess}
                          className="w-full rounded-xl bg-muted/50 border px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/30"
                        />
                        <textarea
                          value={ticketDescription}
                          onChange={(e) => setTicketDescription(e.target.value)}
                          placeholder="Describe your issue in detail..."
                          rows={4}
                          disabled={ticketSubmitting || ticketSuccess}
                          className="w-full rounded-xl bg-muted/50 border p-4 text-sm outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                        />
                        {errorMessage && (
                          <div className="px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 text-xs text-destructive">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="flex-1">{errorMessage}</span>
                            <button type="button" onClick={clearError} className="text-destructive/70 hover:text-destructive flex-shrink-0">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                  {ticketSuccess ? (
                    <div className="p-6 flex flex-col items-center justify-center space-y-4">
                      <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      </div>
                      <p className="text-sm font-semibold text-center">Ticket Submitted!</p>
                    </div>
                  ) : (
                    <footer className="p-4 border-t bg-card/80 backdrop-blur-sm space-y-2">
                      <Button
                        onClick={handleTicketSubmit}
                        disabled={ticketSubmitting || !ticketSubject.trim() || !ticketDescription.trim()}
                        className="w-full rounded-2xl h-12 font-semibold"
                      >
                        {ticketSubmitting ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            Submit Ticket
                          </div>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setChatMode("OFFLINE_OPTIONS")}
                        disabled={ticketSubmitting}
                        className="w-full rounded-2xl h-10 text-xs text-muted-foreground"
                      >
                        Back
                      </Button>
                    </footer>
                  )}
                </div>
              )}

              {/* HUMAN Mode */}
              {chatMode === "HUMAN" && (
                <>
                  <ScrollArea ref={humanScrollRef} className="flex-1 p-4 bg-background/50">
                    <div className="space-y-4 pb-4">
                      {humanMessages.map((m: any, i: number) => (
                        <div key={m.id || i} className={cn("flex gap-3", m.senderType === "USER" ? "flex-row-reverse" : "flex-row")}>
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                            m.senderType === "AGENT" ? "bg-primary/10 border-primary/20" : m.senderType === "SYSTEM" ? "bg-muted border-dashed" : "bg-muted"
                          )}>
                            {m.senderType === "AGENT" ? (
                              <Headphones className="h-4 w-4 text-primary" />
                            ) : m.senderType === "SYSTEM" ? (
                              <Bot className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <User className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className={cn("flex flex-col max-w-[80%] gap-1", m.senderType === "USER" ? "items-end" : "items-start")}>
                            <div className={cn(
                              "px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed",
                              m.senderType === "USER"
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : m.senderType === "SYSTEM"
                                ? "bg-muted/30 border border-dashed rounded-tl-none text-muted-foreground italic text-xs"
                                : "bg-card border rounded-tl-none"
                            )}>
                              {m.message}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  {agentTyping && (
                    <div className="px-4 py-1.5 text-xs text-muted-foreground flex items-center gap-2 border-t bg-background/30">
                      <div className="flex gap-1">
                        <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" />
                      </div>
                      {agentName || "Agent"} is typing...
                    </div>
                  )}
                  <footer className="p-4 border-t bg-card/80 backdrop-blur-sm">
                    {errorMessage && (
                      <div className="mb-3 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 text-xs text-destructive">
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="flex-1">{errorMessage}</span>
                        <button type="button" onClick={clearError} className="text-destructive/70 hover:text-destructive flex-shrink-0">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <form onSubmit={handleHumanSubmit} className="relative flex items-center gap-2">
                      <input
                        value={humanInput}
                        onChange={(e) => {
                          setHumanInput(e.target.value);
                          emitHumanTyping();
                        }}
                        placeholder="Type your message..."
                        autoFocus
                        className="flex-1 bg-muted/50 border-none focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                      />
                      <Button type="submit" size="icon" disabled={!humanInput.trim() || sendingMessage} className="rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all">
                        {sendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </footer>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
