"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { connectSupportSocket } from "@/lib/supportSocket";
import { LinkifyText } from "@/components/linkify-text";
import {
  Clock, User, AlertCircle, Bot, Send, Power, MessageSquare, Users, Inbox,
} from "lucide-react";

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

interface ChatMessage {
  id: number;
  senderType: "USER" | "AGENT" | "AI" | "SYSTEM";
  senderName: string;
  message: string;
  isAi?: boolean;
  createdAt: string;
}

interface ActiveChat {
  id: number;
  userId: string | null;
  userName: string;
  userEmail: string;
  userImage: string | null;
  messages: ChatMessage[];
  createdAt: string;
}

export function AgentDashboard() {
  const [mobilePanel, setMobilePanel] = useState<"queue" | "chat" | "overview">("chat");
  const [queue, setQueue] = useState<PendingChat[]>([]);
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [agentOnline, setAgentOnline] = useState(false);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<number, ChatMessage[]>>({});
  const [userTyping, setUserTyping] = useState(false);
  const [disconnectedChats, setDisconnectedChats] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingEmitRef = useRef(0);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeChat = activeChats.find((c) => c.id === activeChatId) || activeChats[0] || null;

  const goOnline = useCallback(() => {
    const s = connectSupportSocket();
    s.emit("agent:online");
    setAgentOnline(true);
  }, []);

  const goOffline = useCallback(() => {
    const s = connectSupportSocket();
    s.emit("agent:offline");
    setAgentOnline(false);
  }, []);

  const takeChat = useCallback((chatId: number) => {
    const s = connectSupportSocket();
    s.emit("agent:take_chat", { chatId });
    setMobilePanel("chat");
  }, []);

  const closeChat = useCallback((chatId: number) => {
    const s = connectSupportSocket();
    s.emit("agent:close_chat", { chatId });
  }, []);

  const getMessages = (chatId: number): ChatMessage[] => {
    const chat = activeChats.find((c) => c.id === chatId);
    const base = chat?.messages || [];
    const extra = localMessages[chatId] || [];
    const merged = [...base, ...extra];
    const seen = new Set<number>();
    return merged.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  };

  const handleSend = () => {
    if (!input.trim() || !activeChat?.id) return;
    const msg = input.trim();
    const s = connectSupportSocket();
    s.emit("agent:send_message", { chatId: activeChat.id, message: msg });

    setLocalMessages((prev) => {
      const existing = prev[activeChat.id] || [];
      return {
        ...prev,
        [activeChat.id]: [
          ...existing,
          {
            id: -Date.now(),
            senderType: "AGENT" as const,
            senderName: "You",
            message: msg,
            createdAt: new Date().toISOString(),
            _optimistic: true,
          },
        ],
      };
    });

    setInput("");
    setUserTyping(false);
    emitAgentStopTyping();
  };

  const emitAgentTyping = useCallback(() => {
    if (!activeChatId) return;
    const now = Date.now();
    if (now - lastTypingEmitRef.current > 2000) {
      lastTypingEmitRef.current = now;
      const s = connectSupportSocket();
      if (s.connected) {
        s.emit("agent:typing", { chatId: activeChatId });
      }
    }
  }, [activeChatId]);

  const emitAgentStopTyping = useCallback(() => {
    if (!activeChatId) return;
    const s = connectSupportSocket();
    if (s.connected) {
      s.emit("agent:stop_typing", { chatId: activeChatId });
    }
  }, [activeChatId]);

  // Socket listeners — cleanup removes only our handlers (not other components')
  useEffect(() => {
    const s = connectSupportSocket();

    const on = <T extends (...args: any[]) => void>(event: string, handler: T): T => {
      s.on(event, handler);
      return handler;
    };

    const h = {
      agent_queue: on("agent:queue", (data: PendingChat[]) => {
        setQueue(data);
        setLoading(false);
      }),
      agent_active_chats: on("agent:active_chats", (data: ActiveChat[]) => {
        setActiveChats(data);
        setDisconnectedChats(new Set());
        setLoading(false);
      }),
      agent_queue_updated: on("agent:queue_updated", () => {
        connectSupportSocket().emit("agent:refresh_queue");
      }),
      agent_chat_taken: on("agent:chat_taken", (data: { chatId: number; chat?: ActiveChat }) => {
        setQueue((prev) => prev.filter((c) => c.id !== data.chatId));
        if (data.chat) {
          setActiveChats((prev) => {
            if (prev.some((c) => c.id === data.chat!.id)) return prev;
            return [...prev, data.chat!];
          });
          setActiveChatId(data.chatId);
        }
      }),
      chat_message: on("chat:message", (data: { chatId: number } & ChatMessage) => {
        console.log("[ADMIN] chat:message RECEIVED:", data);
        setLocalMessages((prev) => {
          const existing = prev[data.chatId] || [];
          if (existing.some((m) => m.id === data.id)) return prev;
          const filtered = existing.filter(
            (m) => !((m as { _optimistic?: boolean })._optimistic && m.senderType === data.senderType && m.message === data.message)
          );
          return { ...prev, [data.chatId]: [...filtered, data] };
        });
      }),
      chat_closed: on("chat:closed", (data: { chatId: number }) => {
        setLocalMessages((prev) => {
          const updated = { ...prev };
          delete updated[data.chatId];
          return updated;
        });
        setDisconnectedChats((prev) => {
          const next = new Set(prev);
          next.delete(data.chatId);
          return next;
        });
      }),
      chat_typing: on("chat:typing", () => {
        console.log("[ADMIN] chat:typing RECEIVED");
        setUserTyping(true);
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => setUserTyping(false), 3000);
      }),
      chat_stop_typing: on("chat:stop_typing", () => {
        setUserTyping(false);
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current);
          typingTimerRef.current = null;
        }
      }),
      agent_status: on("agent:status", (data: { online: boolean }) => {
        setAgentOnline(data.online);
      }),
      user_disconnected: on("user:disconnected", (data: { chatId: number }) => {
        setDisconnectedChats((prev) => new Set(prev).add(data.chatId));
      }),
      user_reconnected: on("user:reconnected", (data: { chatId: number }) => {
        setDisconnectedChats((prev) => {
          const next = new Set(prev);
          next.delete(data.chatId);
          return next;
        });
      }),
    };

    // Sync agent status from backend on mount
    s.emit("agent:get_status");

    return () => {
      s.off("agent:queue", h.agent_queue);
      s.off("agent:active_chats", h.agent_active_chats);
      s.off("agent:queue_updated", h.agent_queue_updated);
      s.off("agent:chat_taken", h.agent_chat_taken);
      s.off("chat:message", h.chat_message);
      s.off("chat:closed", h.chat_closed);
      s.off("chat:typing", h.chat_typing);
      s.off("chat:stop_typing", h.chat_stop_typing);
      s.off("agent:status", h.agent_status);
      s.off("user:disconnected", h.user_disconnected);
      s.off("user:reconnected", h.user_reconnected);
    };
  }, []);

  // Heartbeat: emit every 10s when agent is online
  useEffect(() => {
    if (agentOnline) {
      connectSupportSocket().emit("agent:heartbeat");
      heartbeatRef.current = setInterval(() => {
        connectSupportSocket().emit("agent:heartbeat");
      }, 10 * 1000);
    }
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [agentOnline]);

  // Ensure skeleton is visible for at least 500ms
  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeChats.length > 0 && !activeChats.find((c) => c.id === activeChatId)) {
      setActiveChatId(activeChats[0].id);
    }
    if (activeChats.length === 0) {
      setActiveChatId(null);
    }
  }, [activeChats, activeChatId]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current && activeChatId) {
        const el = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
        if (el) el.scrollTop = el.scrollHeight;
      }
    });
  }, [activeChatId, localMessages, activeChats]);

  function formatTimeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m ago`;
  }

  return (
    <div className="flex-1 w-full px-4 sm:px-6 py-6 max-w-full overflow-x-hidden">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent leading-[unset] pb-1">
            Live Support
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">Manage incoming support chat requests in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-2.5 w-2.5 rounded-full animate-pulse",
            agentOnline ? "bg-green-500" : "bg-gray-400"
          )} />
          <span className="text-sm font-medium">{agentOnline ? "Online" : "Offline"}</span>
          <Button
            size="sm"
            variant={agentOnline ? "outline" : "default"}
            className="h-8 text-xs"
            onClick={agentOnline ? goOffline : goOnline}
          >
            <Power className="h-3 w-3 mr-1" />
            {agentOnline ? "Go Offline" : "Go Online"}
          </Button>
        </div>
      </div>

      <div className="flex gap-1 mb-4 p-1 bg-muted/50 rounded-xl lg:hidden">
        <button
          onClick={() => setMobilePanel("queue")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all",
            mobilePanel === "queue"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Inbox className="h-3.5 w-3.5" />
          Queue
          {queue.length > 0 && (
            <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
              {queue.length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setMobilePanel("chat")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all",
            mobilePanel === "chat"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Chat
          {activeChats.length > 0 && (
            <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
              {activeChats.length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setMobilePanel("overview")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all",
            mobilePanel === "overview"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="h-3.5 w-3.5" />
          Overview
        </button>
      </div>

      <div className={cn(
        "grid gap-6 grid-cols-1 h-[calc(100vh-340px)] min-h-[400px] lg:grid-cols-4 lg:h-[calc(100vh-280px)] lg:min-h-[500px]"
      )}>
        {/* Queue Panel */}
        <div className={cn(
          "overflow-hidden flex flex-col",
          mobilePanel === "queue" ? "flex" : "hidden",
          "lg:col-span-1 lg:flex"
        )}>
          <Card className="flex flex-col h-full border-border/50">
            <CardHeader className="pb-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  Queue
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {queue.length} waiting
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-1 px-3 pb-3">
                  {(loading || showSkeleton) ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-3 rounded-xl space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    ))
                  ) : queue.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <User className="h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-sm text-muted-foreground">No pending chats</p>
                      <p className="text-xs text-muted-foreground/60">All caught up!</p>
                    </div>
                  ) : (
                    queue.map((chat) => (
                      <div
                        key={chat.id}
                        className={cn(
                          "p-3 rounded-xl border transition-all hover:bg-secondary/50",
                          chat.isEscalated ? "border-orange-500/30 bg-orange-500/5" : "border-border/50"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium truncate">{chat.userName}</p>
                              {chat.isEscalated && (
                                <AlertCircle className="h-3 w-3 text-orange-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{chat.userEmail}</p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                              {formatTimeAgo(chat.createdAt)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-xs flex-shrink-0"
                            onClick={() => takeChat(chat.id)}
                          >
                            Take
                          </Button>
                        </div>
                        {chat.aiContext && (
                          <p className="text-[10px] text-muted-foreground/50 mt-2 line-clamp-2 italic border-t border-border/30 pt-2">
                            {chat.aiContext}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Panel */}
        <div className={cn(
          "overflow-hidden flex flex-col",
          mobilePanel === "chat" ? "flex" : "hidden",
          "lg:col-span-2 lg:flex"
        )}>
          <Card className="flex flex-col h-full border-border/50">
            {(loading || showSkeleton) ? (
              <>
                <CardHeader className="pb-3 flex-shrink-0 border-b">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                </CardHeader>
                <div className="flex-1 p-4 space-y-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
                    <Skeleton className="h-10 w-48 rounded-xl" />
                  </div>
                  <div className="flex gap-2 flex-row-reverse">
                    <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
                    <Skeleton className="h-10 w-36 rounded-xl" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
                    <Skeleton className="h-14 w-56 rounded-xl" />
                  </div>
                </div>
                <div className="p-2 sm:p-3 border-t flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="flex-1 h-10 rounded-xl" />
                    <Skeleton className="h-9 w-9 rounded-xl" />
                  </div>
                </div>
              </>
            ) : !activeChat ? (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No active chat selected</p>
                  <p className="text-xs text-muted-foreground/60">Take a chat from the queue to begin</p>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader className="pb-3 flex-shrink-0 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{activeChat.userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{activeChat.userEmail}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-red-500 hover:text-red-600 flex-shrink-0"
                      onClick={() => closeChat(activeChat.id)}
                    >
                      <Clock className="h-3 w-3 mr-1" /> Resolve
                    </Button>
                  </div>
                </CardHeader>

                <div className="flex border-b overflow-x-auto scrollbar-none">
                  {activeChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={cn(
                        "px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-1.5",
                        activeChatId === chat.id
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {chat.userName}
                      {disconnectedChats.has(chat.id) && (
                        <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>

                {disconnectedChats.has(activeChat.id) && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs">
                    <AlertCircle className="h-3.5 w-3.5 animate-pulse" />
                    <span>User disconnected — waiting 30s before resolving...</span>
                  </div>
                )}

                <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollRef}>
                  <div className="space-y-3 sm:space-y-4">
                    {getMessages(activeChat.id).map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-3",
                          msg.senderType === "AGENT" ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                          msg.senderType === "AGENT" ? "bg-primary/10 border-primary/20" : msg.senderType === "SYSTEM" ? "bg-muted border-dashed" : "bg-muted"
                        )}>
                          {msg.senderType === "AGENT" ? (
                            <Bot className="h-4 w-4 text-primary" />
                          ) : msg.senderType === "SYSTEM" ? (
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className={cn(
                          "flex flex-col max-w-[80%] min-w-0 gap-1",
                          msg.senderType === "AGENT" ? "items-end" : "items-start"
                        )}>
                          <div className={cn(
                            "px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed break-words",
                            msg.senderType === "AGENT"
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : msg.senderType === "SYSTEM"
                              ? "bg-muted/30 border border-dashed rounded-tl-none text-muted-foreground italic text-xs"
                              : "bg-card border rounded-tl-none"
                          )}>
                            {msg.isAi ? (
                              <span className="text-xs italic opacity-70">[AI Context] </span>
                            ) : null}
                            {msg.senderType === "SYSTEM" ? (
                              msg.message
                            ) : (
                              <LinkifyText text={msg.message} />
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {userTyping && activeChat && (
                  <div className="flex gap-3 animate-in fade-in duration-300 px-4 py-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border flex-shrink-0">
                      <User className="h-4 w-4 text-muted-foreground" />
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

                <div className="p-2 sm:p-3 border-t flex-shrink-0">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2"
                  >
                    <input
                      value={input}
                      onChange={(e) => { setInput(e.target.value); emitAgentTyping(); }}
                      onBlur={() => { if (!input.trim()) emitAgentStopTyping(); }}
                      placeholder="Type your reply..."
                      className="flex-1 bg-muted/50 border-none focus:ring-1 focus:ring-primary/30 rounded-xl px-3 py-2 text-sm outline-none transition-all min-w-0"
                    />
                    <Button type="submit" size="icon" disabled={!input.trim()} className="rounded-xl h-9 w-9 flex-shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Stats Panel */}
        <div className={cn(
          "overflow-hidden flex flex-col",
          mobilePanel === "overview" ? "flex" : "hidden",
          "lg:col-span-1 lg:flex"
        )}>
          <Card className="flex flex-col h-full border-border/50">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-violet-500" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(loading || showSkeleton) ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-secondary/20 text-center space-y-2">
                      <Skeleton className="h-4 w-4 mx-auto rounded" />
                      <Skeleton className="h-6 w-10 mx-auto" />
                      <Skeleton className="h-3 w-12 mx-auto" />
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/20 text-center space-y-2">
                      <Skeleton className="h-4 w-4 mx-auto rounded" />
                      <Skeleton className="h-6 w-10 mx-auto" />
                      <Skeleton className="h-3 w-12 mx-auto" />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border/50 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-secondary/20 text-center">
                      <MessageSquare className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                      <p className="text-lg font-bold">{queue.length}</p>
                      <p className="text-[10px] text-muted-foreground">In Queue</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/20 text-center">
                      <Clock className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <p className="text-lg font-bold">{activeChats.length}</p>
                      <p className="text-[10px] text-muted-foreground">Active</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
                      Quick Tips
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground/70">
                      <li>• Click Take to accept a chat from the queue</li>
                      <li>• Type & press Enter to reply</li>
                      <li>• Click Resolve to end a chat</li>
                      <li>• Tabs let you switch between active chats</li>
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
