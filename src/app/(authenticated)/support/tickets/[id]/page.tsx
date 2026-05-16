"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  User,
  Shield,
  Calendar,
  ChevronLeft,
  Loader2,
  Inbox,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/back-button";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import API_ROUTES from "@/lib/apiRoutes";
import { toast } from "@/hooks/use-toast";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTicket = async () => {
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
  };

  useEffect(() => {
    if (params.id) {
      fetchTicket();
    }
  }, [params.id]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Pending", icon: Clock, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
      case "OPEN":
        return { label: "Open", icon: AlertCircle, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
      case "CLOSED":
        return { label: "Resolved", icon: CheckCircle, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
      default:
        return { label: status, icon: Ticket, className: "bg-muted text-muted-foreground" };
    }
  };

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
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen">
      <div className="container py-12 px-4 max-w-5xl mx-auto">
        <BackButton href="/support/tickets" className="mb-8" />

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
                  <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {ticket.description}
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
                        msg.senderType === "USER" ? "bg-primary text-primary-foreground" : "bg-emerald-500 text-white"
                      )}>
                        {msg.senderType === "USER" ? <User className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                      </div>
                      
                      <Card className="p-6 rounded-[24px] border-none shadow-xl shadow-primary/5 bg-card hover:shadow-primary/10 transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-black text-sm uppercase tracking-widest text-primary/60">
                            {msg.senderType === "USER" ? "You" : "Support Team"}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {msg.content || msg.message}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-8 rounded-[32px] bg-primary text-primary-foreground border-none shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-black tracking-tight">Need more help?</h3>
                <p className="text-primary-foreground/80 leading-relaxed font-medium">
                  If your issue is urgent, you can also use our real-time AI assistant "Alex" for immediate technical guidance.
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
                  <span className="text-sm font-black text-primary uppercase tracking-widest">High</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-muted-foreground">Category</span>
                  <span className="text-sm font-black text-primary uppercase tracking-widest">{ticket.category}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
