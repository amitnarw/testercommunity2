"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  DollarSign,
  Briefcase,
  Bell,
  Activity,
  Clock,
  Loader2,
  Package,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  useTesterProjects,
  useUpdateTesterAvailability,
} from "@/hooks/useTester";
import { useUserWallet } from "@/hooks/useUserWallet";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const AVAILABILITY_OPTIONS = [
  {
    value: "AVAILABLE",
    label: "Available",
    dotClass: "bg-green-500",
    desc: "Ready for new tests",
    color: "#22c55e",
  },
  {
    value: "BUSY",
    label: "Busy",
    dotClass: "bg-yellow-500",
    desc: "At capacity right now",
    color: "#eab308",
  },
  {
    value: "AWAY",
    label: "Away",
    dotClass: "bg-orange-500",
    desc: "Temporarily unavailable",
    color: "#f97316",
  },
  {
    value: "DO_NOT_DISTURB",
    label: "Do Not Disturb",
    dotClass: "bg-red-500",
    desc: "Not accepting tests",
    color: "#ef4444",
  },
];

import { StatusDropdown } from "@/components/dashboard/status-dropdown";

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-8 w-12" />
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TesterDashboardPage() {
  const { toast } = useToast();
  const [availability, setAvailability] = useState("AVAILABLE");

  const { data: projects, isLoading, isError, error } = useTesterProjects();
  const { data: walletData, isLoading: isWalletLoading } = useUserWallet();

  const updateAvailability = useUpdateTesterAvailability({
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Your availability has been updated.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update availability status.",
      });
    },
  });

  const handleAvailabilityChange = (value: string) => {
    setAvailability(value);
    updateAvailability.mutate(value);
  };

  const currentOption =
    AVAILABILITY_OPTIONS.find((o) => o.value === availability) ||
    AVAILABILITY_OPTIONS[0];

  // Compute real stats from projects data
  const activeProjects =
    projects?.filter(
      (p) => p.testerStatus === "IN_PROGRESS" || p.testerStatus === "PENDING",
    ) || [];

  const pendingActionProjects = activeProjects.filter((project) => {
    const currentDayToSubmit = project.daysCompleted + 1;
    if (currentDayToSubmit > project.totalDay) return false;

    const todayVerification = project.dailyVerifications?.find(
      (v) => v.dayNumber === currentDayToSubmit,
    );

    if (!todayVerification || todayVerification.status === "REJECTED") {
      return true;
    }

    return false;
  });

  const completedProjects =
    projects?.filter((p) => p.testerStatus === "COMPLETED") || [];

  const totalPoints = walletData?.totalPoints || 0;

  const totalFeedback =
    projects?.reduce((acc, p) => acc + (p.feedbackCount || 0), 0) || 0;

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-0 sm:pt-0">
      {/* Header with Availability Toggle */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Tester Dashboard
          </h2>
          <p className="text-muted-foreground">
            Your central hub for testing projects and earnings.
          </p>
        </div>
        <StatusDropdown
          options={AVAILABILITY_OPTIONS}
          value={availability}
          onChange={handleAvailabilityChange}
        />
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <Card className="p-8 text-center">
          <p className="text-red-500">
            Failed to load dashboard: {error?.message}
          </p>
        </Card>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden p-5 bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
              <div className="absolute -right-2 -top-2 opacity-20 scale-[2.5] -rotate-12 transition-transform duration-500 group-hover:scale-[3]">
                <DollarSign className="w-12 h-12" />
              </div>
              <div className="relative">
                <p className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                  Wallet Balance
                </p>
                <div className="text-2xl sm:text-3xl font-bold mt-1 text-white">
                  {isWalletLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {totalPoints.toLocaleString()}{" "}
                      <span className="text-base font-normal text-white/80">
                        Pts
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden p-5 group hover:shadow-lg transition-all duration-300">
              <div className="absolute -right-2 -top-2 opacity-[0.08] dark:opacity-[0.15] scale-[2.5] -rotate-12 text-blue-500 transition-transform duration-500 group-hover:scale-[3] group-hover:-rotate-45">
                <Activity className="w-12 h-12" />
              </div>
              <p className="text-xs text-muted-foreground font-medium relative z-10">
                Active Projects
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 relative z-10">
                {activeProjects.length}
              </p>
            </Card>

            <Card className="relative overflow-hidden p-5 group hover:shadow-lg transition-all duration-300">
              <div className="absolute -right-2 -top-2 opacity-[0.08] dark:opacity-[0.15] scale-[2.5] -rotate-12 text-green-500 transition-transform duration-500 group-hover:scale-[3] group-hover:-rotate-45">
                <CheckCircle className="w-12 h-12" />
              </div>
              <p className="text-xs text-muted-foreground font-medium relative z-10">
                Completed
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 relative z-10">
                {completedProjects.length}
              </p>
            </Card>

            <Card className="relative overflow-hidden p-5 group hover:shadow-lg transition-all duration-300">
              <div className="absolute -right-2 -top-2 opacity-[0.08] dark:opacity-[0.15] scale-[2.5] -rotate-12 text-purple-500 transition-transform duration-500 group-hover:scale-[3] group-hover:-rotate-45">
                <Package className="w-12 h-12" />
              </div>
              <p className="text-xs text-muted-foreground font-medium relative z-10">
                Feedbacks
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 relative z-10">
                {totalFeedback}
              </p>
            </Card>
          </div>

          {/* Action Required Section */}
          {pendingActionProjects.length > 0 && (
            <Card className="border-orange-500/50 dark:border-orange-500/30 bg-orange-50/50 dark:bg-orange-500/5 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Bell className="w-5 h-5" /> Action Required Today
                  </CardTitle>
                  <CardDescription>
                    These tests require your daily screenshot or have rejected
                    verifications.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mt-2">
                  {pendingActionProjects.slice(0, 3).map((project) => {
                    const currentDayToSubmit = project.daysCompleted + 1;
                    const verification = project.dailyVerifications?.find(
                      (v) => v.dayNumber === currentDayToSubmit,
                    );
                    const isRejected = verification?.status === "REJECTED";

                    return (
                      <Link
                        key={project.id}
                        href={`/tester/projects/${project.id}`}
                        className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-border/50 hover:border-orange-300 dark:hover:border-orange-500/50 transition-colors group"
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={project.appLogo} />
                          <AvatarFallback>
                            {project.appName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {project.appName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isRejected ? (
                              <span className="text-red-500 font-medium">
                                Verification Rejected - Please re-upload
                              </span>
                            ) : (
                              <span className="text-orange-600 dark:text-orange-400">
                                Day {currentDayToSubmit} screenshot pending
                              </span>
                            )}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant={isRejected ? "destructive" : "default"}
                          className="shrink-0 h-8"
                        >
                          {isRejected ? "Re-upload" : "Submit"}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Projects Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Tests currently in progress.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/tester/projects">
                  View All <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {activeProjects.length === 0 ? (
                <div className="text-center py-10">
                  <Briefcase className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No active tests right now.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <Link href="/tester/projects">
                      Browse Available Projects
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeProjects.slice(0, 5).map((project) => {
                    const progress =
                      project.totalDay > 0
                        ? Math.round(
                            (project.daysCompleted / project.totalDay) * 100,
                          )
                        : 0;
                    return (
                      <Link
                        key={project.id}
                        href={`/tester/projects/${project.id}`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={project.appLogo} />
                          <AvatarFallback>
                            {project.appName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="font-medium text-sm truncate">
                              {project.appName}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-[10px] shrink-0 bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800"
                            >
                              Day {project.daysCompleted}/{project.totalDay}
                            </Badge>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recently Completed */}
          {completedProjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recently Completed</CardTitle>
                <CardDescription>Tests you&apos;ve finished.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedProjects.slice(0, 5).map((project) => {
                  const earnings = (project.rewardPoints || 0) * 5;
                  return (
                    <Link
                      key={project.id}
                      href={`/tester/projects/${project.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={project.appLogo} />
                        <AvatarFallback>
                          {project.appName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {project.appName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {project.category}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-green-600">
                          +₹{earnings.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {project.completedAt
                            ? new Date(project.completedAt).toLocaleDateString(
                                "en-IN",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : ""}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
