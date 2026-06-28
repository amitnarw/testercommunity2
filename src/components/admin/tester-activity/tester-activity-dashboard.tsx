"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTesterActivity, useAllUsers } from "@/hooks/useAdmin";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import {
  Users, CheckCircle2, Clock, AlertTriangle, Activity, UserCheck, CalendarIcon, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  date: string;
  onTesterSelect: (testerId: string) => void;
  onDateChange: (date: string) => void;
}

function StatCard({ title, value, subtitle, icon: Icon, color, isLoading }: {
  title: string; value: string | number; subtitle?: string; icon: any; color: string; isLoading?: boolean;
}) {
  return (
    <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border transition-all duration-300 border-l-4 overflow-hidden" style={{ borderLeftColor: color }}>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 bg-white/20" />
            <Skeleton className="h-8 w-16 bg-white/20" />
            <Skeleton className="h-3 w-32 bg-white/20" />
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: `${color}15` }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const statusColors: Record<string, string> = {
  PENDING: "#F59E0B",
  IN_PROGRESS: "#3B82F6",
  COMPLETED: "#10B981",
  DROPPED: "#EF4444",
  REMOVED: "#8B5CF6",
  REJECTED: "#6B7280",
};

export function TesterActivityDashboard({ date, onTesterSelect, onDateChange }: Props) {
  const { data: activity, isLoading } = useTesterActivity({ date });
  const { data: allUsers } = useAllUsers({ role: "tester", status: "Active" });

  const [search, setSearch] = useState("");

  const approvedTesters = useMemo(() => {
    if (!allUsers) return [];
    return allUsers.filter((u: any) => {
      if (u.status === "Banned") return false;
      if (u.role?.toLowerCase() !== "tester") return false;
      return true;
    });
  }, [allUsers]);

  const filteredTesters = useMemo(() => {
    if (!search) return approvedTesters;
    const q = search.toLowerCase();
    return approvedTesters.filter((u: any) =>
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q),
    );
  }, [approvedTesters, search]);

  const statusData = useMemo(() => {
    if (!activity?.testerStatusBreakdown) return [];
    return Object.entries(activity.testerStatusBreakdown).map(([name, value]) => ({
      name: name.replace(/_/g, " "),
      value,
      color: statusColors[name] || "#6B7280",
    }));
  }, [activity]);

  const dateObj = new Date(date);

  return (
    <div className="space-y-6">
      {/* Date & Tester Search Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-[240px] justify-start text-left font-normal")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(dateObj, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateObj}
              onSelect={(d) => d && onDateChange(format(d, "yyyy-MM-dd"))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard title="Total Testers" value={activity?.totalTesters ?? "—"} icon={Users} color="#3B82F6" isLoading={isLoading} />
        <StatCard title="Active Today" value={activity?.activeTestersToday ?? "—"} subtitle="with verified check-in" icon={UserCheck} color="#10B981" isLoading={isLoading} />
        <StatCard title="Tests Completed Today" value={activity?.testsCompletedToday ?? "—"} icon={CheckCircle2} color="#8B5CF6" isLoading={isLoading} />
        <StatCard title="Remaining Tests" value={activity?.testsRemainingToday ?? "—"} subtitle="still in progress" icon={Clock} color="#F59E0B" isLoading={isLoading} />
        <StatCard title="Total Completed" value={activity?.totalCompletedTests ?? "—"} icon={CheckCircle2} color="#10B981" isLoading={isLoading} />
        <StatCard title="In Progress" value={activity?.totalInProgressTests ?? "—"} icon={Activity} color="#3B82F6" isLoading={isLoading} />
        <StatCard title="Dropped / Removed" value={activity?.totalDroppedRemovedTests ?? "—"} icon={AlertTriangle} color="#EF4444" isLoading={isLoading} />
        <StatCard title="Total Tests Joined" value={activity?.totalTestsJoined ?? "—"} subtitle="across all apps" icon={Users} color="#6366F1" isLoading={isLoading} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-2 p-6">
            <CardTitle className="text-base">7-Day Check-in Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {isLoading ? (
              <Skeleton className="h-[250px] w-full bg-white/20" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={activity?.dailyCheckinsTrend || []}>
                  <defs>
                    <linearGradient id="checkinGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="rgba(255,255,255,0.3)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="rgba(255,255,255,0.3)" allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none", borderRadius: 8, color: "#fff" }} />
                  <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="url(#checkinGradient)" strokeWidth={2} name="Verified" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-2 p-6">
            <CardTitle className="text-base">Tester Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {isLoading ? (
              <Skeleton className="h-[250px] w-full bg-white/20" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="rgba(255,255,255,0.3)" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="rgba(255,255,255,0.3)" width={100} />
                  <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none", borderRadius: 8, color: "#fff" }} />
                  <Bar dataKey="value" name="Tests" radius={[0, 4, 4, 0]}>
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tester List */}
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-2 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-base">Testers</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search testers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          {!allUsers ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full bg-white/20" />
              <Skeleton className="h-12 w-full bg-white/20" />
            </div>
          ) : filteredTesters.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No testers found</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTesters.map((tester: any) => (
                <button
                  key={tester.id}
                  onClick={() => onTesterSelect(tester.id)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-left w-full"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tester.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{tester.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {tester.tests ?? 0} tests · {tester.activeTests ?? 0} active
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
