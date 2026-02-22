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
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const AVAILABILITY_OPTIONS = [
  {
    value: "AVAILABLE",
    label: "Available",
    dotClass: "bg-green-500",
    desc: "Ready for new tests",
  },
  {
    value: "BUSY",
    label: "Busy",
    dotClass: "bg-yellow-500",
    desc: "At capacity right now",
  },
  {
    value: "AWAY",
    label: "Away",
    dotClass: "bg-orange-500",
    desc: "Temporarily unavailable",
  },
  {
    value: "DO_NOT_DISTURB",
    label: "Do Not Disturb",
    dotClass: "bg-red-500",
    desc: "Not accepting tests",
  },
];

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
  const completedProjects =
    projects?.filter((p) => p.testerStatus === "COMPLETED") || [];
  const totalEarnings = completedProjects.reduce(
    (acc, p) => acc + (p.rewardPoints || 0) * 5,
    0,
  );
  const totalFeedback =
    projects?.reduce((acc, p) => acc + (p.feedbackCount || 0), 0) || 0;

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-0 sm:pt-0">
      {/* Header with Availability Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Tester Dashboard
          </h2>
          <p className="text-muted-foreground">
            Your central hub for testing projects and earnings.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-card border rounded-xl px-3 py-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${currentOption.dotClass} ring-2 ring-background shrink-0 animate-pulse`}
          />
          <Select value={availability} onValueChange={handleAvailabilityChange}>
            <SelectTrigger className="w-[180px] h-8 border-0 bg-transparent shadow-none px-0 focus:ring-0">
              <SelectValue placeholder="Set Status" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABILITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${option.dotClass}`}
                    />
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      — {option.desc}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
              <div className="relative">
                <p className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3" /> Lifetime Earnings
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 text-white">
                  ₹{totalEarnings.toLocaleString("en-IN")}
                </p>
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-blue-500" /> Active Projects
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">
                {activeProjects.length}
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-green-500" /> Completed
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">
                {completedProjects.length}
              </p>
            </Card>

            <Card className="p-5">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Package className="w-3 h-3 text-purple-500" /> Feedbacks
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">
                {totalFeedback}
              </p>
            </Card>
          </div>

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
