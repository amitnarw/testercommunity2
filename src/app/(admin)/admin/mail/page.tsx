"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppPagination } from "@/components/app-pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Send,
  ArrowLeft,
  Pencil,
  Inbox,
  Reply,
  Trash2,
  X,
  Minimize2,
  Clock,
  User,
  Mail as MailIcon,
} from "lucide-react";
import {
  useAdminMails,
  useMailThread,
  useSendMailReply,
  useMarkMailRead,
  useDeleteMail,
  useSendNewEmail,
} from "@/hooks/useAdmin";
import { useMailSocket } from "@/hooks/useMailSocket";

const FROM_OPTIONS = [
  "support@system.intesters.com",
  "pro-support@system.intesters.com",
  "pro-billing@system.intesters.com",
  "pro-info@system.intesters.com",
  "noreply@system.intesters.com",
];

const PAGE_SIZE = 50;

function formatRowDate(date: string) {
  const d = new Date(date);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  if (isYesterday) return "Yesterday";

  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays < 7) {
    return d.toLocaleDateString("en-US", { weekday: "short" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDateGroupLabel(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays < 7) return "This week";

  const nowMonth = now.getMonth();
  const nowYear = now.getFullYear();
  const dMonth = d.getMonth();
  const dYear = d.getFullYear();

  if (dMonth === nowMonth && dYear === nowYear) return "This month";
  if (dYear === nowYear) {
    return d.toLocaleDateString("en-US", { month: "long" });
  }
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getInitials(email: string, name?: string): string {
  if (name) {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1) return parts[0][0].toUpperCase();
  }
  return email[0]?.toUpperCase() || "?";
}

function getAvatarColor(email: string): string {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++)
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function AdminMailPage() {
  const [tabRead, setTabRead] = useState<"All" | "Read" | "Unread" | "Sent">("All");
  const [page, setPage] = useState(1);
  const [selectedMailId, setSelectedMailId] = useState<number | null>(null);
  const [replyFrom, setReplyFrom] = useState(FROM_OPTIONS[0]);
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [composeMinimized, setComposeMinimized] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeFrom, setComposeFrom] = useState(FROM_OPTIONS[0]);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeSending, setComposeSending] = useState(false);
  const [composeError, setComposeError] = useState("");

  useMailSocket();

  const apiStatus = tabRead === "All" ? undefined : tabRead === "Read" ? "READ" : tabRead === "Sent" ? "REPLIED" : "UNREAD";
  const { data, isPending, isError, error, refetch } = useAdminMails({
    status: apiStatus,
    page: String(page),
    limit: String(PAGE_SIZE),
  });

  const { data: thread, refetch: refetchThread } = useMailThread(selectedMailId);
  const markReadMutation = useMarkMailRead();
  const deleteMutation = useDeleteMail();
  const sendReplyMutation = useSendMailReply();
  const sendNewEmailMutation = useSendNewEmail();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingMailId, setDeletingMailId] = useState<number | null>(null);

  const replyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    replyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages]);

  const mails = data?.mails || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const groupedMails = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const mail of mails) {
      const label = getDateGroupLabel(mail.lastMessageAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(mail);
    }
    return groups;
  }, [mails]);

  const handleSelectMail = (id: number, currentStatus: string) => {
    setSelectedMailId(id);
    if (currentStatus === "UNREAD") {
      markReadMutation.mutate(id);
    }
  };

  const handleDelete = (id: number) => {
    setDeletingMailId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingMailId) return;
    deleteMutation.mutate(deletingMailId, {
      onSuccess: () => {
        if (selectedMailId === deletingMailId) setSelectedMailId(null);
        setShowDeleteDialog(false);
        setDeletingMailId(null);
      },
    });
  };

  const handleSendReply = async () => {
    if (!selectedMailId || !replyBody.trim() || !replyFrom) return;
    setSending(true);
    try {
      await sendReplyMutation.mutateAsync({
        mailId: selectedMailId,
        fromAddress: replyFrom,
        body: replyBody,
      });
      setReplyBody("");
      refetchThread();
    } finally {
      setSending(false);
    }
  };

  const handleSendNewEmail = async () => {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim() || !composeFrom) return;
    setComposeSending(true);
    setComposeError("");
    try {
      const result = await sendNewEmailMutation.mutateAsync({
        toEmail: composeTo,
        fromAddress: composeFrom,
        subject: composeSubject,
        body: composeBody,
      });
      if (result?.emailDeliveryFailed) {
        setComposeError("Message saved but email delivery failed. Recipient may not receive it.");
      } else {
        setShowCompose(false);
        setComposeMinimized(false);
        setComposeTo("");
        setComposeSubject("");
        setComposeBody("");
        setComposeError("");
      }
    } catch (err: any) {
      setComposeError(err?.message || "Failed to send email");
    } finally {
      setComposeSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {selectedMailId ? (
          <ThreadView
            thread={thread}
            onBack={() => setSelectedMailId(null)}
            onDelete={handleDelete}
            replyFrom={replyFrom}
            setReplyFrom={setReplyFrom}
            replyBody={replyBody}
            setReplyBody={setReplyBody}
            sending={sending}
            handleSendReply={handleSendReply}
            replyEndRef={replyEndRef}
          />
        ) : (
          <>
            {/* ══════════ TOOLBAR ══════════ */}
            <div className="shrink-0 flex items-center justify-between px-2 sm:px-6 py-1.5 border-b">
              <Tabs value={tabRead} onValueChange={(val) => { setTabRead(val as "All" | "Read" | "Unread" | "Sent"); setPage(1); }}>
                <TabsList>
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Read">Read</TabsTrigger>
                  <TabsTrigger value="Unread">Unread</TabsTrigger>
                  <TabsTrigger value="Sent">Sent</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                className="rounded-full gap-2 sm:px-5 h-8 shadow-sm"
                size="sm"
                onClick={() => setShowCompose(true)}
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Compose</span>
              </Button>
            </div>

            {/* ══════════ MAIL LIST ══════════ */}
            <div className="flex-1 overflow-y-auto">
              {isPending ? (
                <div>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-4 sm:px-6 py-3 border-b border-border/40"
                    >
                      <Skeleton className="w-4 h-4 rounded shrink-0" />
                      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                      <Skeleton className="h-4 w-32 shrink-0" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-16 shrink-0" />
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center h-40 text-destructive text-sm">
                  {(error as Error)?.message || "Failed to load mails"}
                </div>
              ) : mails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
                  <Inbox className="w-16 h-16 mb-4 opacity-10" />
                  <p className="text-sm">No conversations found</p>
                </div>
              ) : (
                Object.entries(groupedMails).map(([groupLabel, groupMails]) => (
                  <div key={groupLabel}>
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
                      {groupLabel}
                    </div>
                    {groupMails.map((mail: any) => (
                      <MailRow
                        key={mail.id}
                        mail={mail}
                        onOpen={() => handleSelectMail(mail.id, mail.status)}
                      />
                    ))}
                  </div>
                ))
              )}
              {!isPending && !isError && mails.length > 0 && (
                <AppPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Compose Floating Panel ── */}
      {showCompose && (
        <div
          className={`fixed bottom-0 right-4 md:right-8 z-50 ${
            composeMinimized ? "w-72" : "w-[540px] max-w-[calc(100vw-2rem)]"
          }`}
        >
          <div className="bg-background border rounded-t-lg shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 bg-foreground text-background rounded-t-lg">
              <span className="text-sm font-medium">New Message</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setComposeMinimized(!composeMinimized)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setShowCompose(false);
                    setComposeMinimized(false);
                    setComposeTo("");
                    setComposeSubject("");
                    setComposeBody("");
                    setComposeError("");
                  }}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!composeMinimized && (
              <>
                <div className="px-4 py-2">
                  <div className="flex items-center gap-2 border-b py-1.5">
                    <label className="text-xs text-muted-foreground w-10 shrink-0">To</label>
                    <Input
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      className="border-0 p-0 h-auto text-sm focus-visible:ring-0 shadow-none"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="flex items-center gap-2 border-b py-1.5">
                    <label className="text-xs text-muted-foreground w-10 shrink-0">From</label>
                    <Select value={composeFrom} onValueChange={setComposeFrom}>
                      <SelectTrigger className="border-0 p-0 h-auto text-sm w-auto gap-1 shadow-none focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FROM_OPTIONS.map((addr) => (
                          <SelectItem key={addr} value={addr} className="text-xs">{addr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 border-b py-1.5">
                    <label className="text-xs text-muted-foreground w-10 shrink-0">Subject</label>
                    <Input
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      className="border-0 p-0 h-auto text-sm focus-visible:ring-0 shadow-none"
                      placeholder="Subject"
                    />
                  </div>
                </div>
                <div className="px-4 pb-2 flex-1">
                  <Textarea
                    placeholder="Write your message..."
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    rows={10}
                    className="border-0 focus-visible:ring-0 resize-none text-sm p-0"
                  />
                </div>
                {composeError && (
                  <p className="px-4 pb-2 text-sm text-destructive">{composeError}</p>
                )}
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <Button
                    className="rounded-full px-6"
                    onClick={handleSendNewEmail}
                    disabled={!composeTo.trim() || !composeSubject.trim() || !composeBody.trim() || composeSending}
                  >
                    {composeSending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    ) : (
                      <Send className="w-4 h-4 mr-1.5" />
                    )}
                    Send
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowCompose(false);
                      setComposeMinimized(false);
                      setComposeTo("");
                      setComposeSubject("");
                      setComposeBody("");
                      setComposeError("");
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation and all its messages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingMailId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIL ROW
   ══════════════════════════════════════════════════ */
function MailRow({
  mail,
  onOpen,
}: {
  mail: any;
  onOpen: () => void;
}) {
  const isOutbound = FROM_OPTIONS.includes(mail.fromEmail);
  const displayName = isOutbound
    ? mail.toAddress
    : mail.fromName || mail.fromEmail;
  const isUnread = mail.status === "UNREAD";
  const initials = getInitials(
    isOutbound ? mail.toAddress : mail.fromEmail,
    isOutbound ? undefined : mail.fromName
  );
  const avatarColor = getAvatarColor(
    isOutbound ? mail.toAddress : mail.fromEmail
  );
  const snippet =
    mail.snippet ||
    (typeof mail.lastMessagePreview === "string"
      ? mail.lastMessagePreview
      : "");

  return (
    <div
      onClick={onOpen}
      className={`group flex items-center gap-2 sm:gap-4 px-2 sm:px-6 py-2.5 border-b border-border/30 transition-colors cursor-pointer ${
        isUnread
          ? "bg-background hover:bg-muted/40"
          : "bg-background hover:bg-muted/30"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0 ${avatarColor}`}
      >
        {initials}
      </div>

      {/* Sender */}
      <span
        className={`w-28 sm:w-44 truncate text-[13px] shrink-0 ${
          isUnread
            ? "font-bold text-foreground"
            : "text-foreground/70 font-normal"
        }`}
      >
        {displayName}
      </span>

      {/* Subject + snippet */}
      <div className="flex-1 min-w-0 flex items-baseline gap-1.5">
        <span
          className={`truncate text-[13px] ${
            isUnread
              ? "font-bold text-foreground"
              : "text-foreground/70 font-normal"
          }`}
        >
          {mail.subject}
        </span>
        {snippet && (
          <>
            <span className="text-muted-foreground/50 text-[13px] shrink-0">
              —
            </span>
            <span className="truncate text-[13px] text-muted-foreground/80 font-normal">
              {snippet}
            </span>
          </>
        )}
      </div>

      {/* Date */}
      <span
        className={`text-[12px] whitespace-nowrap shrink-0 min-w-[60px] text-right tabular-nums ${
          isUnread ? "text-foreground font-semibold" : "text-muted-foreground"
        }`}
      >
        {formatRowDate(mail.lastMessageAt)}
      </span>

      {/* Unread indicator */}
      <div className="w-3 shrink-0 ml-1 flex justify-end">
        {isUnread && (
          <div className="w-2 h-2 rounded-full bg-rose-500" />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   THREAD VIEW
   ══════════════════════════════════════════════════ */
function ThreadView({
  thread,
  onBack,
  onDelete,
  replyFrom,
  setReplyFrom,
  replyBody,
  setReplyBody,
  sending,
  handleSendReply,
  replyEndRef,
}: {
  thread: any;
  onBack: () => void;
  onDelete: (id: number) => void;
  replyFrom: string;
  setReplyFrom: (v: string) => void;
  replyBody: string;
  setReplyBody: (v: string) => void;
  sending: boolean;
  handleSendReply: () => void;
  replyEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const firstMessage = thread.messages?.[0];
  const messageCount = thread.messages?.length || 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-2 px-2 sm:px-6 py-2 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-foreground truncate">
            {thread.subject}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(thread.id)}
          title="Delete conversation"
          className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Thread Details */}
      <div className="shrink-0 px-4 sm:px-6 py-3 border-b bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MailIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground">
                  {firstMessage?.fromEmail || thread.fromEmail}
                </span>
                {firstMessage?.fromName && (
                  <span className="text-xs text-muted-foreground">
                    ({firstMessage.fromName})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <MailIcon className="w-3 h-3" />
                  {thread.toAddress}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pl-12">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {firstMessage && formatFullDate(firstMessage.createdAt)}
            </span>
            <span>{messageCount} message{messageCount !== 1 ? "s" : ""}</span>
            {thread.user && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                <User className="w-3 h-3 mr-1" />
                {thread.user.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-6">
        <div className="max-w-3xl space-y-0 mx-auto">
          {(thread.messages || []).map((msg: any, idx: number) => (
            <ThreadMessage
              key={msg.id}
              message={msg}
              isLast={idx === (thread.messages || []).length - 1}
            />
          ))}
          <div ref={replyEndRef as React.Ref<HTMLDivElement>} />
        </div>
      </div>

      {/* Reply Box */}
      <div className="shrink-0 border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="border rounded-lg">
            <div className="px-3 py-2 border-b flex items-center gap-2">
              <Reply className="w-4 h-4 text-muted-foreground shrink-0" />
              <Select value={replyFrom} onValueChange={setReplyFrom}>
                <SelectTrigger className="border-0 p-0 h-auto text-xs w-auto gap-1 shadow-none focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FROM_OPTIONS.map((addr) => (
                    <SelectItem key={addr} value={addr} className="text-xs">
                      {addr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Write your reply..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={4}
              className="border-0 focus-visible:ring-0 resize-none text-sm"
            />
            <div className="flex items-center justify-between px-3 py-2">
              <Button
                size="sm"
                onClick={handleSendReply}
                disabled={!replyBody.trim() || sending}
                className="rounded-full px-5"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : (
                  <Send className="w-4 h-4 mr-1.5" />
                )}
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   THREAD MESSAGE
   ══════════════════════════════════════════════════ */
function ThreadMessage({ message }: { message: any; isLast: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const isOutbound = message.direction === "OUTBOUND";
  const initials = getInitials(message.fromEmail);
  const avatarColor = getAvatarColor(message.fromEmail);

  return (
    <div className="border-b border-border/40 last:border-b-0">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 py-4 text-left hover:bg-muted/30 transition-colors rounded-lg px-1"
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0 ${avatarColor}`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate">
              {message.fromEmail}
            </span>
            {isOutbound && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 border-primary/30 text-primary"
              >
                me
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatFullDate(message.createdAt)}
          </span>
        </div>
      </button>

      {!collapsed && (
        <div className="pb-4 pl-[52px] pr-1">
          {isOutbound ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none break-words text-sm leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: message.body }}
            />
          ) : (
            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
              {message.body}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
