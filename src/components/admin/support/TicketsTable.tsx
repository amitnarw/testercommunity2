"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Eye, User, Bot, Headphones, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function TicketsTable() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ConversationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("TICKET");
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = () => {
    setLoading(true);
    const params = typeFilter !== "ALL" ? `?type=${typeFilter}` : "";
    api
      .get(API_ROUTES.ADMIN + "/support/conversations" + params)
      .then((res) => setConversations(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchConversations(); }, [typeFilter]);

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
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = async () => {
    if (!selected) return;
    try {
      await api.post(API_ROUTES.ADMIN + `/support/conversations/${selected.id}/close`);
      const res = await api.get(API_ROUTES.ADMIN + `/support/conversations/${selected.id}`);
      setSelected(res.data?.data || null);
      fetchConversations();
    } catch (err) {
      console.error("Failed to close conversation:", err);
    }
  };

  const isConversationClosed = selected?.status === "CLOSED";

  return (
    <>
      {/* Type Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { value: "TICKET", label: "Tickets" },
          { value: "ALL", label: "All" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTypeFilter(tab.value)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              typeFilter === tab.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/30 text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
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
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col px-2 sm:px-4 w-[95%]">
          <DialogHeader>
            <DialogTitle>
              {selected?.subject || "Conversation Details"}
            </DialogTitle>
            <DialogDescription>
              {selected?.user?.name || "User"} &middot; {selected?.type?.replace(/_/g, " ")} &middot;{" "}
              <span className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold",
                selected?.status ? statusColors[selected.status] : ""
              )}>
                {selected?.status?.replace(/_/g, " ")}
              </span>
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 max-h-[50vh]">
            <div className="space-y-4 p-1">
              {detailLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : selected?.messages?.length ? (
                <>
                  {selected.messages.map((msg) => (
                    <div key={msg.id} className={cn("flex gap-3", msg.senderType === "USER" ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                        msg.senderType === "AGENT" ? "bg-primary/10 border-primary/20" :
                        msg.senderType === "SYSTEM" ? "bg-muted border-dashed" : "bg-muted"
                      )}>
                        {msg.senderType === "AGENT" ? <Bot className="h-4 w-4 text-primary" /> :
                         msg.senderType === "SYSTEM" ? <Headphones className="h-4 w-4 text-muted-foreground" /> :
                         <User className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className={cn("flex flex-col max-w-[75%] min-w-0 gap-1", msg.senderType === "USER" ? "items-end" : "items-start")}>
                        <div className={cn(
                          "px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-all",
                          msg.senderType === "USER" ? "bg-primary text-primary-foreground rounded-tr-none" :
                          msg.senderType === "SYSTEM" ? "bg-muted/30 border border-dashed rounded-tl-none text-muted-foreground italic text-xs" :
                          "bg-card border rounded-tl-none"
                        )}>
                          {msg.isAi ? <span className="italic opacity-70">[AI] {msg.content}</span> : msg.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No messages in this conversation.</p>
              )}
            </div>
          </ScrollArea>

          {/* Reply Input */}
          <div className="border-t pt-4 mt-2 space-y-3">
            {selected && !isConversationClosed ? (
              <>
                <div className="flex flex-row items-end justify-center gap-2">
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
                    className="min-h-[60px] rounded-xl resize-none flex-1 min-w-0 w-auto"
                    disabled={isSending}
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || isSending}
                    className="shrink-0"
                    size="icon"
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex gap-2 justify-end">
                  {selected.status !== "CLOSED" && selected.status !== "RESOLVED" && (
                    <Button variant="outline" size="sm" onClick={handleClose} className="text-xs">
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </>
            ) : selected && isConversationClosed ? (
              <p className="text-center text-sm text-muted-foreground py-2">
                This conversation is closed.
              </p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
