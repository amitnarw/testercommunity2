"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import API_ROUTES from "@/lib/apiRoutes";
import api from "@/lib/axios";
import {
  Eye, User, Bot, Send, Loader2,
  MessageCircle, Shield, Info, Clock, RotateCcw, X, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LinkifyText } from "@/components/linkify-text";

interface Conversation {
  id: number;
  type: "LIVE_CHAT" | "TICKET" | "AI_CHAT";
  status: "OPEN" | "IN_PROGRESS" | "WAITING_AGENT" | "RESOLVED" | "CLOSED";
  category: string;
  subject: string | null;
  description: string | null;
  userId: string | null;
  assignedTo: string | null;
  createdAt: string;
  user: { name: string; email: string; image: string | null } | null;
  assignedAgent: { name: string; image: string | null } | null;
  _count: { messages: number };
}

interface Message {
  id: number;
  senderType: "USER" | "AGENT" | "AI" | "SYSTEM";
  senderName: string;
  content: string;
  isAi: boolean;
  createdAt: string;
}

interface ConversationDetail extends Conversation {
  messages: Message[];
}

const statusColors: Record<string, string> = {
  OPEN: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  WAITING_AGENT: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
  RESOLVED: "bg-green-500/20 text-green-600 dark:text-green-400",
  CLOSED: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
};

const typeColors: Record<string, string> = {
  LIVE_CHAT: "bg-sky-500/20 text-sky-600 dark:text-sky-400",
  TICKET: "bg-rose-500/20 text-rose-600 dark:text-rose-400",
  AI_CHAT: "bg-violet-500/20 text-violet-600 dark:text-violet-400",
};

