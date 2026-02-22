"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  FileText,
  Bug,
  UserCheck,
  ArrowRight,
  Clock,
  AlertCircle,
  TrendingUp,
  Eye,
  TrendingDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusDistributionCard } from "@/components/admin/StatusDistributionCard";
import dynamic from "next/dynamic";

const CardDesign1 = dynamic(() =>
  import("@/components/admin/CardDesign1").then((mod) => mod.CardDesign1),
);
const CardDesign2 = dynamic(() =>
  import("@/components/admin/CardDesign2").then((mod) => mod.CardDesign2),
);
const CardDesign3 = dynamic(() =>
  import("@/components/admin/CardDesign3").then((mod) => mod.CardDesign3),
);

const chartConfig = {
  proSubmissions: {
    label: "Pro Submissions",
    color: "#f59e0b",
  },
  communitySubmissions: {
    label: "Community Submissions",
    color: "#3b82f6",
  },
  totalUsers: {
    label: "Total Users",
    color: "#22c55e",
  },
  submissions: {
    label: "Submissions",
    color: "hsl(var(--primary))",
  },
  feedback: {
    label: "Feedback",
    color: "#8b5cf6",
  },
  newUsers: {
    label: "New Users",
    color: "#22c55e",
  },
  pro: {
    label: "Professional",
    color: "#f59e0b",
  },
  community: {
    label: "Community",
    color: "#3b82f6",
  },
};

