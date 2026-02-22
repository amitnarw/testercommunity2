"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, UserCheck, Clock, UserPlus } from "lucide-react";
import { AppPagination } from "@/components/app-pagination";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import {
  useAllTesterApplications,
  useTesterApplicationCounts,
} from "@/hooks/useAdmin";
import { StatCard } from "@/components/admin/applications/stat-card";
import { mockApplications } from "./mock-data";

// Dynamically import the ApplicationTable to improve initial load time
const ApplicationTable = dynamic(
  () =>
    import("@/components/admin/applications/application-table").then(
      (mod) => mod.ApplicationTable,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading applications table...
      </div>
    ),
  },
);

const ITEMS_PER_PAGE = 5;

// Filter type for stat cards
type FilterType =
  | "all"
  | "active"
  | "new"
  | "pending"
  | "approved"
  | "rejected";

export default function AdminApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch applications data
  const { data: applicationsData, isLoading } = useAllTesterApplications({
    status: activeTab === "all" ? undefined : activeTab,
    search: searchQuery || undefined,
  });

  // Fetch counts
  const { data: countsData, isLoading: countsLoading } =
    useTesterApplicationCounts();

  // Use mock data for now, replace with API data when available
  const applications = applicationsData || mockApplications;

  // Get counts from API or use mock data
  const counts = {
    total: countsData?.total || 156,
    active: countsData?.active || 142,
    new: countsData?.new || 12,
    pending: countsData?.pending || 24,
    approved: countsData?.approved || 118,
    rejected: countsData?.rejected || 14,
  };

  // Handle stat card click - sets both filter and tab
  const handleStatCardClick = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);

    // Map filter to tab
    if (filter === "all") {
      setActiveTab("all");
    } else if (filter === "active") {
      // Active testers show all approved applications
      setActiveTab("approved");
    } else if (filter === "new") {
      // New testers (last 7 days) - show all for now
      setActiveTab("all");
    } else {
      setActiveTab(filter);
    }
  };

  // Filter applications based on tab and search
  const filteredApplications = applications.filter((app: any) => {
    const matchesTab = activeTab === "all" || app.status === activeTab;
    const matchesSearch =
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Tester Applications
          </h2>
          <p className="text-sm sm:text-md text-muted-foreground">
            Review and process applications from prospective professional
            testers.
          </p>
        </div>
      </div>

      {/* Stats Cards - Display information only */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Total Testers"
          value={counts.total}
          icon={Users}
          iconColor="text-blue-500"
          bgColor="bg-blue-500/10"
          isLoading={countsLoading}
        />
        <StatCard
          title="Active Testers"
          value={counts.active}
          icon={UserCheck}
          iconColor="text-green-500"
          bgColor="bg-green-500/10"
          isLoading={countsLoading}
        />
        <StatCard
          title="New (7 days)"
          value={counts.new}
          icon={UserPlus}
          iconColor="text-purple-500"
          bgColor="bg-purple-500/10"
          isLoading={countsLoading}
        />
        <StatCard
          title="Pending Apps"
          value={counts.pending}
          icon={Clock}
          iconColor="text-amber-500"
          bgColor="bg-amber-500/10"
          isLoading={countsLoading}
        />
      </div>

      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1);
          // Do NOT update active filter to match tab - only update when stat card is clicked
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="all">All ({counts.total})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({counts.pending})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({counts.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({counts.rejected})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-4 grid grid-cols-1">
          <Card>
            <CardContent className="p-0">
              <ApplicationTable
                applications={paginatedApplications}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
          {!isLoading && paginatedApplications.length > 0 && (
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
