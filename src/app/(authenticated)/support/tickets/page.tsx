"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Plus,
  CheckCircle,
  Search,
  MoreHorizontal,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";
import API_ROUTES from "@/lib/apiRoutes";
import { toast } from "@/hooks/use-toast";
import { BackButton } from "@/components/back-button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TransitionLink } from "@/components/transition-link";

export default function TicketsListPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.patch(API_ROUTES.SUPPORT + `/tickets/${id}/status`, { status });
      toast({
        title: "Status Updated",
        description: `Ticket #${id} marked as ${status.toLowerCase()}.`,
      });
      fetchTickets();
    } catch (err) {
      console.error("Failed to update status:", err);
      toast({
        title: "Update Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(API_ROUTES.SUPPORT + "/tickets");
      setTickets(response?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toString().includes(search);
    const matchesTab = activeTab === "ALL" ||
      (activeTab === "OPEN" && (t.status === "OPEN" || t.status === "IN_PROGRESS" || t.status === "WAITING_AGENT")) ||
      (activeTab === "RESOLVED" && t.status === "RESOLVED") ||
      (activeTab === "CLOSED" && t.status === "CLOSED");
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "IN_PROGRESS": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "WAITING_AGENT": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      case "RESOLVED": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "CLOSED": return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default: return "text-muted-foreground bg-muted/10 border-muted/20";
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "OPEN": return { label: "Open", className: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
      case "IN_PROGRESS": return { label: "In Progress", className: "text-amber-400 bg-amber-400/10 border-amber-400/20" };
      case "WAITING_AGENT": return { label: "Waiting", className: "text-purple-400 bg-purple-400/10 border-purple-400/20" };
      case "RESOLVED": return { label: "Resolved", className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
      case "CLOSED": return { label: "Closed", className: "text-gray-400 bg-gray-400/10 border-gray-400/20" };
      default: return { label: status, className: "text-muted-foreground bg-muted/10 border-muted/20" };
    }
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-[50] pt-2 pb-4 px-4 max-w-6xl mx-auto">
        <BackButton href="/support" className="mb-4 md:mb-8" />
      </div>
      <div className="container py-6 md:py-12 px-4 max-w-6xl mx-auto">

        {/* Modern Header Section */}
        <div className="relative mb-6 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl">Support <span className="text-primary italic">Tickets</span></h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Track and manage your formal support requests in one place.
              </p>
            </div>

            <TransitionLink href="/support/tickets/new">
              <Button className="rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 gap-2 text-base font-bold active:scale-95">
                <Plus className="h-5 w-5" />
                Create New Ticket
              </Button>
            </TransitionLink>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center">
          <div className="flex gap-2 w-full lg:flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by ID or subject..."
                className="pl-12 h-11 rounded-2xl bg-card border-none shadow-sm focus-visible:ring-primary/30 text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl bg-card shrink-0 hover:bg-muted"
              onClick={fetchTickets}
            >
              <RefreshCw className={cn("h-4 w-4 text-muted-foreground", isLoading && "animate-spin")} />
            </Button>
          </div>

          <div className="flex flex-row flex-wrap gap-2 items-center justify-center lg:justify-start">
            <div className="flex bg-muted/30 p-1 rounded-xl border border-border/50">
              {["ALL", "OPEN", "RESOLVED", "CLOSED"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-2 sm:px-4 sm:py-1.5 rounded-lg text-xs font-bold transition-all",
                    activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-card/50 border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                    <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shrink-0" />
                    <div className="flex-1 w-full space-y-2">
                      <Skeleton className="h-3 sm:h-4 w-1/3 sm:w-1/4" />
                      <Skeleton className="h-5 sm:h-6 w-2/3 sm:w-3/4" />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <Skeleton className="h-8 sm:h-10 w-16 sm:w-20 rounded-xl" />
                      <Skeleton className="h-8 sm:h-10 w-8 sm:w-10 rounded-xl" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : filteredTickets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 sm:py-20 text-center bg-card rounded-[32px] border-2 border-dashed border-muted-foreground/20"
              >
                <div className="h-20 w-20 sm:h-24 sm:w-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Inbox className="h-10 w-10 sm:h-12 sm:w-12 text-primary/40" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">No tickets found</h3>
                <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-xs sm:max-w-sm mx-auto px-2">
                  {search ? "Try adjusting your search filters to find what you're looking for." : "You haven't created any support tickets yet."}
                </p>
                {!search && (
                  <TransitionLink href="/support/tickets/new">
                    <Button variant="outline" className="rounded-xl px-8 h-12">Create First Ticket</Button>
                  </TransitionLink>
                )}
              </motion.div>
            ) : (
              filteredTickets.map((ticket, index) => {
                const statusColor = getStatusColor(ticket.status);
                const statusConfig = getStatusConfig(ticket.status);

                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    layout
                  >
                    <Card className="group relative border border-border/50 bg-card/50 hover:bg-card transition-all duration-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-5 gap-3 sm:gap-5">
                        {/* Compact Status Indicator */}
                        <div className="flex flex-row sm:flex-col items-center gap-1.5 sm:gap-1 shrink-0">
                          <div className={cn(
                            "h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0 border border-current/10 transition-transform group-hover:scale-105",
                            statusColor.split(' ')[0],
                            statusColor.split(' ')[1]
                          )}>
                            {ticket.status === "CLOSED" || ticket.status === "RESOLVED" ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : <Ticket className="h-4 w-4 sm:h-5 sm:w-5" />}
                          </div>
                          <Badge variant="outline" className={cn("sm:hidden text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded", statusConfig.className)}>
                            {statusConfig.label}
                          </Badge>
                          <Badge variant="outline" className={cn("hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-1.5 py-0 rounded-sm leading-tight", statusConfig.className)}>
                            {statusConfig.label}
                          </Badge>
                        </div>

                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-1">
                            <span className="text-xs font-bold text-primary tracking-wider">#{ticket.id}</span>
                            <div className="h-1 w-1 rounded-full bg-border shrink-0" />
                            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{ticket.category}</span>
                            <div className="h-1 w-1 rounded-full bg-border shrink-0" />
                            <span className="text-xs text-muted-foreground/60 font-medium">
                              {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm sm:text-base md:text-lg group-hover:text-primary transition-colors truncate">
                            {ticket.subject}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start mt-1 sm:mt-0">
                          <TransitionLink href={`/support/tickets/${ticket.id}`}>
                            <Button
                              variant="ghost"
                              className="h-8 sm:h-10 px-3 sm:px-4 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all font-bold text-xs"
                            >
                              Details
                            </Button>
                          </TransitionLink>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                                  {(ticket.status === "RESOLVED" || ticket.status === "CLOSED") && (
                                    <DropdownMenuItem
                                      className="rounded-lg text-xs font-bold py-2 cursor-pointer"
                                      onClick={() => handleUpdateStatus(ticket.id, "OPEN")}
                                    >
                                      Reopen
                                    </DropdownMenuItem>
                                  )}
                                  {(ticket.status === "OPEN" || ticket.status === "IN_PROGRESS" || ticket.status === "WAITING_AGENT") && (
                                    <DropdownMenuItem
                                      className="rounded-lg text-xs font-bold py-2 cursor-pointer text-emerald-500"
                                      onClick={() => handleUpdateStatus(ticket.id, "RESOLVED")}
                                    >
                                      Mark Resolved
                                    </DropdownMenuItem>
                                  )}
                                  {ticket.status !== "CLOSED" && (
                                    <DropdownMenuItem
                                      className="rounded-lg text-xs font-bold py-2 cursor-pointer text-destructive"
                                      onClick={() => handleUpdateStatus(ticket.id, "CLOSED")}
                                    >
                                      Close Ticket
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
