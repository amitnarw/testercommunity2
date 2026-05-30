"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  User,
  Shield,
  Calendar,
  Loader2,
  Sparkles,
  ArrowRight,
  Send,
  Info,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { BackButton } from "@/components/back-button";
import { LinkifyText } from "@/components/linkify-text";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { FeedbackModal } from "@/components/feedback-modal";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import API_ROUTES from "@/lib/apiRoutes";
import { toast } from "@/hooks/use-toast";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"RESOLVED" | "CLOSED" | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error";
    title: string;
    description: string;
  }>({ open: false, status: "success", title: "", description: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTicket = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(API_ROUTES.SUPPORT + `/tickets/${params.id}`);
      setTicket(response?.data?.data);
    } catch (err) {
      console.error("Failed to fetch ticket:", err);
      toast({
        title: "Error",
        description: "Failed to load ticket details.",
        variant: "destructive",
      });
      router.push("/support/tickets");
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (params.id) {
      fetchTicket();
    }
  }, [params.id, fetchTicket]);

  useEffect(() => {
    const handleRefresh = () => {
      if (params.id && document.visibilityState === "visible") {
        fetchTicket();
      }
    };
    window.addEventListener("focus", handleRefresh);
    window.addEventListener("visibilitychange", handleRefresh);
    return () => {
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener("visibilitychange", handleRefresh);
    };
  }, [params.id, fetchTicket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const handleSendReply = async () => {
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      await api.post(API_ROUTES.SUPPORT + `/tickets/${params.id}/messages`, {
        message: replyText.trim(),
      });
      setReplyText("");
      toast({
        title: "Message Sent",
        description: "Your reply has been added to the ticket.",
      });
      await fetchTicket();
    } catch (err) {
      console.error("Failed to send reply:", err);
      toast({
        title: "Failed to Send",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "OPEN":
        return { label: "Open", icon: AlertCircle, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
      case "IN_PROGRESS":
        return { label: "In Progress", icon: Clock, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
      case "WAITING_AGENT":
        return { label: "Waiting for Agent", icon: Clock, className: "bg-purple-500/10 text-purple-500 border-purple-500/20" };
      case "RESOLVED":
        return { label: "Resolved", icon: CheckCircle, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
      case "CLOSED":
        return { label: "Closed", icon: CheckCircle, className: "bg-gray-500/10 text-gray-500 border-gray-500/20" };
      default:
        return { label: status, icon: Ticket, className: "bg-muted text-muted-foreground" };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "URGENT": return { label: "Urgent", className: "text-red-500" };
      case "HIGH": return { label: "High", className: "text-orange-500" };
      case "MEDIUM": return { label: "Medium", className: "text-amber-500" };
      case "LOW": return { label: "Low", className: "text-muted-foreground" };
      default: return { label: priority || "Medium", className: "text-muted-foreground" };
    }
  };

  const handleUpdateStatus = async (status: "RESOLVED" | "CLOSED" | "OPEN") => {
    setIsUpdatingStatus(true);
    try {
      await api.patch(API_ROUTES.SUPPORT + `/tickets/${params.id}/status`, { status });
      setConfirmAction(null);
      setFeedbackModal({
        open: true,
        status: "success",
        title: status === "RESOLVED" ? "Ticket Resolved" : status === "CLOSED" ? "Ticket Closed" : "Ticket Reopened",
        description: status === "RESOLVED"
          ? "Your ticket has been marked as resolved. You can still send a message to reopen it if needed."
          : status === "CLOSED"
            ? "Your ticket has been closed. You can create a new ticket if you need further assistance."
            : "Your ticket has been reopened and is now visible to support agents.",
      });
      await fetchTicket();
    } catch (err) {
      console.error("Failed to update ticket status:", err);
      setConfirmAction(null);
      setFeedbackModal({
        open: true,
        status: "error",
        title: "Something Went Wrong",
        description: "Failed to update ticket status. Please try again.",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const canReply = ticket?.status !== "CLOSED";
  const isTicketResolved = ticket?.status === "RESOLVED";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const statusConfig = getStatusConfig(ticket.status);
  const priorityConfig = getPriorityConfig(ticket.priority);

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-[50] pt-2 pb-4 px-4 max-w-5xl mx-auto">
        <BackButton href="/support/tickets" className="mb-8" />
      </div>
      <div className="container py-12 px-4 max-w-5xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ticket Header Card */}
            <Card className="p-8 rounded-[32px] border-none shadow-2xl shadow-primary/5 bg-card overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <Ticket className="h-48 w-48 rotate-12" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className={cn("rounded-full px-4 py-1 font-bold uppercase text-[10px] tracking-[0.2em]", statusConfig.className)}>
                    {statusConfig.label}
                  </Badge>
                  <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">#{ticket.id}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  {ticket.subject}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground/70 font-medium">
                  <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-2xl">
                    <Calendar className="h-4 w-4" />
                    {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-2xl">
                    <Sparkles className="h-4 w-4 text-primary/60" />
                    {ticket.category}
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                    <LinkifyText text={ticket.description} />
                  </p>
                </div>
              </div>
            </Card>

            {/* Conversation/Updates section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-4">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-black tracking-tight">Conversation <span className="text-primary italic">History</span></h2>
              </div>

              {ticket.messages && ticket.messages.length > 0 ? (
                <div className="space-y-6 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:to-transparent">
                  {ticket.messages.map((msg: any, idx: number) => (
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
                            "bg-muted text-muted-foreground"
                      )}>
                        {msg.senderType === "USER" ? <User className="h-3 w-3" /> :
                          msg.senderType === "AGENT" ? <Shield className="h-3 w-3" /> :
                            <Info className="h-3 w-3" />}
                      </div>

                      <Card className="p-6 rounded-[24px] border-none shadow-xl shadow-primary/5 bg-card hover:shadow-primary/10 transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-black text-sm uppercase tracking-widest text-primary/60">
                            {msg.senderType === "USER" ? "You" :
                              msg.senderType === "AGENT" ? "Support Agent" :
                                "System"}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                                {msg.senderType === "SYSTEM" ? msg.content : <LinkifyText text={msg.content} />}
                              </p>
                      </Card>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <Card className="p-12 text-center border-2 border-dashed border-muted-foreground/10 rounded-[32px] bg-card/50">
                  <div className="h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-primary/30" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Awaiting Response</h3>
                  <p className="text-muted-foreground">Our support team is reviewing your ticket and will get back to you shortly.</p>
                </Card>
              )}

              {/* Reply Input */}
              {canReply ? (
                <Card className="p-6 rounded-[24px] border-none shadow-xl shadow-primary/5 bg-card">
                  {isTicketResolved && (
                    <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 text-sm font-medium">
                      <RotateCcw className="h-4 w-4" />
                      This ticket is resolved. Sending a message will reopen it.
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
                      className="min-h-[80px] rounded-2xl resize-none border-border/50 bg-muted/30 focus-visible:ring-primary/30"
                      disabled={isSending}
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || isSending}
                      className="self-end h-12 w-12 rounded-2xl shrink-0"
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
              ) : (
                <Card className="p-6 rounded-[24px] border-2 border-dashed border-muted-foreground/10 bg-card/50 text-center">
                  <p className="text-muted-foreground text-sm font-medium">
                    This ticket is closed. Create a new ticket if you need further assistance.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 rounded-xl"
                    onClick={() => router.push("/support/tickets/new")}
                  >
                    Create New Ticket
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-8 rounded-[32px] bg-primary text-primary-foreground border-none shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-black tracking-tight">Need more help?</h3>
                <p className="text-primary-foreground/80 leading-relaxed font-medium">
                  If your issue is urgent, you can also use our real-time AI assistant &quot;Alex&quot; for immediate technical guidance.
                </p>
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-alex-chat'))}
                  className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-white/90 font-bold text-base shadow-xl"
                >
                  Chat with Alex
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Card>

            <Card className="p-8 rounded-[32px] bg-card border-none shadow-xl space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight uppercase">Support Info</h3>
                <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest">Quick Reference</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-muted-foreground">Status</span>
                  <Badge variant="outline" className={cn("rounded-full font-bold uppercase text-[10px]", statusConfig.className)}>
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-muted-foreground">Priority</span>
                  <span className={cn("text-sm font-black uppercase tracking-widest", priorityConfig.className)}>
                    {priorityConfig.label}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-muted-foreground">Category</span>
                  <span className="text-sm font-black text-primary uppercase tracking-widest">{ticket.category}</span>
                </div>
                {ticket.assignedAgent && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-muted-foreground">Assigned To</span>
                    <span className="text-sm font-black text-primary">{ticket.assignedAgent.name}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border/50 space-y-2">
                {ticket.status === "OPEN" || ticket.status === "IN_PROGRESS" ? (
                  <>
                    <Button
                      variant="default"
                      disabled={isUpdatingStatus}
                      onClick={() => setConfirmAction("RESOLVED")}
                      className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20"
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Mark as Resolved
                    </Button>
                    <Button
                      variant="outline"
                      disabled={isUpdatingStatus}
                      onClick={() => setConfirmAction("CLOSED")}
                      className="w-full h-12 rounded-2xl border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-600 font-bold"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Close Ticket
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus("OPEN")}
                    className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20"
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-2" />
                    )}
                    Reopen Ticket
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmAction !== null} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent className="w-[90vw] sm:max-w-[400px] rounded-2xl border-border/10 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "RESOLVED" ? "Mark as Resolved?" : "Close Ticket?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "RESOLVED"
                ? "This will mark your ticket as resolved. You can still send a message to reopen it if needed."
                : "This will close your ticket permanently. You will not be able to send further replies."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isUpdatingStatus}
              onClick={() => handleUpdateStatus(confirmAction!)}
              className={cn(
                "rounded-xl font-bold",
                confirmAction === "RESOLVED"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              )}
            >
              {isUpdatingStatus ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              {confirmAction === "RESOLVED" ? "Yes, Mark Resolved" : "Yes, Close Ticket"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FeedbackModal
        open={feedbackModal.open}
        onOpenChange={(open) => setFeedbackModal((prev) => ({ ...prev, open }))}
        status={feedbackModal.status}
        title={feedbackModal.title}
        description={feedbackModal.description}
        primaryAction={{
          label: "Done",
          onClick: () => setFeedbackModal((prev) => ({ ...prev, open: false })),
        }}
      />
    </div>
  );
}
