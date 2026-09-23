"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  FileClock,
  CheckCircle,
  Clock,
  Search,
  XCircle,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { HubSubmittedAppResponse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/safe-image";
import { cn } from "@/lib/utils";
import { AppPagination } from "@/components/app-pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useHubSubmittedApp } from "@/hooks/useHub";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper to filter out paid apps from displaying in the Handshake Testing
const filterFreeApps = (apps: HubSubmittedAppResponse[] | undefined) => {
  if (!apps) return [];
  return apps.filter((app) => app.appType !== "PAID");
};

const PROJECTS_PER_PAGE = 6;

const getStatusConfig = (status: HubSubmittedAppResponse["status"]) => {
  switch (status) {
    case "IN_REVIEW":
      return {
        icon: <Search className="w-3.5 h-3.5" />,
        label: "In Review",
        color: "text-muted-foreground",
        bgColor: "bg-muted",
        borderColor: "border-muted",
        description: "Our team is reviewing your submission.",
      };
    case "AVAILABLE":
      return {
        icon: <Clock className="w-3.5 h-3.5" />,
        label: "Available",
        color: "text-emerald-600",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        description: "Your app is available for testing.",
      };
    case "START_REQUESTED":
      return {
        icon: <Clock className="w-3.5 h-3.5" />,
        label: "Pending Approval",
        color: "text-amber-600",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        description: "Your start request is pending admin approval.",
      };
    case "IN_TESTING":
      return {
        icon: <Clock className="w-3.5 h-3.5" />,
        label: "In Testing",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        description: "Community members are actively testing your app.",
      };
    case "TESTING_ACTIVE":
      return {
        icon: <Clock className="w-3.5 h-3.5" />,
        label: "In Testing",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        description: "Community members are actively testing your app.",
      };
    case "COMPLETED":
      return {
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        label: "Completed",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        description: "Test cycle complete! Check your feedback.",
      };
    case "REJECTED":
      return {
        icon: <XCircle className="w-3.5 h-3.5" />,
        label: "Rejected",
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        description: "Submission rejected. Check review notes.",
      };
    default:
      return {
        icon: <FileClock className="w-3.5 h-3.5" />,
        label: "Draft",
        color: "text-muted-foreground",
        bgColor: "bg-muted",
        borderColor: "border-muted",
        description: "Your app is published and awaiting testers.",
      };
  }
};

const ProjectCardSkeleton = () => {
  return (
    <div className="rounded-[1.5rem] border border-border/40 bg-card/50 p-6 h-full flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="space-y-2 flex-grow">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="pt-4 border-t border-dashed border-border/50 flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
};

const ProjectCard = ({ project }: { project: HubSubmittedAppResponse }) => {
  const statusConfig = getStatusConfig(
    project.status as HubSubmittedAppResponse["status"],
  );

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group h-full"
    >
      <Link
        href={`/app/handshake-testing/my-submissions/${project.id}`}
        className="block h-full"
      >
        <Card className="h-full border-0 bg-background/40 hover:bg-background/60 backdrop-blur-md shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 rounded-[1.5rem] overflow-hidden relative ring-1 ring-border/50 hover:ring-emerald-500/20 flex flex-col">
          {/* Status color glowing accent */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-1 opacity-60 transition-all duration-300 group-hover:opacity-100",
              statusConfig.color.replace("text-", "bg-"),
            )}
          />

          <CardHeader className="p-6 pb-2 relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="relative">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-border/50 shadow-sm group-hover:shadow-md transition-shadow">
                  <SafeImage
                    src={project?.androidApp?.appLogoUrl}
                    alt={project?.androidApp?.appName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider border",
                    statusConfig.bgColor,
                    statusConfig.color,
                    statusConfig.borderColor,
                  )}
                >
                  {statusConfig.label}
                </Badge>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                  <Smartphone className="w-3 h-3" />
                  Android {project?.minimumAndroidVersion}+
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-emerald-600 transition-colors line-clamp-1">
                {project?.androidApp?.appName}
              </h3>
              <p className="text-xs font-mono text-muted-foreground mt-1 truncate opacity-70">
                {project?.androidApp?.packageName}
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-6 py-4 flex-grow relative z-10">
            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {project?.androidApp?.description}
            </p>
          </CardContent>

          <CardFooter className="p-0 mt-auto relative z-10">
            <div className="w-full bg-secondary/30 backdrop-blur-sm border-t border-border/40 p-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{project?.totalDay ?? 0} Days</span>
                </div>

                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(3, project?.totalTester || 0))].map(
                      (_, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[8px] overflow-hidden"
                        >
                          <div className="w-full h-full bg-gradient-to-tr from-emerald-500/20 to-emerald-600/5" />
                        </div>
                      ),
                    )}
                  </div>
                  <span className={cn("text-xs", statusConfig.color)}>
                    {project?.currentTester}/{project?.totalTester}
                  </span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-muted/30 via-transparent to-transparent border border-white/5 dark:border-white/5">
    {/* Ambient Background Glow */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] opacity-50" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-50" />
    </div>

    {/* floating 3D Animation Container */}
    <div className="relative mb-8 z-10 group">
      {/* Decorative orbital rings */}
      <div className="absolute inset-0 border border-emerald-500/20 rounded-full scale-[1.8] opacity-20 animate-[spin_10s_linear_infinite]" />
      <div className="absolute inset-0 border border-dashed border-emerald-500/20 rounded-full scale-[1.5] opacity-20 animate-[spin_15s_linear_infinite_reverse]" />

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-8, 8, -8] }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Main Card Element */}
        <div className="w-20 h-20 bg-gradient-to-br from-background via-muted to-muted/50 rounded-3xl shadow-2xl flex items-center justify-center border border-white/40 dark:border-white/10 relative z-10 backdrop-blur-md">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50" />
          <FileClock className="w-10 h-10 text-emerald-600 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </div>

        {/* Floating Abstract Elements */}
        <motion.div
          animate={{ y: [-5, 5, -5], x: [5, -5, 5] }}
          transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
          className="absolute -right-4 -top-4 bg-background/80 backdrop-blur-xl p-2 rounded-xl shadow-xl border border-white/20"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        </motion.div>

        <motion.div
          animate={{ y: [5, -5, 5], x: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 5, delay: 1 }}
          className="absolute -left-3 -bottom-3 bg-background/80 backdrop-blur-xl p-2 rounded-xl shadow-xl border border-white/20"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </motion.div>

        {/* Glossy overlay effect */}
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </motion.div>
    </div>

    {/* Content */}
    <div className="relative z-10 text-center max-w-sm px-6">
      <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
        Your Showcase is Empty
      </h3>
      <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
        Ready to launch? Submit your app to start gathering valuable feedback.
      </p>

      <Button
        asChild
        className="h-11 px-8 rounded-full bg-gradient-to-b from-emerald-600/80 to-emerald-700/80 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300"
      >
        <Link
          href="/app/handshake-testing/submit"
          className="flex items-center gap-2"
        >
          <span>Submit App</span>
          <PlusCircle className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  </div>
);

