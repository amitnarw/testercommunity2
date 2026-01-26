"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  PlusCircle,
  Star,
  LayoutPanelLeft,
  Activity,
  XCircle,
  Gamepad2,
  History,
  AlertCircle,
  Search,
  Clock,
  Smartphone,
  ClipboardList,
  FlaskConical,
  ChevronRight,
  Calendar,
  Ban,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CustomTabsList } from "@/components/custom-tabs-list";
import { CommunityAvailableAppCard } from "@/components/community-available-app-card";
import { CommunityOngoingAppCard } from "@/components/community-ongoing-app-card";
import Link from "next/link";
import { AppPagination } from "@/components/app-pagination";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import { Badge } from "@/components/ui/badge";
import type { HubSubmittedAppResponse } from "@/lib/types";
import SubTabUI from "@/components/sub-tab-ui";
import { useHubApps, useHubAppsCount, useHubData } from "@/hooks/useHub";
import { AppCardSkeleton } from "@/components/app-card-skeleton";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const APPS_PER_PAGE = 6;

const BentoCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-card rounded-2xl p-4 flex flex-col justify-between ${className}`}
  >
    {children}
  </div>
);

const PaginatedAppList = ({
  apps,
  emptyMessage,
  emptyTitle = "No Apps Found",
  emptyIcon: Icon = Search,
  card: CardComponent,
  isLoading,
}: {
  apps: HubSubmittedAppResponse[];
  emptyMessage: string;
  emptyTitle?: string;
  emptyIcon?: React.ElementType;
  card: React.FC<{ app: HubSubmittedAppResponse }>;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <AppCardSkeleton key={i} />
        ))}
      </motion.div>
    );
  }
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(apps.length / APPS_PER_PAGE);
  const startIndex = (currentPage - 1) * APPS_PER_PAGE;
  const endIndex = startIndex + APPS_PER_PAGE;
  const currentApps = apps.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentApps.map((app) => (
              <CardComponent key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card/50 rounded-3xl border border-dashed border-muted-foreground/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="p-6 bg-primary/10 rounded-full mb-6 relative z-10 ring-8 ring-primary/5"
            >
              <Icon className="w-10 h-10 text-primary" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2 relative z-10">
              {emptyTitle}
            </h3>
            <p className="text-muted-foreground max-w-sm relative z-10 px-4">
              {emptyMessage}
            </p>
          </div>
        )}
      </motion.div>
      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

const RequestedAppCard = ({ app }: { app: HubSubmittedAppResponse }) => (
  <Link href={`/community-dashboard/${app.id}`} className="group block h-full">
    <div className="relative h-full flex flex-col overflow-hidden rounded-3xl bg-card border border-border/50 hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_-15px_rgba(249,115,22,0.2)] dark:hover:shadow-[0_10px_40px_-20px_rgba(249,115,22,0.1)] hover:-translate-y-1">
      {/* Decorative Gradient Blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-orange-500/10" />

      <div className="p-5 flex-grow flex flex-col relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <SafeImage
              src={app?.androidApp?.appLogoUrl}
              alt={app?.androidApp?.appName}
              width={72}
              height={72}
              className="relative z-10 rounded-2xl border border-border/40 shadow-sm object-cover bg-background"
              data-ai-hint={app?.androidApp?.appName}
            />
          </div>
          <Badge
            variant="outline"
            className="rounded-full px-3 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800"
          >
            Requested
          </Badge>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-card-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 line-clamp-1 mb-2">
            {app?.androidApp?.appName}
          </h3>
          <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {app?.androidApp?.description}
          </p>
        </div>

        {/* Meta Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/40 px-2.5 py-1.5 rounded-md border border-transparent group-hover:border-orange-500/10 transition-colors">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android {app?.minimumAndroidVersion}+</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/40 px-2.5 py-1.5 rounded-md border border-transparent group-hover:border-orange-500/10 transition-colors">
            <History className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const RejectedRequestCard = ({ app }: { app: HubSubmittedAppResponse }) => (
  <Link href={`/community-dashboard/${app.id}`} className="group block h-full">
    <div className="relative h-full flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-destructive/20 to-white/5 border border-destructive/20 hover:border-destructive/50 dark:border-red-900/50 dark:hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_-15px_rgba(239,68,68,0.2)] dark:hover:shadow-[0_10px_40px_-20px_rgba(239,68,68,0.3)] hover:-translate-y-1">
      <div className="p-5 flex-grow flex flex-col relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4 items-start">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-destructive/20 dark:bg-red-900/30 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <SafeImage
                src={app?.androidApp?.appLogoUrl}
                alt={app?.androidApp?.appName}
                width={60}
                height={60}
                className="relative z-10 rounded-2xl border border-destructive/20 dark:border-red-900/50 shadow-sm object-cover bg-background"
                data-ai-hint={app?.androidApp?.appName}
              />
              <div className="absolute -bottom-1.5 -right-1.5 z-20 bg-background dark:bg-zinc-950 rounded-full p-0.5 border border-border dark:border-zinc-800">
                <div className="bg-destructive dark:bg-red-600 text-destructive-foreground rounded-full p-0.5">
                  <XCircle className="w-3 h-3" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-card-foreground group-hover:text-destructive dark:group-hover:text-red-400 transition-colors duration-300 line-clamp-1">
                {app?.androidApp?.appName}
              </h3>
              <p className="text-xs text-muted-foreground dark:text-zinc-400 line-clamp-1 mt-0.5">
                {app?.androidApp?.appCategory?.name || "App"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant="destructive"
              className="rounded-full px-2.5 py-0.5 bg-destructive/10 dark:bg-red-950/50 text-destructive dark:text-red-400 border-destructive/20 dark:border-red-900/50 font-medium text-[10px] uppercase tracking-wider"
            >
              Rejected
            </Badge>
          </div>
        </div>

        {/* Rejection Reason Box */}
        <div className="mt-1 mb-4 p-3.5 rounded-xl bg-gradient-to-br from-destructive/5 to-destructive/10 dark:from-red-950/30 dark:to-red-900/10 border border-destructive/10 dark:border-red-900/30 group-hover:border-destructive/20 dark:group-hover:border-red-800/50 transition-colors">
          <h4 className="text-destructive dark:text-red-400 font-semibold text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
            <Ban className="w-3.5 h-3.5" />
            {app?.statusDetails?.title || "Rejection Reason"}
          </h4>
          <p className="text-sm text-destructive/80 dark:text-red-300/80 line-clamp-3 leading-relaxed">
            {app?.statusDetails?.description ||
              "Your application was not approved. Please review the requirements and try again."}
          </p>
        </div>

        {/* Footer Meta Data */}
        <div className="mt-auto pt-3 border-t border-destructive/10 dark:border-red-900/20 flex items-center justify-between text-xs text-muted-foreground/80 dark:text-zinc-500">
          <div className="flex items-center gap-1.5" title="Missed Reward">
            <Star className="w-3.5 h-3.5 text-orange-400/70 dark:text-orange-400/60 fill-orange-400/20" />
            <span className="font-medium line-through opacity-70">
              {app?.rewardPoints} pts
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 text-muted-foreground dark:text-zinc-500"
            title="Date Rejected"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {app?.updatedAt ? format(new Date(app.updatedAt), "MMM d") : ""}
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 bg-secondary/30 dark:bg-zinc-800/50 px-2 py-1 rounded-md"
            title="Required Android Version"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{app?.minimumAndroidVersion}+</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

// Card for apps where tester is approved but testing hasn't started (waiting for min testers)
const ApprovedAppCard = ({ app }: { app: HubSubmittedAppResponse }) => {
  const testerProgressPercentage = Math.min(
    ((app?.currentTester || 0) / (app?.totalTester || 1)) * 100,
    100,
  );

  return (
    <Link
      href={`/community-dashboard/${app.id}/ongoing`}
      className="group block h-full"
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-3xl bg-card border border-amber-500/30 hover:border-amber-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_-15px_rgba(245,158,11,0.2)] dark:hover:shadow-[0_10px_40px_-20px_rgba(245,158,11,0.1)] hover:-translate-y-1">
        {/* Decorative Gradient Blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-amber-500/10" />

        <div className="p-5 flex-grow flex flex-col relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <SafeImage
                src={app?.androidApp?.appLogoUrl}
                alt={app?.androidApp?.appName}
                width={72}
                height={72}
                className="relative z-10 rounded-2xl border border-border/40 shadow-sm object-cover bg-background"
                data-ai-hint={app?.androidApp?.appName}
              />
            </div>
            <Badge
              variant="outline"
              className="rounded-full px-3 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Approved
            </Badge>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-card-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300 line-clamp-1 mb-2">
              {app?.androidApp?.appName}
            </h3>
            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {app?.androidApp?.description}
            </p>
          </div>

          {/* Meta Tags */}
          <div className="flex flex-wrap gap-2 mb-4 mt-auto">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/40 px-2.5 py-1.5 rounded-md border border-transparent group-hover:border-amber-500/10 transition-colors">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android {app?.minimumAndroidVersion}+</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-md border border-amber-500/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Waiting to Start</span>
            </div>
          </div>
        </div>

        {/* Footer - Testers Progress */}
        <div className="relative p-4 pt-0 mt-auto z-10">
          <div className="flex flex-col gap-3 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 group-hover:border-amber-500/20 transition-colors duration-300">
            <div className="w-full">
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-2 font-medium">
                <span>Testers Joining</span>
                <span className="text-amber-600 dark:text-amber-400">
                  {app?.currentTester || 0}/{app?.totalTester || 0}
                </span>
              </div>
              <div className="h-2 bg-amber-100 dark:bg-amber-950/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${testerProgressPercentage}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 text-center">
              Testing will begin once all testers have joined
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

function CommunityDashboardContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Most Recent");

  const [selectedTab, setSelectedTab] = useState(
    searchParams.get("tab") || "available",
  );
  const [requestsSubTab, setRequestsSubTab] = useState(
    (searchParams.get("tab") === "requests"
      ? searchParams.get("subtab")
      : "pending") || "pending",
  );
  const [runningSubTab, setRunningSubTab] = useState(
    (searchParams.get("tab") === "running"
      ? searchParams.get("subtab")
      : "in-progress") || "in-progress",
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    const subtab = searchParams.get("subtab");
    if (tab) setSelectedTab(tab);
    if (subtab) {
      if (tab === "requests") setRequestsSubTab(subtab);
      if (tab === "running") setRunningSubTab(subtab);
    }
  }, [searchParams]);

  const updateUrl = (newTab: string, newSubTab?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    if (newSubTab) {
      params.set("subtab", newSubTab);
    } else {
      params.delete("subtab");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleMainTabChange = (val: string) => {
    setSelectedTab(val);
    let nextSubTab = undefined;
    if (val === "requests") nextSubTab = requestsSubTab;
    else if (val === "running") nextSubTab = runningSubTab;
    updateUrl(val, nextSubTab);
  };

  const handleRequestsSubTabChange = (val: string) => {
    setRequestsSubTab(val);
    updateUrl("requests", val);
  };

  const handleRunningSubTabChange = (val: string) => {
    setRunningSubTab(val);
    updateUrl("running", val);
  };

  const getBackendType = () => {
    if (selectedTab === "available") return "AVAILABLE";
    if (selectedTab === "running") {
      switch (runningSubTab) {
        case "in-progress":
          return "IN_TESTING";
        case "waiting-to-start":
          return "APPROVED";
        default:
          return "APPROVED";
      }
    }
    if (selectedTab === "requests") {
      switch (requestsSubTab) {
        case "pending":
          return "REQUESTED";
        case "rejected":
          return "REJECTED";
        default:
          return "REQUESTED";
      }
    }
    return "AVAILABLE";
  };
  const backendType = getBackendType();

  const { data: hubAppsData, isPending: hubAppsIsPending } = useHubApps({
    type: backendType,
  });

  const { data: hubDataCount, isPending: hubDataCountIsPending } =
    useHubAppsCount();

  // Requests count = Pending (requested) + Rejected
  const requestsCount =
    (hubDataCount?.["REQUESTED"] || 0) + (hubDataCount?.["REJECTED"] || 0);

  // Running count = Active (in_testing) + Approved (accepted)
  const runningCount =
    (hubDataCount?.["IN_TESTING"] || 0) + (hubDataCount?.["ACCEPTED"] || 0);

  const completedCount = hubDataCount?.["COMPLETED"] || 0;

  const tabs = [
    {
      label: "Available",
      value: "available",
      count: hubDataCount?.["AVAILABLE"] || 0,
      icon: Search,
      description: "Browse & apply for testing",
    },
    {
      label: "Requests",
      value: "requests",
      count: requestsCount,
      icon: ClipboardList,
      description: "App approvals & rejections",
    },
    {
      label: "Running",
      value: "running",
      count: runningCount,
      icon: FlaskConical,
      description: "Active tests & approved apps",
    },
  ];

  const requestTabs = [
    {
      label: "Awaiting Approval",
      value: "pending",
      count: hubDataCount?.["REQUESTED"] || 0,
    },
    {
      label: "Rejected",
      value: "rejected",
      count: hubDataCount?.["REJECTED"] || 0,
    },
  ];

  const runningSubTabs = [
    {
      label: "In Progress",
      value: "in-progress",
      count: hubDataCount?.["IN_TESTING"] || 0,
    },
    {
      label: "Waiting to Start",
      value: "waiting-to-start",
      count: hubDataCount?.["ACCEPTED"] || 0,
    },
  ];

  const { data: hubData, isPending: hubIsPending } = useHubData();

  const appsSubmitted = hubData?.appsSubmitted || 0;
  const testersEngaged = hubData?.testersEngaged || 0;
  const testsCompleted = hubData?.testsCompleted || 0;

  const openPage = (page: string) => {
    router.push(page);
  };

  return (
    <div data-loc="CommunityDashboardPage" className="min-h-screen mb-8">
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-12">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset] pb-2">
              Community Hub
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Test apps, earn points, and help fellow developers build better
              products.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <BentoCard className="col-span-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Activity className="w-4 h-4" /> Performance
              </CardTitle>
              <div className="grid grid-cols-3 gap-2 w-full mt-2">
                <div className="text-center bg-secondary p-2 rounded-lg">
                  {hubIsPending ? (
                    <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  ) : (
                    <p className="text-2xl font-bold">{appsSubmitted}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Apps Submitted
                  </p>
                </div>
                <div className="text-center bg-secondary p-2 rounded-lg">
                  {hubIsPending ? (
                    <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  ) : (
                    <p className="text-2xl font-bold">{testersEngaged}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Testers Engaged
                  </p>
                </div>
                <div className="text-center bg-secondary p-2 rounded-lg">
                  {hubIsPending ? (
                    <Skeleton className="h-8 w-16 mx-auto mb-1" />
                  ) : (
                    <p className="text-2xl font-bold">{testsCompleted}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Tests Done</p>
                </div>
              </div>
            </BentoCard>

            <div className="flex flex-row gap-2 col-span-2">
              <BentoCard className="bg-gradient-to-br from-primary to-primary/40 text-primary-foreground relative overflow-hidden w-5/12 sm:w-1/2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Star className="absolute top-5 left-5 scale-[6] text-white/20 rotate-45 w-4 h-4" />{" "}
                  My Points
                </CardTitle>
                {hubIsPending ? (
                  <Skeleton className="h-12 w-32 mx-auto my-auto" />
                ) : (
                  <p className="text-3xl sm:text-5xl font-bold text-center my-auto">
                    {hubData?.wallet || 0}
                  </p>
                )}
              </BentoCard>

              <BentoCard className="w-7/12 sm:w-1/2 !p-2.5 sm:!p-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  My Testing
                </CardTitle>
                <div className="grid grid-rows-2 grid-cols-1 sm:grid-cols-2 sm:grid-rows-1 gap-2 w-full mt-2 h-full">
                  <div className="text-center bg-secondary px-4 rounded-lg flex flex-row sm:flex-col items-center justify-between sm:justify-center">
                    <p className="text-xs text-muted-foreground">Running</p>
                    {hubDataCountIsPending ? (
                      <Skeleton className="h-8 w-12 sm:mx-auto" />
                    ) : (
                      <p className="text-2xl font-bold">{runningCount}</p>
                    )}
                  </div>
                  <div className="text-center bg-secondary px-4 rounded-lg flex flex-row sm:flex-col items-center justify-between sm:justify-center">
                    <p className="text-xs text-muted-foreground">Requests</p>
                    {hubDataCountIsPending ? (
                      <Skeleton className="h-8 w-12 sm:mx-auto" />
                    ) : (
                      <p className="text-2xl font-bold">{requestsCount}</p>
                    )}
                  </div>
                </div>
              </BentoCard>
            </div>

            <BentoCard className="flex !flex-row sm:!flex-col gap-2 col-span-2 lg:col-span-1 !p-2.5 sm:!p-4">
              <Button
                className="w-full justify-start h-full bg-gradient-to-b from-primary to-primary/40 text-primary-foreground p-2 sm:p-auto"
                onClick={() => openPage("/community-dashboard/submit")}
              >
                <PlusCircle className="absolute sm:static left-0 top-0 scale-[2] text-white/20 sm:left-auto sm:top-auto sm:scale-[1] sm:text-white mr-2 h-4 w-4" />
                <p className="text-center sm:text-start w-full">
                  Submit New App
                </p>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-full p-2 sm:p-auto"
                onClick={() => openPage("/community-dashboard/my-submissions")}
              >
                <LayoutPanelLeft className="absolute sm:static left-0 top-0 scale-[2] text-black/10 dark:text-white/15 sm:left-auto sm:top-auto sm:scale-[1] sm:text-black dark:sm:text-white mr-2 h-4 w-4" />
                <p className="text-center sm:text-start w-full">
                  My Submissions
                </p>
              </Button>
            </BentoCard>
          </div>
        </header>

        <main>
          <Tabs
            value={selectedTab}
            onValueChange={handleMainTabChange}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Available Apps</h2>
                <p className="text-muted-foreground">
                  Browse apps that need testing from the community.
                </p>
              </div>
              <div className="flex gap-2 flex-row items-center justify-end w-full md:w-auto">
                <Button
                  onClick={() => openPage("/community-dashboard/history")}
                  className="group relative h-10 pl-4 pr-2 rounded-full bg-background border border-border hover:border-primary/50 hover:bg-muted/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md hover:shadow-primary/5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                      <History className="w-3 h-3" />
                    </span>

                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      History
                    </span>

                    <div className="w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all duration-300 ml-0.5">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 rounded-xl">
                      <ArrowUpDown className="h-4 w-4" /> Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    {["Most Recent", "Most Rewarding", "Time to Test"].map(
                      (cat) => (
                        <DropdownMenuItem
                          key={cat}
                          onClick={() => setSort(cat)}
                        >
                          {cat}
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CustomTabsList
              tabs={tabs}
              activeTab={selectedTab}
              className="sticky top-0 z-30 backdrop-blur-xl py-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6"
            />
            <TabsContent value="available">
              <PaginatedAppList
                apps={hubAppsData || []}
                emptyTitle="No Available Apps"
                emptyMessage="No available apps for testing right now. Check back soon!"
                emptyIcon={Gamepad2}
                card={CommunityAvailableAppCard}
                isLoading={hubAppsIsPending}
              />
            </TabsContent>
            <TabsContent value="requests" className="mt-6">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Track your test requests here. Apps you've applied for will
                  show up as "Awaiting Approval" until the developer reviews
                  your request.
                </p>
              </div>
              <SubTabUI
                pendingTabs={requestTabs}
                setPendingSubTab={handleRequestsSubTabChange}
                pendingSubTab={requestsSubTab}
              />

              {requestsSubTab === "pending" && (
                <PaginatedAppList
                  apps={hubAppsData || []}
                  emptyTitle="No Pending Requests"
                  emptyMessage="You haven't applied to test any apps yet. Browse available apps to get started!"
                  emptyIcon={Clock}
                  card={RequestedAppCard}
                  isLoading={hubAppsIsPending}
                />
              )}
              {requestsSubTab === "rejected" && (
                <PaginatedAppList
                  apps={hubAppsData || []}
                  emptyTitle="No Rejected Requests"
                  emptyMessage="None of your requests have been declined. Keep applying to test more apps!"
                  emptyIcon={AlertCircle}
                  card={RejectedRequestCard}
                  isLoading={hubAppsIsPending}
                />
              )}
            </TabsContent>
            <TabsContent value="running" className="mt-6">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  These are the apps you're currently testing or waiting to
                  start. Complete daily tasks to earn points!
                </p>
              </div>
              <SubTabUI
                pendingTabs={runningSubTabs}
                setPendingSubTab={handleRunningSubTabChange}
                pendingSubTab={runningSubTab}
              />

              {runningSubTab === "in-progress" && (
                <PaginatedAppList
                  apps={hubAppsData || []}
                  emptyTitle="No Tests in Progress"
                  emptyMessage="You're not testing any apps right now. Apply for testing from the Available tab!"
                  emptyIcon={FlaskConical}
                  card={CommunityOngoingAppCard}
                  isLoading={hubAppsIsPending}
                />
              )}
              {runningSubTab === "waiting-to-start" && (
                <PaginatedAppList
                  apps={hubAppsData || []}
                  emptyTitle="No Apps Waiting to Start"
                  emptyMessage="You don't have any approved apps waiting for other testers to join. Apps appear here once the developer accepts your request!"
                  emptyIcon={Clock}
                  card={ApprovedAppCard}
                  isLoading={hubAppsIsPending}
                />
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default function CommunityDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CommunityDashboardContent />
    </Suspense>
  );
}
