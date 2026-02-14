'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, Bug, UserCheck, ArrowRight, Briefcase, Users2, DollarSign, Clock, CheckCircle2, XCircle, AlertCircle, TrendingUp, Eye, Activity, BarChart3, PieChart, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts"
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";

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

// Quick action buttons for admin
const quickActions = [
    { 
        title: "Pro Reviews", 
        description: "Pro submissions awaiting review",
        icon: Clock, 
        href: "/admin/submissions-paid",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10"
    },
    { 
        title: "Community Reviews", 
        description: "Community submissions awaiting review",
        icon: Clock, 
        href: "/admin/submissions-free",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    { 
        title: "Manage Users", 
        description: "View & manage platform users",
        icon: Users, 
        href: "/admin/users",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    { 
        title: "Send Notification", 
        description: "Broadcast to all users",
        icon: AlertCircle, 
        href: "/admin/notifications",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10"
    },
];

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  iconColor,
  isLoading 
}: { 
  title: string; 
  value: string | number; 
  change?: string; 
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  iconColor: string;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <p className={cn(
                "text-xs flex items-center gap-1",
                changeType === "positive" && "text-green-500",
                changeType === "negative" && "text-red-500",
                changeType === "neutral" && "text-muted-foreground"
              )}>
                {changeType === "positive" && <TrendingUp className="h-3 w-3" />}
                {changeType === "negative" && <TrendingDown className="h-3 w-3" />}
                {change}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Status distribution colors
const statusColors: Record<string, string> = {
  IN_REVIEW: "#f59e0b",
  AVAILABLE: "#22c55e",
  IN_TESTING: "#3b82f6",
  COMPLETED: "#8b5cf6",
  REJECTED: "#ef4444",
  DRAFT: "#6b7280",
  ON_HOLD: "#94a3b8",
};

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  // Dynamic quick actions with counts
  const dynamicQuickActions = [
    { 
        title: "Pro Reviews", 
        description: "Pro submissions awaiting review",
        icon: Clock, 
        href: "/admin/submissions-paid",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        count: stats?.submissionsByAppType?.PAID || 0,
        countBadgeColor: "bg-amber-500/20 text-amber-600"
    },
    { 
        title: "Community Reviews", 
        description: "Community submissions awaiting review",
        icon: Clock, 
        href: "/admin/submissions-free",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        count: stats?.submissionsByAppType?.FREE || 0,
        countBadgeColor: "bg-blue-500/20 text-blue-600"
    },
    { 
        title: "Manage Users", 
        description: "View & manage platform users",
        icon: Users, 
        href: "/admin/users",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    { 
        title: "Send Notification", 
        description: "Broadcast to all users",
        icon: AlertCircle, 
        href: "/admin/notifications",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10"
    },
  ];

  // Transform status data for pie chart
  const statusDistribution = stats?.submissionsByStatus 
    ? Object.entries(stats.submissionsByStatus).map(([name, value]) => ({
        name: name.replace(/_/g, " "),
        value,
        color: statusColors[name] || "#6b7280",
      }))
    : [];

  // Transform app type data
  const serviceComparison = stats?.submissionsByAppType
    ? [
        { name: "Submissions", pro: stats.submissionsByAppType.PAID || 0, community: stats.submissionsByAppType.FREE || 0 },
        { name: "Feedback", pro: Math.floor((stats.totalFeedback || 0) * 0.3), community: Math.floor((stats.totalFeedback || 0) * 0.7) },
        { name: "Testers", pro: Math.floor((stats.totalTesters || 0) * 0.4), community: Math.floor((stats.totalTesters || 0) * 0.6) },
      ]
    : [];

  // Recent submissions for pending approvals
  const pendingApprovals = stats?.recentSubmissions?.filter((s: any) => s.status === "IN_REVIEW") || [];
  const recentProSubmissions = stats?.recentSubmissions?.filter((s: any) => s.appType === "PAID").slice(0, 2) || [];
  const recentCommunitySubmissions = stats?.recentSubmissions?.filter((s: any) => s.appType === "FREE").slice(0, 2) || [];

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
              Admin Dashboard
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's your platform overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last updated: Just now
          </Badge>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-4">
        {dynamicQuickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className={cn("p-1.5 sm:p-2 rounded-lg", action.bgColor)}>
                    <action.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", action.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-xs sm:text-sm">{action.title}</p>
                      {action.count !== undefined && (
                        <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-full", action.countBadgeColor || "bg-primary/10 text-primary")}>
                          {action.count}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Platform-wide Stats */}
      <div className="grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers?.toLocaleString() || 0}
          change="+20.1%"
          changeType="positive"
          icon={Users}
          iconColor="text-blue-500"
          isLoading={isLoading}
        />
        <StatCard 
          title="Submissions" 
          value={stats?.totalSubmissions?.toLocaleString() || 0}
          change="+180%"
          changeType="positive"
          icon={FileText}
          iconColor="text-purple-500"
          isLoading={isLoading}
        />
        <StatCard 
          title="Feedback" 
          value={stats?.totalFeedback?.toLocaleString() || 0}
          change="+19%"
          changeType="positive"
          icon={Bug}
          iconColor="text-red-500"
          isLoading={isLoading}
        />
        <StatCard 
          title="Testers" 
          value={stats?.totalTesters?.toLocaleString() || 0}
          change="+5"
          changeType="neutral"
          icon={UserCheck}
          iconColor="text-green-500"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row 1 - Trend & Distribution */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Submission Status Distribution
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Current status of all submissions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px] sm:h-[250px]">
                <Skeleton className="h-32 w-32 sm:h-48 sm:w-48 rounded-full" />
              </div>
            ) : statusDistribution.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry: any) => (
                        <span className="text-[10px] sm:text-xs text-muted-foreground">{value} ({entry.payload.value})</span>
                      )}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] sm:h-[250px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Pro vs Community Comparison
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Comparing Professional and Community services</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : serviceComparison.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceComparison} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis type="number" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={9} width={50} className="text-[9px]" />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="pro" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="community" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] sm:h-[250px] text-muted-foreground">
                No data available
              </div>
            )}
            <div className="flex justify-center gap-4 sm:gap-6 mt-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-amber-500" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Professional</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-blue-500" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Community</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Alert */}
      {pendingApprovals.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                <CardTitle className="text-sm sm:text-base">Pending Approvals ({stats?.pendingApprovals || 0})</CardTitle>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/submissions?tab=IN_REVIEW">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[400px] px-4 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">App Name</TableHead>
                      <TableHead className="text-xs sm:text-sm">Type</TableHead>
                      <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Submitted By</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.slice(0, 3).map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">{item.appName}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={item.appType === "PAID" ? "default" : "secondary"}
                            className={`text-[10px] sm:text-xs ${item.appType === "PAID" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30" : "bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30"}`}
                          >
                            {item.appType === "PAID" ? "PRO" : "FREE"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{item.ownerName}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                            <Link href={`/admin/submissions/${item.id}`}>Review</Link>
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Professional Testing Card */}
        <Card className="border-amber-500/20">
            <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10">
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base sm:text-lg">Professional Testing</CardTitle>
                                <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs">PAID</Badge>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
                        <Link href="/admin/submissions?appType=PAID">
                            View All <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                 <div className="grid gap-2 sm:gap-3 grid-cols-3">
                    <div className="bg-secondary/50 rounded-lg p-2 sm:p-3 text-center">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Submissions</p>
                        <p className="text-lg sm:text-xl font-bold">{stats?.submissionsByAppType?.PAID || 0}</p>
                    </div>
                     <div className="bg-secondary/50 rounded-lg p-2 sm:p-3 text-center">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Active Testers</p>
                        <p className="text-lg sm:text-xl font-bold">{Math.floor((stats?.totalTesters || 0) * 0.4)}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2 sm:p-3 text-center">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Feedback</p>
                        <p className="text-lg sm:text-xl font-bold">{Math.floor((stats?.totalFeedback || 0) * 0.3)}</p>
                    </div>
                </div>
                
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : recentProSubmissions.length > 0 ? (
                  <div className="space-y-2">
                    {recentProSubmissions.map((submission: any) => (
                      <div key={submission.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <span className="font-medium text-xs sm:text-sm truncate">{submission.appName}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] sm:text-xs flex-shrink-0",
                              submission.status === 'AVAILABLE' ? 'border-green-500/30 text-green-600' : 
                              submission.status === 'IN_REVIEW' ? 'border-amber-500/30 text-amber-600' : ''
                            )}
                          >
                            {submission.status?.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                          <Link href={`/admin/submissions/${submission.id}`}>
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-xs sm:text-sm">
                    No recent professional submissions
                  </div>
                )}
            </CardContent>
        </Card>

        {/* Community Testing Card */}
        <Card className="border-blue-500/20">
            <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10">
                            <Users2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base sm:text-lg">Community Testing</CardTitle>
                                <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs">FREE</Badge>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
                        <Link href="/admin/submissions?appType=FREE">
                            View All <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                 <div className="grid gap-2 sm:gap-3 grid-cols-3">
                    <div className="bg-secondary/50 rounded-lg p-2 sm:p-3 text-center">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Submissions</p>
                        <p className="text-lg sm:text-xl font-bold">{stats?.submissionsByAppType?.FREE || 0}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2 sm:p-3 text-center">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Active Users</p>
                        <p className="text-lg sm:text-xl font-bold">{Math.floor((stats?.totalUsers || 0) * 0.7)}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2 sm:p-3 text-center">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Feedback</p>
                        <p className="text-lg sm:text-xl font-bold">{Math.floor((stats?.totalFeedback || 0) * 0.7)}</p>
                    </div>
                </div>
                
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : recentCommunitySubmissions.length > 0 ? (
                  <div className="space-y-2">
                    {recentCommunitySubmissions.map((submission: any) => (
                      <div key={submission.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <span className="font-medium text-xs sm:text-sm truncate">{submission.appName}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] sm:text-xs flex-shrink-0",
                              submission.status === 'AVAILABLE' ? 'border-green-500/30 text-green-600' : 
                              submission.status === 'IN_REVIEW' ? 'border-amber-500/30 text-amber-600' :
                              submission.status === 'REJECTED' ? 'border-red-500/30 text-red-600' : ''
                            )}
                          >
                            {submission.status?.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                          <Link href={`/admin/submissions/${submission.id}`}>
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-xs sm:text-sm">
                    No recent community submissions
                  </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
