"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package, Activity } from "lucide-react";
import { ProjectList } from "@/components/project-list";
import Link from "next/link";
import { Gem } from "lucide-react";
import { useState } from "react";
import type { Project, HubSubmittedAppResponse } from "@/lib/types";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CustomTabsList } from "@/components/custom-tabs-list";
import { AppPagination } from "@/components/app-pagination";
import SubTabUI from "@/components/sub-tab-ui";
import { useDashboardData } from "@/hooks/useUser";
import { useDashboardAppsCount, useDashboardApps } from "@/hooks/useDashboard";
import { AppCardSkeleton } from "@/components/app-card-skeleton";
import { format } from "date-fns";

const PROJECTS_PER_PAGE = 6;

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

const PaginatedProjectList = ({
  projects,
  isLoading,
}: {
  projects: Project[];
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <AppCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <ProjectList projects={currentProjects} />
      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default function DashboardPage() {
  const [mainTab, setMainTab] = useState("pending");
  const [pendingSubTab, setPendingSubTab] = useState("in-review");

  // Fetch dashboard stats
  const { data: dashboardData } = useDashboardData();

  // Fetch app counts for tabs
  const { data: appsCountData } = useDashboardAppsCount();

  // Determine backend type based on tabs
  const getBackendType = () => {
    if (mainTab === "pending") {
      switch (pendingSubTab) {
        case "in-review":
          return "IN_REVIEW";
        case "drafts":
          return "DRAFT";
        case "rejected":
          return "REJECTED";
        default:
          return "IN_REVIEW";
      }
    }
    if (mainTab === "ongoing") return "IN_TESTING";
    if (mainTab === "completed") return "COMPLETED";
    return "IN_REVIEW";
  };

  const currentAppType = getBackendType();

  // Fetch apps list
  const { data: appsData, isPending: appsIsPending } = useDashboardApps({
    type: currentAppType,
  });

  // Calculate counts from API data
  const draftCount = appsCountData?.DRAFT || 0;
  const inReviewCount = appsCountData?.IN_REVIEW || 0;
  const rejectedCount = appsCountData?.REJECTED || 0;
  const ongoingCount = appsCountData?.IN_TESTING || 0;
  const completedCount = appsCountData?.COMPLETED || 0;
  const pendingCount = draftCount + inReviewCount + rejectedCount;

  // Map HubSubmittedAppResponse to Project type
  const mapToProjects = (
    apps: HubSubmittedAppResponse[] | undefined,
  ): Project[] => {
    if (!apps) return [];

    return apps.map((app) => {
      // Map status enum to display string
      let status: Project["status"] = "In Review";
      if (app.status === "DRAFT") status = "Draft";
      else if (app.status === "REJECTED") status = "Rejected";
      else if (app.status === "IN_TESTING") status = "In Testing";
      else if (app.status === "COMPLETED") status = "Completed";
      else if (app.status === "IN_REVIEW") status = "In Review";

      return {
        id: app.id,
        name: app.androidApp?.appName || "Unknown App",
        packageName: app.androidApp?.packageName || "",
        icon: app.androidApp?.appLogoUrl || "",
        category: "App", // Default category as it's cleaner than fetching nested if not needed
        status: status,
        testersStarted: app.currentTester || 0,
        testersCompleted: 0, // Not available in response yet
        totalDays: app.totalDay || 14, // Default or from API
        avgTestersPerDay:
          app.currentDay > 0 ? app.currentTester / app.currentDay : 0,
        startedFrom: app.createdAt
          ? format(new Date(app.createdAt), "MMM d, yyyy")
          : "N/A",
        description: app.androidApp?.description || "",
        testingInstructions: app.instructionsForTester || "",
        androidVersion: `Android ${app.minimumAndroidVersion}+`,
        pointsCost: app.costPoints || 0,
        crashFreeRate: 100, // Placeholder
        overallRating: 0, // Placeholder
        feedbackBreakdown: { bugs: 0, suggestions: 0, praise: 0 },
        performanceMetrics: { cpuUsage: 0, memoryUsage: 0, startupTime: 0 },
        deviceCoverage: [],
        osCoverage: [],
        topGeographies: [],
        feedback: [],
        dataAiHint: app.androidApp?.appName,
        chartData: [],
        testers: [],
      } as unknown as Project;
    });
  };

  const mappedProjects = mapToProjects(appsData);

  const mainTabs = [
    {
      label: "Pending",
      value: "pending",
      count: pendingCount,
    },
    { label: "Ongoing", value: "ongoing", count: ongoingCount },
    { label: "Completed", value: "completed", count: completedCount },
  ];

  const pendingTabs = [
    { label: "In Review", value: "in-review", count: inReviewCount },
    { label: "Drafts", value: "drafts", count: draftCount },
    { label: "Rejected", value: "rejected", count: rejectedCount },
  ];

  return (
    <div data-loc="DashboardPage" className="min-h-screen mb-8">
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-0 pb-1">
                Developer Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage your apps and professional testing projects.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
          <div className="flex flex-col gap-2 bg-card col-span-1 lg:col-span-2 rounded-xl py-4 px-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Activity className="w-4 h-4" /> Performance
            </CardTitle>
            <BentoCard className="grid gap-2 grid-cols-3 !p-0">
              <Card className="rounded-xl border-0 bg-secondary px-3 py-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total Apps
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-2xl font-bold">
                    {pendingCount + ongoingCount + completedCount}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-0 bg-secondary px-3 py-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    In Testing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-2xl font-bold">{ongoingCount}</div>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-0 bg-secondary px-3 py-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-2xl font-bold">{completedCount}</div>
                </CardContent>
              </Card>
            </BentoCard>
          </div>

          <Card className="rounded-xl border-0 bg-gradient-to-br from-primary to-primary/40 relative overflow-hidden col-span-1 flex flex-row sm:flex-col justify-between sm:justify-center gap-2 p-4 pr-10">
            <Package
              size={100}
              className="text-white/10 sm:text-white/20 absolute -top-5 -right-5 rotate-45"
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-sm font-medium text-white/80">
                Available Packages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-5xl font-bold text-white">
                {Number(dashboardData?.wallet) || 0}
              </div>
            </CardContent>
          </Card>

          <BentoCard className="grid gap-2 grid-cols-1">
            <Button
              asChild
              className="w-full h-full bg-gradient-to-br from-primary to-primary/40"
            >
              <Link href="/dashboard/add-app">
                <PlusCircle className="mr-2 h-4 w-4" /> Submit Your App
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full h-full">
              <Link href="/billing">
                <Gem className="mr-2 h-4 w-4" /> Buy More Packages
              </Link>
            </Button>
          </BentoCard>
        </div>

        <main className="mt-12">
          <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
            <CustomTabsList
              tabs={mainTabs}
              activeTab={mainTab}
              className="mt-6"
            />
            <TabsContent value="pending" className="mt-6">
              <SubTabUI
                pendingTabs={pendingTabs}
                setPendingSubTab={setPendingSubTab}
                pendingSubTab={pendingSubTab}
              />
              <PaginatedProjectList
                projects={mappedProjects}
                isLoading={appsIsPending}
              />
            </TabsContent>
            <TabsContent value="ongoing" className="mt-6">
              <PaginatedProjectList
                projects={mappedProjects}
                isLoading={appsIsPending}
              />
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <PaginatedProjectList
                projects={mappedProjects}
                isLoading={appsIsPending}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
