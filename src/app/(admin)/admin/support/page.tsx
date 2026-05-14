"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Headphones,
  Ticket,
} from "lucide-react";
import API_ROUTES from "@/lib/apiRoutes";
import api from "@/lib/axios";

interface SupportStats {
  todayStarted: number;
  todayResolved: number;
  pendingInQueue: number;
  activeNow: number;
  escalated: number;
  totalEscalated: number;
  todayTickets: number;
  avgWaitTime: number;
  avgChatDuration: number;
  totalResolution: number;
  agentPerformance: Array<{
    name: string;
    chatsHandled: number;
    avgResponseTime: number;
    resolved: number;
    resolutionRate: number;
  }>;
}

export default function AdminSupportStatsPage() {
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(API_ROUTES.ADMIN + "/support/stats")
      .then((res) => setStats(res.data?.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function formatMs(ms: number) {
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
    return `${Math.round(ms / 3600000)}h ${Math.round((ms % 3600000) / 60000)}m`;
  }

  const cards = [
    { label: "Chats Today", value: stats?.todayStarted ?? 0, icon: MessageSquare, color: "text-blue-500" },
    { label: "Resolved Today", value: stats?.todayResolved ?? 0, icon: CheckCircle2, color: "text-green-500" },
    { label: "Pending in Queue", value: stats?.pendingInQueue ?? 0, icon: Clock, color: "text-amber-500" },
    { label: "Active Now", value: stats?.activeNow ?? 0, icon: Headphones, color: "text-violet-500" },
    { label: "Escalated Today", value: stats?.escalated ?? 0, icon: TrendingUp, color: "text-orange-500" },
    { label: "Tickets Today", value: stats?.todayTickets ?? 0, icon: Ticket, color: "text-rose-500" },
  ];

  return (
    <div className="px-4 sm:px-6 py-6 w-full space-y-6">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent leading-[unset] pb-1">
          Support Statistics
        </h2>
        <p className="text-muted-foreground">Real-time metrics for your support operations.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <Card key={card.label} className="border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`h-4 w-4 ${card.color}`} />
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold">{card.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" /> Average Timings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /></div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Wait Time (queue)</span>
                  <span className="font-semibold">{formatMs(stats?.avgWaitTime ?? 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Chat Duration</span>
                  <span className="font-semibold">{formatMs(stats?.avgChatDuration ?? 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Resolved</span>
                  <span className="font-semibold">{stats?.totalResolution ?? 0}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Agent Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /></div>
            ) : stats?.agentPerformance?.length ? (
              <div className="space-y-3">
                {stats.agentPerformance.map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                    <div>
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.chatsHandled} chats handled</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatMs(agent.avgResponseTime)}</p>
                      <p className="text-xs text-muted-foreground">{agent.resolutionRate}% resolved</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No agent data available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
