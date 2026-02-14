"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, DollarSign } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppPagination } from "@/components/app-pagination";
import { useSubmittedApps, useSubmittedAppsCount } from "@/hooks/useAdmin";
import { HubSubmittedAppResponse } from "@/lib/types";
import { CustomTabsList } from "@/components/custom-tabs-list";
import { SubmissionsTable } from "@/components/admin/submissions-table";

const ITEMS_PER_PAGE = 8;

function AdminSubmissionsPaidContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Initialize state from URL queries to persist selection across navigation
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync with URL changes (e.g. back button)
  useEffect(() => {
    const tab = searchParams.get("tab") || "All";
    if (tab !== activeTab) {
      setActiveTab(tab);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setCurrentPage(1);
    updateUrl({ tab: val });
  };

  const updateUrl = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "All") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.replace(`${pathname}?${newParams.toString()}`, {
      scroll: false,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch data based on active filters
  const {
    data: submissionsData,
    isLoading,
    error,
  } = useSubmittedApps(activeTab === "All" ? undefined : activeTab);

  const submissions = submissionsData || [];

  // Fetch counts for PAID only
  const { data: countsData } = useSubmittedAppsCount("PAID");

  // Filter by PAID app type and search query
  const filteredSubmissions = submissions.filter((sub: HubSubmittedAppResponse) => {
    // Only PAID apps
    if (sub.appType !== "PAID") {
      return false;
    }
    // Search filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const appName = sub.androidApp?.appName?.toLowerCase() || "";
    const ownerName = sub.appOwner?.name?.toLowerCase() || "";
    return appName.includes(query) || ownerName.includes(query);
  });

  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);

  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Professional Submissions
          </h2>
          <p className="text-sm sm:text-md text-muted-foreground">
            Review, approve, or reject professional (paid) app submissions.
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <DollarSign className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardDescription className="text-xs">Professional Apps</CardDescription>
                  <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px]">PAID</Badge>
                </div>
                <p className="text-2xl font-bold">{filteredSubmissions.length}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader className="p-2 sm:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by app name or developer..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <div className="px-2 sm:px-6 pb-6 space-y-4">
          {/* Status Tabs */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                variant={activeTab === "All" ? "default" : "outline"}
                onClick={() => handleTabChange("All")}
                className="w-full sm:w-auto rounded-lg h-9"
              >
                All
                <span
                  className={`ml-2 bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs ${activeTab === "All" ? "text-white bg-white/20" : ""}`}
                >
                  {/* @ts-ignore */}
                  {countsData?.All || 0}
                </span>
              </Button>

              <Tabs
                value={
                  activeTab === "AVAILABLE" || activeTab === "IN_TESTING"
                    ? "RUNNING"
                    : activeTab
                }
                onValueChange={(val) =>
                  handleTabChange(val === "RUNNING" ? "AVAILABLE" : val)
                }
                className="w-full sm:w-auto"
              >
                <CustomTabsList
                  tabs={[
                    {
                      label: "Pending",
                      value: "IN_REVIEW",
                      count: countsData?.IN_REVIEW || 0,
                    },
                    {
                      label: "Running",
                      value: "RUNNING",
                      count:
                        (countsData?.AVAILABLE || 0) +
                        (countsData?.IN_TESTING || 0),
                    },
                    {
                      label: "Rejected",
                      value: "REJECTED",
                      count: countsData?.REJECTED || 0,
                    },
                  ]}
                  activeTab={
                    activeTab === "AVAILABLE" || activeTab === "IN_TESTING"
                      ? "RUNNING"
                      : activeTab
                  }
                  isLoading={false}
                  className="py-0 static"
                  listClassName="w-full sm:w-auto"
                />
              </Tabs>
            </div>

            {/* Sub-tabs for Running status */}
            {(activeTab === "AVAILABLE" || activeTab === "IN_TESTING") && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                  {[
                    {
                      label: "Available",
                      value: "AVAILABLE",
                      count: countsData?.AVAILABLE || 0,
                    },
                    {
                      label: "In Testing",
                      value: "IN_TESTING",
                      count: countsData?.IN_TESTING || 0,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => handleTabChange(tab.value)}
                      className={cn(
                        "rounded-lg px-4 py-1.5 text-xs sm:text-sm h-auto transition-colors",
                        activeTab === tab.value
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                      )}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <SubmissionsTable
            submissions={paginatedSubmissions}
            isLoading={isLoading}
            showAppType={false}
          />
        </div>
      </Card>

      {!isLoading && paginatedSubmissions.length > 0 && (
        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default function AdminSubmissionsPaidPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminSubmissionsPaidContent />
    </Suspense>
  );
}