const STATUS_FILTERS: { label: string; value: Conversation["status"] | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

export function TicketsTable() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ConversationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(30);
  const [statusFilter, setStatusFilter] = useState<Conversation["status"] | "ALL">("ALL");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(() => {
    setLoading(true);
    let url = API_ROUTES.ADMIN + "/support/conversations?type=TICKET";
    if (statusFilter !== "ALL") {
      url += `&status=${statusFilter}`;
    }
    api
      .get(url)
      .then((res) => setConversations(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          fetchConversations();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const handleRefresh = () => {
    fetchConversations();
    setSecondsUntilRefresh(30);
  };

  const openDetail = async (id: number) => {
    setDetailLoading(true);
    setSelected(null);
    setReplyText("");
    try {
      const res = await api.get(API_ROUTES.ADMIN + `/support/conversations/${id}`);
      setSelected(res.data?.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selected || isSending) return;

    setIsSending(true);
    try {
      await api.post(API_ROUTES.ADMIN + `/support/conversations/${selected.id}/messages`, {
        message: replyText.trim(),
      });
      setReplyText("");
      const res = await api.get(API_ROUTES.ADMIN + `/support/conversations/${selected.id}`);
      setSelected(res.data?.data || null);
      fetchConversations();
      setSecondsUntilRefresh(30);
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = async () => {
    if (!selected) return;
    try {
      await api.post(API_ROUTES.ADMIN + `/support/conversations/${selected.id}/close`, {});
      const res = await api.get(API_ROUTES.ADMIN + `/support/conversations/${selected.id}`);
      setSelected(res.data?.data || null);
      fetchConversations();
      setSecondsUntilRefresh(30);
    } catch (err) {
      console.error("Failed to close conversation:", err);
    }
  };

  const isConversationClosed = selected?.status === "CLOSED";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_FILTERS.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={statusFilter === opt.value ? "default" : "outline"}
              onClick={() => setStatusFilter(opt.value)}
              className="text-xs h-8"
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Auto-refresh in {secondsUntilRefresh}s</span>
          <Button variant="ghost" size="sm" onClick={handleRefresh} className="h-8 w-8 p-0" title="Refresh now">
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
        </div>
      </div>
      <Card className="border-border/50 grid grid-cols-1">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Agent</TableHead>
                <TableHead className="hidden md:table-cell">Messages</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : conversations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No conversations found
                  </TableCell>
                </TableRow>
              ) : (
                conversations.map((conv) => (
                  <TableRow key={conv.id}>
                    <TableCell>
                      <Badge className={`text-xs ${typeColors[conv.type] || ""}`}>
                        {conv.type.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm max-w-[200px] truncate">
                      {conv.subject || "(No subject)"}
                    </TableCell>
                    <TableCell className="text-sm">{conv.user?.name || "Anonymous"}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${statusColors[conv.status] || ""}`}>
                        {conv.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {conv.assignedAgent?.name || "-"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {conv._count.messages}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {format(new Date(conv.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openDetail(conv.id)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected || detailLoading} onOpenChange={(open) => { if (!open) { setSelected(null); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col px-2 sm:px-4 w-[95%] overflow-hidden">
          <DialogHeader className="relative">
            <DialogTitle className="text-start">
              {selected?.subject || "Conversation Details"}
            </DialogTitle>
            <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogDescription>
              <span className="flex items-center justify-between gap-2 w-full">
                <span className="text-start">
                  {selected?.user?.name || "User"} &middot; {selected?.type?.replace(/_/g, " ")} &middot;{" "}
                  <span className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold",
                    selected?.status ? statusColors[selected.status] : ""
                  )}>
                    {selected?.status?.replace(/_/g, " ")}
                  </span>
                </span>
                {selected && selected.status !== "CLOSED" && selected.status !== "RESOLVED" && (
                  <span className="shrink-0 sm:mr-10">
                    <Button variant="outline" size="sm" onClick={handleClose} className="text-[11px] h-7 px-2.5 rounded-lg">
                      Mark Resolved
                    </Button>
                  </span>
                )}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-6 p-1 pr-3">
              <div className="flex items-center gap-3 px-4">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-black tracking-tight">Conversation <span className="text-primary italic">History</span></h2>
              </div>

              {detailLoading ? (
                <div className="space-y-2 px-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : selected?.messages?.length ? (
                <div className="space-y-6 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:to-transparent">
                  {selected.messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative pl-16"
                    >
                      <div className={cn(
                        "absolute left-5 top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background z-10",
                        msg.senderType === "USER" ? "bg-primary text-primary-foreground" :
                          msg.senderType === "AGENT" ? "bg-emerald-500 text-white" :
                            msg.senderType === "AI" ? "bg-violet-500 text-white" :
                              "bg-muted text-muted-foreground"
                      )}>
                        {msg.senderType === "USER" ? <User className="h-3 w-3" /> :
                          msg.senderType === "AGENT" ? <Shield className="h-3 w-3" /> :
                            msg.senderType === "AI" ? <Bot className="h-3 w-3" /> :
                              <Info className="h-3 w-3" />}
                      </div>

                      <Card className="p-6 rounded-[24px] border-none shadow-xl shadow-primary/5 bg-card hover:shadow-primary/10 transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-black text-sm uppercase tracking-widest text-primary/60">
                            {msg.senderName || (
                              msg.senderType === "USER" ? "User" :
                                msg.senderType === "AGENT" ? "Support Agent" :
                                  msg.senderType === "AI" ? "AI Assistant" :
                                    "System"
                            )}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                            {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                          {msg.isAi ? (
                            <span className="italic opacity-70">[AI] <LinkifyText text={msg.content} /></span>
                          ) : msg.senderType === "SYSTEM" ? (
                            msg.content
                          ) : (
                            <LinkifyText text={msg.content} />
                          )}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <Card className="mx-4 p-12 text-center border-2 border-dashed border-muted-foreground/10 rounded-[32px] bg-card/50">
                  <div className="h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-primary/30" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Awaiting Response</h3>
                  <p className="text-muted-foreground">This conversation has no messages yet.</p>
                </Card>
              )}
            </div>
          </div>

          {/* Reply Input */}
          <div className="border-t pt-2 mt-1">
            {selected && !isConversationClosed ? (
              <Card className="p-3 rounded-[24px] border-none shadow-xl shadow-primary/5 bg-card">
                {selected.status === "RESOLVED" && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 text-sm font-medium">
                    <RotateCcw className="h-4 w-4" />
                    This conversation is resolved. Sending a message will reopen it.
                  </div>
                )}
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    className="min-h-[56px] rounded-2xl resize-none border-border/50 bg-muted/30 focus-visible:ring-primary/30 flex-1"
                    disabled={isSending}
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || isSending}
                    className="self-end h-10 w-10 rounded-2xl shrink-0"
                    size="icon"
                  >
                    {isSending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </Card>
            ) : selected && isConversationClosed ? (
              <Card className="p-6 rounded-[24px] border-2 border-dashed border-muted-foreground/10 bg-card/50 text-center">
                <p className="text-muted-foreground text-sm font-medium">
                  This conversation is closed.
                </p>
              </Card>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
