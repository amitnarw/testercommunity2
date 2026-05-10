"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { type UIMessage as Message, DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, Bot, Ticket, ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { getSupportHistory, saveChatMessage } from "@/lib/apiCalls";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/transition-link";

export function SupportChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  // Responsive listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [initialHistoryLoaded, setInitialHistoryLoaded] = useState(false);

  const setHistoryLoaded = (value: boolean) => {
    setInitialHistoryLoaded(value);
  };

  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isWaitingForGreeting, setIsWaitingForGreeting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayedMessages, setDisplayedMessages] = useState<any[]>([]);

  // Only visible on /support or /help paths
  const isSupportPath = pathname?.startsWith("/support") || 
                       pathname?.startsWith("/help") || 
                       pathname?.startsWith("/tester/support");

  const chat = useChat({
    transport: new DefaultChatTransport({ api: "/api/support/chat" }),
    onFinish: async (message: any) => {
      try {
        await saveChatMessage({ message: message.content, role: "assistant" });
      } catch (err) {
        console.error("Failed to persist assistant message:", err);
      }
    },
  });

  const { 
    messages, 
    handleInputChange, 
    handleSubmit, 
    isLoading, 
    setMessages,
    sendMessage,
    input
  } = chat;

  // Polyfill input state since newer AI SDK versions removed it or changed it
  const [localInput, setLocalInput] = useState("");

  // Global event listener to open chat from other components
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-alex-chat", handleOpenChat);
    return () => window.removeEventListener("open-alex-chat", handleOpenChat);
  }, []);

  // Handle Input locally
  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput?.trim()) return;
    
    // Optimistically save user message to history
    saveChatMessage({ message: localInput, role: "user" }).catch(err => console.error("History save failed:", err));
    
    // Trigger AI response
    if (sendMessage) {
      sendMessage({ text: localInput });
    }
    setLocalInput("");
  };

  // Sync displayed messages
  useEffect(() => {
    setDisplayedMessages(messages);
  }, [messages]);

  // Load history OR Greeting on open
  useEffect(() => {
    if (isOpen && !initialHistoryLoaded) {
      console.log("SupportChat: Triggering history/greeting load...");
      setIsHistoryLoading(true);
      setHistoryLoaded(true); // set this synchronously so it never runs again
      
      getSupportHistory().then(history => {
        if (history && history.length > 0) {
          console.log("SupportChat: Loaded history:", history.length, "messages");
          const formatted = history.map((h: any, i: number) => ({
            id: `hist-${i}`,
            role: h.role,
            content: h.message
          }));
          setMessages(formatted);
          setIsHistoryLoading(false);
        } else {
          console.log("SupportChat: No history found, showing greeting...");
          // No history, show greeting with typing effect
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
      }).catch(err => {
        console.error("SupportChat: Failed to load support history:", err);
        setIsHistoryLoading(false);
        // Fallback to greeting if history fails
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

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [displayedMessages, isLoading, isWaitingForGreeting, isOpen]);

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
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-primary rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-tight whitespace-nowrap">Chat with Alex</span>
                  <span className="text-[10px] text-primary-foreground/70 leading-none">Support Online</span>
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
                    <Bot className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Alex @ inTesters</h3>
                    <p className="text-[10px] text-primary-foreground/80 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Online
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full hover:bg-white/10 text-primary-foreground">
                  <X className="h-5 w-5" />
                </Button>
              </header>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-background/50" ref={scrollRef}>
                <div className="space-y-4 pb-4">
                  {displayedMessages.map((m: any, index: number) => {
                    // Hide the assistant message while it's being streamed
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
                              <ReactMarkdown>
                                {m.content}
                              </ReactMarkdown>
                            </div>
                        </div>

                        {/* Tool Call Rendering */}
                        {m.toolInvocations?.map((toolInvocation: any) => {
                          const { toolCallId, toolName, state } = toolInvocation;
                          if (toolName === "create_ticket") {
                            return (
                              <div key={toolCallId} className="mt-2 p-3 bg-muted/50 rounded-xl border border-dashed flex items-center gap-3 w-full">
                                <Ticket className="h-4 w-4 text-primary" />
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Action: Support Ticket</p>
                                  <p className="text-xs truncate italic">
                                    {state === "result" ? "✅ Ticket created successfully" : "⏳ Working on your ticket..."}
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

              {/* Footer / Input */}
              <footer className="p-4 border-t bg-card/80 backdrop-blur-sm">
                <form
                  onSubmit={handleLocalSubmit}
                  className="relative flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    value={localInput}
                    onChange={(e) => setLocalInput(e.target.value)}
                    placeholder="How can Alex help you?"
                    autoFocus
                    className="flex-1 bg-muted/50 border-none focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !localInput?.trim()}
                    className="rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <div className="mt-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-4">
                    <TransitionLink 
                      href="/support/tickets" 
                      onClick={() => setIsOpen(false)}
                      className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      <Ticket className="h-3 w-3" />
                      Manage Support Tickets
                    </TransitionLink>
                    <TransitionLink 
                      href="/support" 
                      onClick={() => setIsOpen(false)}
                      className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      <HelpCircle className="h-3 w-3" />
                      Help Center
                    </TransitionLink>
                  </div>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
