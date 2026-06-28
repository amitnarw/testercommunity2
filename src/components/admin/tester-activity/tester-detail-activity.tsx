"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTesterActivity } from "@/hooks/useAdmin";
import {
  ArrowLeft, Smartphone, Globe, Star, Award, Clock, CheckCircle2,
  XCircle, Activity, MessageSquare, Zap,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

interface Props {
  testerId: string;
  date: string;
  onBack: () => void;
}

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  IN_PROGRESS: "default",
  COMPLETED: "secondary",
  PENDING: "outline",
  DROPPED: "destructive",
  REMOVED: "destructive",
  REJECTED: "outline",
};

export function TesterDetailActivity({ testerId, date, onBack }: Props) {
  const { data: activity, isLoading } = useTesterActivity({ testerId, date });

  const summaryCards = useMemo(() => {
    if (!activity?.summary) return [];
    const s = activity.summary;
    return [
      { label: "Apps Joined", value: s.appsJoined, icon: Activity, color: "#3B82F6" },
      { label: "Completed", value: s.appsCompleted, icon: CheckCircle2, color: "#10B981" },
      { label: "In Progress", value: s.appsInProgress, icon: Clock, color: "#F59E0B" },
      { label: "Check-ins Today", value: s.checkinsToday, icon: Zap, color: "#8B5CF6" },
      { label: "Remaining Tests", value: s.remainingTests, icon: XCircle, color: "#EF4444" },
      { label: "Dropped", value: s.appsDropped, icon: XCircle, color: "#6B7280" },
      { label: "Total Feedback", value: s.totalFeedback, icon: MessageSquare, color: "#14B8A6" },
      { label: "Points Earned", value: s.totalPointsEarned, icon: Award, color: "#F97316" },
    ];
  }, [activity]);

  const tester = activity?.tester;
  const apps = activity?.apps || [];
  const recentFeedback = activity?.recentFeedback || [];
  const recentActivities = activity?.recentActivities || [];

  const progressChartData = useMemo(() => {
    return apps
      .filter((a: any) => a.status === "IN_PROGRESS" || a.status === "COMPLETED")
      .slice(0, 10)
      .map((a: any) => ({
        name: a.appName?.length > 15 ? a.appName.substring(0, 15) + "..." : a.appName,
        completed: a.daysCompleted,
        total: a.totalDay,
        progress: a.progressPercent,
      }));
  }, [apps]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full bg-white/20" />
          ))}
        </div>
        <Skeleton className="h-64 w-full bg-white/20" />
      </div>
    );
  }

  if (!activity || !tester) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Tester not found or has no activity data.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back & Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={tester.avatar || undefined} />
            <AvatarFallback>{tester.name?.charAt(0) || "T"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{tester.name}</h3>
              <Badge variant={tester.status === "Banned" ? "destructive" : "secondary"}>
                {tester.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{tester.email}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              {tester.device && (
                <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" />{tester.device}</span>
              )}
              {tester.country && (
                <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{tester.country}</span>
              )}
              <span className="flex items-center gap-1"><Star className="h-3 w-3" />{tester.experience || "N/A"}</span>
              <span>Availability: <Badge variant="outline" className="text-xs">{tester.availability}</Badge></span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`${ROUTES.ADMIN.USERS}/${tester.id}`}>Full Profile</Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="bg-white/70 dark:bg-black/70 backdrop-blur-md border transition-all duration-300 border-l-4 overflow-hidden" style={{ borderLeftColor: card.color }}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className="p-2 rounded-full" style={{ backgroundColor: `${card.color}15` }}>
                  <card.icon className="h-4 w-4" style={{ color: card.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Chart */}
      {progressChartData.length > 0 && (
        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-2 p-6">
            <CardTitle className="text-base">Test Progress (Completed / Total Days)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="rgba(255,255,255,0.3)" allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" width={120} />
                <Tooltip
                  contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none", borderRadius: 8, color: "#fff" }}
                  formatter={(value: number, name: string) => [value, name === "completed" ? "Days Done" : "Total Days"]}
                />
                <Bar dataKey="completed" fill="#3B82F6" name="completed" radius={[0, 4, 4, 0]} />
                <Bar dataKey="total" fill="#93C5FD" name="total" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Apps Table */}
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-2 p-6">
          <CardTitle className="text-base">Assigned Apps</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Check-ins Today</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No apps assigned
                    </TableCell>
                  </TableRow>
                ) : (
                  apps.map((app: any) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.appName}</TableCell>
                      <TableCell>
                        <Badge variant={app.appType === "PAID" ? "default" : "secondary"} className="text-xs">
                          {app.appType === "PAID" ? "PRO" : "FREE"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant[app.status] || "outline"} className="text-xs">
                          {app.status?.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[100px] h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${app.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {app.daysCompleted}/{app.totalDay}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{app.checkinsToday}</TableCell>
                      <TableCell className="text-xs">{new Date(app.joinedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs">
                        {app.completedAt ? new Date(app.completedAt).toLocaleDateString() : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback & Activity */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-2 p-6">
            <CardTitle className="text-base">Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {recentFeedback.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No feedback yet</p>
            ) : (
              <div className="space-y-2">
                {recentFeedback.map((f: any) => (
                  <div key={f.id} className="p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{f.type}</Badge>
                      <span className="text-xs text-muted-foreground">{f.appName}</span>
                    </div>
                    <p className="text-sm line-clamp-2">{f.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(f.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-2 p-6">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-2">
                {recentActivities.map((a: any) => (
                  <div key={a.id} className="p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium">{a.actionType?.replace(/_/g, " ")}</span>
                      {a.appName && <span className="text-xs text-muted-foreground">- {a.appName}</span>}
                    </div>
                    {a.description && <p className="text-xs text-muted-foreground mt-1">{a.description}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
