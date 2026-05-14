"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { connectSupportSocket } from "@/lib/supportSocket";

interface ChatMessage {
  id: number;
  senderType: "USER" | "AGENT";
  senderName: string;
  message: string;
  isAi?: boolean;
  createdAt: string;
}

interface ActiveChat {
  id: number;
  userName: string;
  userEmail: string;
  userImage: string | null;
  messages: ChatMessage[];
  createdAt: string;
}

interface ChatPanelProps {
  chats: ActiveChat[];
  onCloseChat: (chatId: number) => void;
}

export function ChatPanel({ chats, onCloseChat }: ChatPanelProps) {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<number, ChatMessage[]>>({});
  const [userTyping, setUserTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingEmitRef = useRef(0);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0] || null;

  useEffect(() => {
    if (chats.length > 0 && !chats.find((c) => c.id === activeChatId)) {
      setActiveChatId(chats[0].id);
    }
    if (chats.length === 0) {
      setActiveChatId(null);
    }
  }, [chats, activeChatId]);

  useEffect(() => {
    const socket = connectSupportSocket();
    const handler = (data: { chatId: number } & ChatMessage) => {
      setLocalMessages((prev) => {
        const existing = prev[data.chatId] || [];
        if (existing.some((m) => m.id === data.id)) return prev;
        return { ...prev, [data.chatId]: [...existing, data] };
      });
    };
    socket.on("chat:message", handler);
    return () => { socket.off("chat:message", handler); };
  }, []);

  useEffect(() => {
    const socket = connectSupportSocket();
    const handler = (data: { chatId: number; reason: string }) => {
      setLocalMessages((prev) => {
        const updated = { ...prev };
        delete updated[data.chatId];
        return updated;
      });
    };
    socket.on("chat:closed", handler);
    return () => { socket.off("chat:closed", handler); };
  }, []);

  useEffect(() => {
    const socket = connectSupportSocket();
    const handler = (data: { chatId?: number }) => {
      if (data?.chatId && data.chatId !== activeChatId) return;
      setUserTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setUserTyping(false), 3000);
    };
    socket.on("chat:typing", handler);
    return () => {
      socket.off("chat:typing", handler);
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [activeChatId]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current && activeChatId) {
        const el = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
        if (el) el.scrollTop = el.scrollHeight;
      }
    });
  }, [activeChatId, localMessages, chats]);

  const getMessages = (chatId: number): ChatMessage[] => {
    const chat = chats.find((c) => c.id === chatId);
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
    const socket = connectSupportSocket();
    socket.emit("agent:send_message", { chatId: activeChat.id, message: input.trim() });
    setInput("");
    setUserTyping(false);
  };

  const emitAgentTyping = useCallback(() => {
    if (!activeChatId) return;
    const now = Date.now();
    if (now - lastTypingEmitRef.current > 2000) {
      lastTypingEmitRef.current = now;
      const socket = connectSupportSocket();
      if (socket.connected) {
        socket.emit("agent:typing", { chatId: activeChatId });
      }
    }
  }, [activeChatId]);

  if (!activeChat) {
    return (
      <Card className="flex flex-col h-full border-border/50">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Bot className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No active chat selected</p>
            <p className="text-xs text-muted-foreground/60">Take a chat from the queue to begin</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const messages = getMessages(activeChat.id);

  return (
    <Card className="flex flex-col h-full border-border/50">
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
            onClick={() => onCloseChat(activeChat.id)}
          >
            <X className="h-3 w-3 mr-1" /> Close
          </Button>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2",
                msg.senderType === "AGENT" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 border",
                msg.senderType === "AGENT" ? "bg-primary/10 border-primary/20" : "bg-muted"
              )}>
                {msg.senderType === "AGENT" ? (
                  <Bot className="h-3.5 w-3.5 text-primary" />
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
            <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 rounded-full bg-primary/40 animate-bounce" />
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
    </Card>
  );
}
