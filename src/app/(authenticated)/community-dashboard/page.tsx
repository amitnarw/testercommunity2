"use client";

import { useState } from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ListFilter,
  ArrowUpDown,
  PlusCircle,
  Star,
  LayoutPanelLeft,
  Activity,
  XCircle,
  Gamepad2,
  Trophy,
  History,
  AlertCircle,
  Rocket,
  Search,
  Clock,
  Timer,
  Smartphone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projects as allProjects } from "@/lib/data";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CustomTabsList } from "@/components/custom-tabs-list";
import { CommunityAvailableAppCard } from "@/components/community-available-app-card";
import { CommunityOngoingAppCard } from "@/components/community-ongoing-app-card";
import { CommunityCompletedAppCard } from "@/components/community-completed-app-card";
import Link from "next/link";
import { AppPagination } from "@/components/app-pagination";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { SafeImage } from "@/components/safe-image";
import { Badge } from "@/components/ui/badge";
import type { HubSubmittedAppResponse } from "@/lib/types";
import SubTabUI from "@/components/sub-tab-ui";
import { useHubApps, useHubAppsCount, useHubData } from "@/hooks/useUser";
import { useTransitionRouter } from "@/context/transition-context";
import { AppCardSkeleton } from "@/components/app-card-skeleton";

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
    <div className="relative h-full flex flex-col overflow-hidden rounded-3xl bg-card border border-destructive/20 hover:border-destructive/50 transition-all duration-500 hover:shadow-[0_10px_40px_-15px_rgba(239,68,68,0.2)] dark:hover:shadow-[0_10px_40px_-20px_rgba(239,68,68,0.1)] hover:-translate-y-1">
      {/* Decorative Gradient Blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-destructive/10" />

      <div className="p-5 flex-grow flex flex-col relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <SafeImage
              src={app?.androidApp?.appLogoUrl}
              alt={app?.androidApp?.appName}
              width={72}
              height={72}
              className="relative z-10 rounded-2xl border border-destructive/20 shadow-sm object-cover bg-background"
              data-ai-hint={app?.androidApp?.appName}
            />
          </div>
          <Badge
            variant="destructive"
            className="rounded-full px-3 py-0.5 bg-destructive/10 text-destructive border-destructive/20"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-card-foreground group-hover:text-destructive transition-colors duration-300 line-clamp-1 mb-2">
            {app?.androidApp?.appName}
          </h3>
          <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/10">
            <p className="text-xs font-medium text-destructive mb-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Reason for Rejection
            </p>
            <p className="text-sm text-destructive/80 line-clamp-3 leading-relaxed">
              {app?.statusDetails?.description ||
                "No specific reason provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default function CommunityDashboardPage() {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Most Recent");
  const [selectedTab, setSelectedTab] = useState("available");
  const [ongoingSubTab, setOngoingSubTab] = useState("ongoing");

  const router = useTransitionRouter();

  const getBackendType = () => {
    if (selectedTab === "available") return "AVAILABLE";
    if (selectedTab === "completed") return "COMPLETED";
    if (selectedTab === "ongoing") {
      switch (ongoingSubTab) {
        case "ongoing":
          return "IN_TESTING";
        case "requested":
          return "REQUESTED";
        case "rejected":
          return "REJECTED";
        default:
          return "IN_TESTING";
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

  const ongoingCount =
    (hubDataCount?.["IN_TESTING"] || 0) +
    (hubDataCount?.["REQUESTED"] || 0) +
    (hubDataCount?.["REJECTED"] || 0);

  const completedCount = hubDataCount?.["COMPLETED"] || 0;

  const tabs = [
    {
      label: "Available",
      value: "available",
      count: hubDataCount?.["AVAILABLE"] || 0,
    },
    {
      label: "Ongoing",
      value: "ongoing",
      count: ongoingCount,
    },
    {
      label: "Completed",
      value: "completed",
      count: completedCount,
    },
  ];

  const ongoingTabs = [
    {
      label: "Ongoing",
      value: "ongoing",
      count: hubDataCount?.["IN_TESTING"] || 0,
    },
    {
      label: "Requested",
      value: "requested",
      count: hubDataCount?.["REQUESTED"] || 0,
    },
    {
      label: "Rejected",
      value: "rejected",
      count: hubDataCount?.["REJECTED"] || 0,
    },
  ];

  const appsSubmitted = allProjects.length;
  const testersEngaged = allProjects.reduce(
    (sum, p) => sum + p.testersStarted,
    0,
  );
  const testsCompleted = allProjects.reduce(
    (sum, p) => sum + p.testersCompleted,
    0,
  );

  const { data: hubData, isPending: hubIsPending } = useHubData();

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
                  <p className="text-2xl font-bold">{appsSubmitted}</p>
                  <p className="text-xs text-muted-foreground">
                    Apps Submitted
                  </p>
                </div>
                <div className="text-center bg-secondary p-2 rounded-lg">
                  <p className="text-2xl font-bold">{testersEngaged}</p>
                  <p className="text-xs text-muted-foreground">
                    Testers Engaged
                  </p>
                </div>
                <div className="text-center bg-secondary p-2 rounded-lg">
                  <p className="text-2xl font-bold">{testsCompleted}</p>
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
                <p className="text-3xl sm:text-5xl font-bold text-center my-auto">
                  {hubData?.wallet || 0}
                </p>
              </BentoCard>

              <BentoCard className="w-7/12 sm:w-1/2 !p-2.5 sm:!p-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  My Testing
                </CardTitle>
                <div className="grid grid-rows-2 grid-cols-1 sm:grid-cols-2 sm:grid-rows-1 gap-2 w-full mt-2 h-full">
                  <div className="text-center bg-secondary px-4 rounded-lg flex flex-row sm:flex-col items-center justify-between sm:justify-center">
                    <p className="text-xs text-muted-foreground">Ongoing</p>
                    <p className="text-2xl font-bold">{ongoingCount}</p>
                  </div>
                  <div className="text-center bg-secondary px-4 rounded-lg flex flex-row sm:flex-col items-center justify-between sm:justify-center">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedCount}</p>
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
            onValueChange={setSelectedTab}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 rounded-xl">
                      <ListFilter className="h-4 w-4" /> Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {[
                      "All",
                      "Games",
                      "Productivity",
                      "Social",
                      "Utilities",
                    ].map((cat) => (
                      <DropdownMenuItem
                        key={cat}
                        onClick={() => setFilter(cat)}
                      >
                        {cat}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
            <TabsContent value="ongoing" className="mt-6">
              <SubTabUI
                pendingTabs={ongoingTabs}
                setPendingSubTab={setOngoingSubTab}
                pendingSubTab={ongoingSubTab}
              />

              {ongoingSubTab === "ongoing" && (
                <PaginatedAppList
                  apps={hubAppsData || []}
                  emptyTitle="No Ongoing Tests"
                  emptyMessage="You have no ongoing tests."
                  emptyIcon={Rocket}
                  card={CommunityOngoingAppCard}
                  isLoading={hubAppsIsPending}
                />
              )}
              {ongoingSubTab === "requested" && (
                <PaginatedAppList
                  apps={hubAppsData || []}
                  emptyTitle="No Pending Requests"
                  emptyMessage="You have no pending test requests."
                  emptyIcon={History}
                  card={RequestedAppCard}
                  isLoading={hubAppsIsPending}
                />
              )}
              {ongoingSubTab === "rejected" && (
                <PaginatedAppList
                  apps={hubAppsData || []}
                  emptyTitle="No Rejected Requests"
                  emptyMessage="You have no rejected test requests."
                  emptyIcon={AlertCircle}
                  card={RejectedRequestCard}
                  isLoading={hubAppsIsPending}
                />
              )}
            </TabsContent>
            <TabsContent value="completed">
              <PaginatedAppList
                apps={hubAppsData || []}
                emptyTitle="No Completed Tests"
                emptyMessage="You have not completed any tests yet."
                emptyIcon={Trophy}
                card={CommunityCompletedAppCard}
                isLoading={hubAppsIsPending}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
