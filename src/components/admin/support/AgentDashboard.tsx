"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { connectSupportSocket } from "@/lib/supportSocket";
import {
  Clock, User, AlertCircle, Bot, Send, Power, MessageSquare, Users,
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
  const [queue, setQueue] = useState<PendingChat[]>([]);
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentOnline, setAgentOnline] = useState(false);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<number, ChatMessage[]>>({});
  const [userTyping, setUserTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingEmitRef = useRef(0);

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
    const s = connectSupportSocket();
    s.emit("agent:send_message", { chatId: activeChat.id, message: input.trim() });
    setInput("");
    setUserTyping(false);
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

  // Socket listeners
  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const s = connectSupportSocket();

    s.on("agent:queue", (data: PendingChat[]) => {
      setQueue(data);
      setLoading(false);
    });

    s.on("agent:active_chats", (data: ActiveChat[]) => {
      setActiveChats(data);
      setLoading(false);
    });

    s.on("agent:queue_updated", () => {
      connectSupportSocket().emit("agent:online");
    });

    s.on("agent:chat_taken", (data: { chatId: number }) => {
      setQueue((prev) => prev.filter((c) => c.id !== data.chatId));
    });

    s.on("chat:message", (data: { chatId: number } & ChatMessage) => {
      setLocalMessages((prev) => {
        const existing = prev[data.chatId] || [];
        if (existing.some((m) => m.id === data.id)) return prev;
        return { ...prev, [data.chatId]: [...existing, data] };
      });
    });

    s.on("chat:closed", (data: { chatId: number }) => {
      setLocalMessages((prev) => {
        const updated = { ...prev };
        delete updated[data.chatId];
        return updated;
      });
    });

    s.on("chat:typing", (data: { chatId?: number }) => {
      if (data?.chatId && data.chatId !== activeChatId) return;
      setUserTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setUserTyping(false), 3000);
    });

    if (s.connected) {
      s.emit("agent:online");
    }

    return () => {
      s.off("agent:queue");
      s.off("agent:active_chats");
      s.off("agent:queue_updated");
      s.off("agent:chat_taken");
      s.off("chat:message");
      s.off("chat:closed");
      s.off("chat:typing");
    };
  }, [activeChatId]);

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent leading-[unset] pb-1">
            Live Support
          </h2>
          <p className="text-muted-foreground">Manage incoming support chat requests in real-time.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Queue Panel */}
        <div className="lg:col-span-1 overflow-hidden flex flex-col">
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
                  {loading ? (
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
        <div className="lg:col-span-2 overflow-hidden flex flex-col">
          <Card className="flex flex-col h-full border-border/50">
            {!activeChat ? (
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
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activeChat.userName}</p>
                        <p className="text-xs text-muted-foreground">{activeChat.userEmail}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-red-500 hover:text-red-600"
                      onClick={() => closeChat(activeChat.id)}
                    >
                      <Clock className="h-3 w-3 mr-1" /> Resolve
                    </Button>
                  </div>
                </CardHeader>

                <div className="flex border-b">
                  {activeChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={cn(
                        "px-3 py-2 text-xs font-medium border-b-2 transition-colors",
                        activeChatId === chat.id
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {chat.userName}
                    </button>
                  ))}
                </div>

                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {getMessages(activeChat.id).map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-2",
                          msg.senderType === "AGENT" ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className={cn(
                          "h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 border",
                          msg.senderType === "AGENT" ? "bg-primary/10 border-primary/20" : msg.senderType === "SYSTEM" ? "bg-muted border-dashed" : "bg-muted"
                        )}>
                          {msg.senderType === "AGENT" ? (
                            <Bot className="h-3.5 w-3.5 text-primary" />
                          ) : msg.senderType === "SYSTEM" ? (
                            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <div className={cn(
                          "flex flex-col max-w-[75%] gap-1",
                          msg.senderType === "AGENT" ? "items-end" : "items-start"
                        )}>
                          <div className={cn(
                            "px-3 py-2 rounded-xl text-sm leading-relaxed",
                            msg.senderType === "AGENT"
                              ? "bg-primary text-primary-foreground"
                              : msg.senderType === "SYSTEM"
                              ? "bg-muted/30 border border-dashed text-muted-foreground italic text-xs"
                              : "bg-card border"
                          )}>
                            {msg.isAi ? (
                              <span className="text-xs italic opacity-70">[AI Context] {msg.message}</span>
                            ) : (
                              msg.message
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

                {userTyping && (
                  <div className="px-4 py-1.5 text-xs text-muted-foreground flex items-center gap-2 border-t bg-background/30">
                    <div className="flex gap-1">
                      <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" />
                      <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                    {activeChat?.userName || "User"} is typing...
                  </div>
                )}

                <div className="p-3 border-t flex-shrink-0">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2"
                  >
                    <input
                      value={input}
                      onChange={(e) => { setInput(e.target.value); emitAgentTyping(); }}
                      placeholder="Type your reply..."
                      className="flex-1 bg-muted/50 border-none focus:ring-1 focus:ring-primary/30 rounded-xl px-3 py-2 text-sm outline-none transition-all"
                    />
                    <Button type="submit" size="icon" disabled={!input.trim()} className="rounded-xl h-9 w-9">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Stats Panel */}
        <div className="lg:col-span-1 overflow-hidden flex flex-col">
          <Card className="flex flex-col h-full border-border/50">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-violet-500" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
