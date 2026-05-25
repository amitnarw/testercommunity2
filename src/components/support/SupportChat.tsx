"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Bot, Ticket, HelpCircle, Headphones, Loader2, AlertCircle, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/transition-link";
import { useSupportChat } from "@/hooks/useSupportChat";

export function SupportChat() {
  const pathname = usePathname();
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [localInput, setLocalInput] = useState("");
  const [humanInput, setHumanInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const humanScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const {
    chatMode, agentsOnline,
    displayedMessages, isLoading, isWaitingForGreeting, sendAiMessage,
    humanMessages, agentName, agentTyping, sendingMessage, queuePosition,
    sendHumanMessage, emitHumanTyping,
    ticketSubmitted,
    errorMessage, clearError, aiError,
    requestHumanChat, handleEndChat, handleBackToAlex,
    chooseAlex, openOfflineOptions,
    isOpen, setIsOpen,
  } = useSupportChat(chat);

  const getTextContent = (m: any): string => {
    let text = "";
    if (m.parts && Array.isArray(m.parts)) {
      text = m.parts
        .filter((p: any) => p.type === "text" && p.text)
        .map((p: any) => p.text)
        .join("\n");
    }
    if (!text && m.content && typeof m.content === "string") text = m.content;
    if (text) text = text.replace(/\u2014/g, ", ");
    return text;
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput?.trim()) return;
    sendAiMessage(localInput);
    setLocalInput("");
  };

  const handleHumanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanInput.trim()) return;
    sendHumanMessage(humanInput.trim());
    setHumanInput("");
  };

  const handleOpenTicketPage = () => {
    setIsOpen(false);
    router.push("/support/tickets/new");
  };

  if (!isSupportPath) return null;

  return (
    <div className="fixed z-50 flex flex-col items-end bottom-8 right-4 sm:right-8">
      <motion.div
        layout
        initial={false}
        animate={{
          width: isOpen ? (windowWidth < 640 ? "calc(100vw - 32px)" : 380) : 180,
          height: isOpen ? "70vh" : 52,
          borderRadius: isOpen ? 16 : 26,
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
                  <span className="font-bold text-xs tracking-tight whitespace-nowrap">Chat with agent</span>
                  <span className="text-xs text-primary-foreground/70 leading-none">AI + Support</span>
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
                    ) : (
                      <Bot className="h-6 w-6 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">
                      {chatMode === "HUMAN" ? `${agentName} @ inTesters` :
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
                        chatMode === "OFFLINE_OPTIONS" ? "bg-gray-400" :
                        "bg-green-400"
                      )} />
                      {chatMode === "WAITING" ? "Connecting..." :
                       chatMode === "HUMAN" ? "Live Agent" :
                       chatMode === "CHECKING" ? "Checking availability..." :
                       chatMode === "OFFLINE_OPTIONS" ? "Agent Offline" :
                       "AI Assistant"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {(chatMode === "AI" || chatMode === "HUMAN" || chatMode === "WAITING") && (
                    <Button variant="ghost" size="icon" onClick={handleEndChat} title="End chat" className="h-8 w-8 rounded-full hover:bg-white/10 text-primary-foreground">
                      <Power className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full hover:bg-white/10 text-primary-foreground">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </header>

              {/* AI Mode */}
              {chatMode === "AI" && (
                <>
                  <ScrollArea className="flex-1 p-4 bg-background/50" ref={scrollRef}>
                    <div className="space-y-4 pb-4">
                      {displayedMessages.map((m: any) => {
                        const textContent = getTextContent(m);
                        const hasOnlyTools = !textContent && m.toolInvocations?.length > 0;

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
                              {textContent && (
                                <div className={cn(
                                  "px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed",
                                  m.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-card border rounded-tl-none"
                                )}>
                                  <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                    <ReactMarkdown>{textContent}</ReactMarkdown>
                                  </div>
                                </div>
                              )}
                              {m.toolInvocations?.map((toolInvocation: any) => {
                                const { toolCallId, toolName, state, result } = toolInvocation;

                                if (toolName === "create_ticket") {
                                  const isError = state === "result" && result && !result.success;
                                  return (
                                    <div key={toolCallId} className={cn(
                                      "mt-2 p-3 rounded-xl border border-dashed flex items-center gap-3 w-full",
                                      isError ? "bg-destructive/10 border-destructive/30" : "bg-muted/50"
                                    )}>
                                      <Ticket className={cn("h-4 w-4", isError ? "text-destructive" : "text-primary")} />
                                      <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Support Ticket</p>
                                        <p className={cn("text-xs truncate italic", isError && "text-destructive")}>
                                          {isError ? "Failed to create ticket. Please try again." :
                                           state === "result" ? `Ticket #${result?.ticketId || ""} created successfully` :
                                           "Creating ticket..."}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }

                                if (toolName === "transfer_to_human") {
                                  return (
                                    <div key={toolCallId} className="mt-2 p-3 bg-muted/50 rounded-xl border border-dashed flex items-center gap-3 w-full">
                                      <Headphones className="h-4 w-4 text-primary" />
                                      <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Human Support</p>
                                        <p className="text-xs truncate italic">
                                          {state === "result" ? "Transferring you to a support agent..." : "Connecting to support..."}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }

                                return null;
                              })}
                            </div>
                          </div>
                        );
                      })}

                      {(isWaitingForGreeting || (chat.status === "submitted" && (displayedMessages.length === 0 || displayedMessages[displayedMessages.length - 1]?.role === "user"))) && (
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
                    {(errorMessage || aiError) && (
                      <div className="mb-3 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 text-xs text-destructive">
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="flex-1">{errorMessage || aiError?.message || "Something went wrong. Please try again."}</span>
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
                        {agentsOnline && (
                          <button
                            onClick={requestHumanChat}
                            className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                          >
                            <Headphones className="h-3 w-3" />
                            Talk to a human
                          </button>
                        )}
                        {!ticketSubmitted && (
                          <button
                            onClick={openOfflineOptions}
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
                    <p className="mt-2 text-[9px] text-muted-foreground/60 text-center leading-tight">
                      This conversation is not saved. It will be gone on page reload. Create a ticket if you need a follow-up.
                    </p>
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
                  <Button variant="ghost" size="sm" className="mt-4 text-xs text-muted-foreground" onClick={handleBackToAlex}>
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
                  <p className="text-sm text-muted-foreground text-center">Checking agent availability...</p>
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
                    <Button onClick={handleOpenTicketPage} className="rounded-2xl h-12 font-semibold w-full shadow-lg">
                      <Ticket className="h-4 w-4 mr-2" />
                      Submit a Support Ticket
                    </Button>
                    <Button variant="outline" onClick={chooseAlex} className="rounded-2xl h-12 font-semibold w-full">
                      <Bot className="h-4 w-4 mr-2" />
                      Chat with Alex
                    </Button>
                  </div>
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
                    <div className="flex gap-3 animate-in fade-in duration-300 px-4 py-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary" />
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
                    <p className="mt-2 text-[9px] text-muted-foreground/60 text-center leading-tight">
                      This chat is not recorded. Ask the agent to create a ticket if you need a follow-up.
                    </p>
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