const PaginatedProjectList = ({
  projects,
  isLoading,
}: {
  projects: HubSubmittedAppResponse[] | undefined;
  isLoading: boolean;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((projects?.length || 0) / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = projects?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[320px]">
            <ProjectCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-[400px]"
      >
        {currentProjects && currentProjects?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {currentProjects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
        {currentProjects && currentProjects.length > 0 && (
          <div className="mt-8">
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

type MyAppsFilter = "all" | "pending" | "testing" | "completed";

const FILTER_OPTIONS: { label: string; value: MyAppsFilter }[] = [
  { label: "All apps", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Testing", value: "testing" },
  { label: "Completed", value: "completed" },
];

export function MySubmissionsSection() {
  // Single flat list with a right-aligned status filter (no sub-tabs).
  const [filter, setFilter] = useState<MyAppsFilter>("all");

  // Pending: In Review + Rejected merged (In Review first, newest first).
  const { data: inReviewApps, isPending: inReviewIsPending } =
    useHubSubmittedApp({ type: "IN_REVIEW" });
  const { data: rejectedApps, isPending: rejectedIsPending } =
    useHubSubmittedApp({ type: "REJECTED" });

  // Testing: IN_TESTING (backend also folds in WAITING_FOR_PARTNERS +
  // TESTING_ACTIVE) + AVAILABLE.
  const { data: testingApps, isPending: testingIsPending } =
    useHubSubmittedApp({ type: "IN_TESTING" });
  const { data: availableAppsData, isPending: availableAppsIsPending } =
    useHubSubmittedApp({ type: "AVAILABLE" });

  const { data: completedApps, isPending: completedIsPending } =
    useHubSubmittedApp({ type: "COMPLETED" });

  const byNewest = (
    a: HubSubmittedAppResponse,
    b: HubSubmittedAppResponse,
  ) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  };

  const pendingApps = [
    ...[...(inReviewApps ?? [])].sort(byNewest),
    ...[...(rejectedApps ?? [])].sort(byNewest),
  ];
  const testingAppsMerged = [...(testingApps || []), ...(availableAppsData || [])];

  const displayDataRaw =
    filter === "pending"
      ? pendingApps
      : filter === "testing"
        ? testingAppsMerged
        : filter === "completed"
          ? completedApps
          : [...pendingApps, ...testingAppsMerged, ...(completedApps ?? [])].sort(
              byNewest,
            );

  const displayData = filterFreeApps(displayDataRaw);

  const displayIsPending =
    inReviewIsPending ||
    rejectedIsPending ||
    testingIsPending ||
    availableAppsIsPending ||
    completedIsPending;

  return (
    <div className="w-full">
      <div className="flex items-center justify-end mb-4">
        <Select
          value={filter}
          onValueChange={(v) => setFilter(v as MyAppsFilter)}
        >
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue placeholder="Filter apps" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-h-[500px]">
        <PaginatedProjectList
          projects={displayData}
          isLoading={displayIsPending}
        />
      </div>
    </div>
  );
}