// Status distribution colors
const statusColors: Record<string, string> = {
  COMPLETED: "#A855F7",
  AVAILABLE: "#BEF264",
  IN_TESTING: "#38BDF8",
  REJECTED: "#3F3F46",
  IN_REVIEW: "#f59e0b", // Will be replaced by stripes in component
  DRAFT: "#6b7280",
  ON_HOLD: "#94a3b8",
};

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  // Dynamic quick actions with counts
  const dynamicQuickActions = [
    {
      title: "Paid Apps",
      description: "Paid submissions awaiting review",
      icon: Clock,
      href: "/admin/submissions-paid",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      count: stats?.submissionsByAppType?.PAID || 0,
      countBadgeColor: "bg-amber-500/20 text-amber-600",
    },
    {
      title: "Free Apps (Community)",
      description: "Community submissions awaiting review",
      icon: Clock,
      href: "/admin/submissions-free",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      count: stats?.submissionsByAppType?.FREE || 0,
      countBadgeColor: "bg-blue-500/20 text-blue-600",
    },
    {
      title: "Manage Users",
      description: "View & manage platform users",
      icon: Users,
      href: "/admin/users",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Send Notification",
      description: "Broadcast to all users",
      icon: AlertCircle,
      href: "/admin/notifications",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  // Transform status data for pie chart
  const statusDistribution = stats?.submissionsByStatus
    ? Object.entries(stats.submissionsByStatus).map(([name, value]) => ({
        name: name.replace(/_/g, " "),
        value: Number(value),
        color: statusColors[name] || "#6b7280",
      }))
    : [];

  // Transform app type data
  const serviceComparison = stats?.submissionsByAppType
    ? [
        {
          name: "Submissions",
          pro: stats.submissionsByAppType.PAID || 0,
          community: stats.submissionsByAppType.FREE || 0,
        },
        {
          name: "Feedback",
          pro: Math.floor((stats.totalFeedback || 0) * 0.3),
          community: Math.floor((stats.totalFeedback || 0) * 0.7),
        },
        {
          name: "Testers",
          pro: Math.floor((stats.totalTesters || 0) * 0.4),
          community: Math.floor((stats.totalTesters || 0) * 0.6),
        },
      ]
    : [];

  // Recent submissions for pending approvals
  const pendingApprovals =
    stats?.recentSubmissions?.filter((s: any) => s.status === "IN_REVIEW") ||
    [];
  const recentProSubmissions =
    stats?.recentSubmissions
      ?.filter((s: any) => s.appType === "PAID")
      .slice(0, 2) || [];
  const recentCommunitySubmissions =
    stats?.recentSubmissions
      ?.filter((s: any) => s.appType === "FREE")
      .slice(0, 2) || [];

  return (
    <div className="flex-1 space-y-6 w-full px-4 sm:px-6 py-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent leading-[unset] pb-1">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground">
            Welcome back! Here's your platform overview.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {dynamicQuickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-none bg-white/50 dark:bg-white/5 backdrop-blur-sm relative overflow-hidden group">
              {/* Background Watermark Icon - Mobile Only */}
              <div className="absolute -right-2 -bottom-2 opacity-5 sm:hidden pointer-events-none transition-transform duration-500 group-hover:scale-110">
                <action.icon
                  className={cn("h-16 w-16 rotate-12", action.color)}
                />
              </div>

              <CardContent className="p-2.5 sm:p-4 h-full flex items-center relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 w-full">
                  {/* Foreground Icon - Desktop Only */}
                  <div
                    className={cn(
                      "hidden sm:flex p-2 rounded-xl shrink-0",
                      action.bgColor,
                    )}
                  >
                    <action.icon className={cn("h-5 w-5", action.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-bold text-[11px] sm:text-sm text-foreground leading-tight mb-0.5">
                        {action.title}
                      </p>
                      {action.count !== undefined && (
                        <span
                          className={cn(
                            "text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                            action.countBadgeColor ||
                              "bg-primary/10 text-primary",
                          )}
                        >
                          {action.count}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Exact Image Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <CardDesign1 stats={stats} isLoading={isLoading} />
        <CardDesign2 stats={stats} isLoading={isLoading} />
        <CardDesign3
          stats={stats}
          className="md:col-span-2"
          isLoading={isLoading}
        />
      </div>

      {/* Platform-wide Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalUsers?.toLocaleString() || 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalSubmissions?.toLocaleString() || 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback</CardTitle>
            <Bug className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalFeedback?.toLocaleString() || 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.totalTesters?.toLocaleString() || 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 - Trend & Distribution */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Status Distribution Pie Chart */}
        <StatusDistributionCard
          data={statusDistribution}
          isLoading={isLoading}
        />

        {/* Service Comparison Chart */}
        <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 rounded-3xl">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center gap-2 text-base">
              Pro vs Community Comparison
            </CardTitle>
            <CardDescription className="text-sm">
              Comparing Professional and Community services
            </CardDescription>
          </CardHeader>
          <CardContent className="pr-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full bg-white/20" />
                <Skeleton className="h-8 w-full bg-white/20" />
                <Skeleton className="h-8 w-full bg-white/20" />
              </div>
            ) : serviceComparison.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={serviceComparison}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={9}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Line
                      type="monotone"
                      dataKey="pro"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="community"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No data available
              </div>
            )}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500" />
                <span className="text-xs text-muted-foreground">
                  Professional
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-xs text-muted-foreground">Community</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Alert */}
      {pendingApprovals.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5 bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base">
                  Pending Approvals ({stats?.pendingApprovals || 0})
                </CardTitle>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/submissions?tab=IN_REVIEW">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto -mx-4 sm:mx-0 grid grid-cols-1">
              <div className="min-w-[400px] px-4 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm">App Name</TableHead>
                      <TableHead className="text-sm">Type</TableHead>
                      <TableHead className="hidden sm:table-cell text-sm">
                        Submitted By
                      </TableHead>
                      <TableHead className="text-right text-sm">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.slice(0, 3).map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-sm">
                          {item.appName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.appType === "PAID" ? "default" : "secondary"
                            }
                            className={`text-xs ${item.appType === "PAID" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30" : "bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30"}`}
                          >
                            {item.appType === "PAID" ? "PRO" : "FREE"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {item.ownerName}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            asChild
                          >
                            <Link href={`/admin/submissions/${item.id}`}>
                              Review
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Sections - Compact Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Professional Testing Card */}
        <Card className="border-amber-500/20 bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      Professional Testing
                    </CardTitle>
                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                      PAID
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-sm">
                <Link href="/admin/submissions?appType=PAID">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            <div className="grid gap-3 grid-cols-3">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Submissions</p>
                <p className="text-xl font-bold">
                  {stats?.submissionsByAppType?.PAID || 0}
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Active Testers</p>
                <p className="text-xl font-bold">
                  {Math.floor((stats?.totalTesters || 0) * 0.4)}
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Feedback</p>
                <p className="text-xl font-bold">
                  {Math.floor((stats?.totalFeedback || 0) * 0.3)}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full bg-white/20" />
                <Skeleton className="h-10 w-full bg-white/20" />
              </div>
            ) : recentProSubmissions.length > 0 ? (
              <div className="space-y-2">
                {recentProSubmissions.map((submission: any) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="font-medium text-sm truncate">
                        {submission.appName}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs flex-shrink-0",
                          submission.status === "AVAILABLE"
                            ? "border-green-500/30 text-green-600"
                            : submission.status === "IN_REVIEW"
                              ? "border-amber-500/30 text-amber-600"
                              : "",
                        )}
                      >
                        {submission.status?.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex-shrink-0"
                    >
                      <Link href={`/admin/submissions/${submission.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No recent professional submissions
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community Testing Card */}
        <Card className="border-blue-500/20 bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Community Testing</CardTitle>
                    <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs">
                      FREE
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-sm">
                <Link href="/admin/submissions?appType=FREE">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            <div className="grid gap-3 grid-cols-3">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Submissions</p>
                <p className="text-xl font-bold">
                  {stats?.submissionsByAppType?.FREE || 0}
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Active Testers</p>
                <p className="text-xl font-bold">
                  {Math.floor((stats?.totalTesters || 0) * 0.6)}
                </p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Feedback</p>
                <p className="text-xl font-bold">
                  {Math.floor((stats?.totalFeedback || 0) * 0.7)}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full bg-white/20" />
                <Skeleton className="h-10 w-full bg-white/20" />
              </div>
            ) : recentCommunitySubmissions.length > 0 ? (
              <div className="space-y-2">
                {recentCommunitySubmissions.map((submission: any) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="font-medium text-sm truncate">
                        {submission.appName}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs flex-shrink-0",
                          submission.status === "AVAILABLE"
                            ? "border-green-500/30 text-green-600"
                            : submission.status === "IN_REVIEW"
                              ? "border-amber-500/30 text-amber-600"
                              : "",
                        )}
                      >
                        {submission.status?.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex-shrink-0"
                    >
                      <Link href={`/admin/submissions/${submission.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No recent community submissions
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
