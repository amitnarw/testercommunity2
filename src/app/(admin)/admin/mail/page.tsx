"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail,
  MailOpen,
  Archive,
  Search,
  Loader2,
  Send,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { useAdminMails, useMailThread, useSendMailReply, useMarkMailRead, useArchiveMail, useSendNewEmail } from "@/hooks/useAdmin";
import { useMailSocket } from "@/hooks/useMailSocket";
import { useQueryClient } from "@tanstack/react-query";

const FROM_OPTIONS = [
  "support@intesters.com",
  "pro-support@intesters.com",
  "pro-billing@intesters.com",
  "pro-info@intesters.com",
  "noreply@intesters.com",
];

const STATUS_TABS = ["UNREAD", "ALL", "ARCHIVED"] as const;

function formatRelativeTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString();
}

export default function AdminMailPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string>("UNREAD");
  const [search, setSearch] = useState("");
  const [selectedMailId, setSelectedMailId] = useState<number | null>(null);
  const [replyFrom, setReplyFrom] = useState(FROM_OPTIONS[0]);
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeFrom, setComposeFrom] = useState(FROM_OPTIONS[0]);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeSending, setComposeSending] = useState(false);
  const [composeError, setComposeError] = useState("");

  useMailSocket();

  const { data, isPending, isError, error } = useAdminMails({
    status: status === "ALL" ? undefined : status,
    search: search || undefined,
  });

  const { data: thread, refetch: refetchThread } = useMailThread(selectedMailId);
  const markReadMutation = useMarkMailRead();
  const archiveMutation = useArchiveMail();
  const sendReplyMutation = useSendMailReply();
  const sendNewEmailMutation = useSendNewEmail();

  const replyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    replyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages]);

  const mails = data?.mails || [];
  const total = data?.total || 0;

  const handleSelectMail = (id: number, currentStatus: string) => {
    setSelectedMailId(id);
    if (currentStatus === "UNREAD") {
      markReadMutation.mutate(id);
    }
  };

  const handleArchive = (id: number) => {
    archiveMutation.mutate(id, {
      onSuccess: () => {
        if (selectedMailId === id) setSelectedMailId(null);
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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mail Inbox</h1>
          <p className="text-sm text-muted-foreground">
            {total} conversation{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="default" onClick={() => setShowCompose(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Compose
          </Button>
          {STATUS_TABS.map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={status === tab ? "default" : "outline"}
              onClick={() => { setStatus(tab); setSelectedMailId(null); }}
            >
              {tab === "UNREAD" && <Mail className="w-3.5 h-3.5 mr-1.5" />}
              {tab === "ALL" && <MailOpen className="w-3.5 h-3.5 mr-1.5" />}
              {tab === "ARCHIVED" && <Archive className="w-3.5 h-3.5 mr-1.5" />}
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by subject, from, or name..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={selectedMailId ? "hidden lg:block" : "block"}>
          <Card>
            <CardContent className="p-0">
              {isPending ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : isError ? (
                <p className="p-6 text-destructive">
                  {(error as Error)?.message || "Failed to load mails"}
                </p>
              ) : mails.length === 0 ? (
                <p className="p-6 text-muted-foreground">No mails found.</p>
              ) : (
                <div className="divide-y">
                  {mails.map((mail: any) => (
                    <button
                      key={mail.id}
                      onClick={() => handleSelectMail(mail.id, mail.status)}
                      className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                        selectedMailId === mail.id ? "bg-muted" : ""
                      } ${mail.status === "UNREAD" ? "font-semibold" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {mail.status === "UNREAD" ? (
                            <Mail className="w-4 h-4 text-primary shrink-0" />
                          ) : (
                            <MailOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                          <span className="truncate">{FROM_OPTIONS.includes(mail.fromEmail) ? mail.toAddress : (mail.fromName || mail.fromEmail)}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {mail.toAddress}
                          </Badge>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatRelativeTime(mail.lastMessageAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm truncate mt-0.5 text-muted-foreground">
                        {mail.subject}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className={!selectedMailId ? "hidden lg:block" : "block"}>
          {selectedMailId && thread ? (
            <Card className="flex flex-col h-full max-h-[80vh]">
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setSelectedMailId(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <p className="font-semibold text-sm truncate max-w-md">
                      {thread.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {FROM_OPTIONS.includes(thread.fromEmail) ? thread.toAddress : (thread.fromName || thread.fromEmail)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArchive(thread.id)}
                    disabled={thread.status === "ARCHIVED"}
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                  {thread.user && (
                    <Badge variant="secondary" className="text-xs">
                      User: {thread.user.name}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(thread.messages || []).map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.direction === "OUTBOUND" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.direction === "OUTBOUND"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {msg.direction === "OUTBOUND" ? msg.fromEmail : msg.fromEmail}
                        </span>
                        <span className="text-[10px] opacity-70">
                          {formatRelativeTime(msg.createdAt)}
                        </span>
                      </div>
                      {msg.direction === "INBOUND" ? (
                        <div className="text-sm whitespace-pre-wrap break-words">{msg.body}</div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: msg.body }} />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={replyEndRef} />
              </div>

              <div className="border-t p-3 space-y-2">
                <Select value={replyFrom} onValueChange={setReplyFrom}>
                  <SelectTrigger className="w-full text-xs">
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
                <Textarea
                  placeholder="Type your reply..."
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  rows={3}
                  className="text-sm resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSendReply}
                    disabled={!replyBody.trim() || sending}
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Send className="w-4 h-4 mr-1" />
                    )}
                    Send Reply
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="hidden lg:flex h-full min-h-[400px] items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select an email to view the thread</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showCompose} onOpenChange={(open) => { setShowCompose(open); if (!open) { setComposeTo(""); setComposeSubject(""); setComposeBody(""); setComposeError(""); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Compose New Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="To: email@example.com"
              value={composeTo}
              onChange={(e) => setComposeTo(e.target.value)}
            />
            <Select value={composeFrom} onValueChange={setComposeFrom}>
              <SelectTrigger className="w-full">
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
            <Input
              placeholder="Subject"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
            />
            <Textarea
              placeholder="Write your message..."
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              rows={8}
              className="text-sm resize-none"
            />
            {composeError && (
              <p className="text-sm text-destructive">{composeError}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowCompose(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSendNewEmail}
                disabled={!composeTo.trim() || !composeSubject.trim() || !composeBody.trim() || composeSending}
              >
                {composeSending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <Send className="w-4 h-4 mr-1" />
                )}
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}