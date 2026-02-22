"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppPagination } from "@/components/app-pagination";
import { useSubmittedApps, useSubmittedAppsCount } from "@/hooks/useAdmin";
import { HubSubmittedAppResponse } from "@/lib/types";
import { SubmissionsTable } from "@/components/admin/submissions-table";

const ITEMS_PER_PAGE = 8;

function AdminSubmissionsFreeContent() {
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

  // Fetch counts for FREE only
  const { data: countsData } = useSubmittedAppsCount("FREE");

  // Filter by FREE app type and search query
  const filteredSubmissions = submissions.filter(
    (sub: HubSubmittedAppResponse) => {
      // Only FREE apps
      if (sub.appType !== "FREE") {
        return false;
      }
      // Search filter
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const appName = sub.androidApp?.appName?.toLowerCase() || "";
      const ownerName = sub.appOwner?.name?.toLowerCase() || "";
      return appName.includes(query) || ownerName.includes(query);
    },
  );

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
            Free Submissions
          </h2>
          <p className="text-sm sm:text-md text-muted-foreground">
            Review, approve, or reject community (free) app submissions.
          </p>
        </div>
      </div>

      <Tabs
        value={
          activeTab === "AVAILABLE" || activeTab === "IN_TESTING"
            ? "RUNNING"
            : activeTab
        }
        onValueChange={(val) =>
          handleTabChange(val === "RUNNING" ? "AVAILABLE" : val)
        }
        className="w-full grid grid-cols-1"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by app name or developer..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <TabsList className="w-full md:w-auto flex gap-1">
            <TabsTrigger value="All">All ({countsData?.All || 0})</TabsTrigger>
            <TabsTrigger value="IN_REVIEW">
              Pending ({countsData?.IN_REVIEW || 0})
            </TabsTrigger>
            <TabsTrigger value="RUNNING">
              Running (
              {(countsData?.AVAILABLE || 0) + (countsData?.IN_TESTING || 0)})
            </TabsTrigger>
            <TabsTrigger value="REJECTED">
              Rejected ({countsData?.REJECTED || 0})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value={
            activeTab === "AVAILABLE" || activeTab === "IN_TESTING"
              ? "RUNNING"
              : activeTab
          }
          className="mt-4 grid grid-cols-1"
        >
          {/* Sub-tabs for Running status */}
          {(activeTab === "AVAILABLE" || activeTab === "IN_TESTING") && (
            <div className="flex justify-start mb-4">
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
          <div className="overflow-x-auto">
            <Card>
              <CardContent className="p-0">
                <SubmissionsTable
                  submissions={paginatedSubmissions}
                  isLoading={isLoading}
                  showAppType={false}
                />
              </CardContent>
            </Card>
          </div>
          {!isLoading && paginatedSubmissions.length > 0 && (
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminSubmissionsFreePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminSubmissionsFreeContent />
    </Suspense>
  );
}
