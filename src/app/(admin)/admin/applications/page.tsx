"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Users,
  UserCheck,
  Clock,
  UserPlus,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AppPagination } from "@/components/app-pagination";
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useAllTesterApplications,
  useTesterApplicationCounts,
  useUpdateTesterApplicationStatus,
} from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import { StatCard } from "@/components/admin/applications/stat-card";
import { FeedbackModal } from "@/components/feedback-modal";

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

interface TesterApp {
  id: string;
  name: string;
  email: string;
  status: string;
  [key: string]: unknown;
}

const ITEMS_PER_PAGE = 5;

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
  const queryClient = useQueryClient();

  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info" | "loading";
    title: string;
    description?: string;
    primaryAction?: { label: string; onClick: () => void };
  }>({ open: false, status: "info", title: "" });

  const { data: applicationsData, isLoading } = useAllTesterApplications({
    status: activeTab === "all" ? undefined : activeTab,
    search: searchQuery || undefined,
  });

  const { data: countsData, isLoading: countsLoading } =
    useTesterApplicationCounts();

  const applications = applicationsData || [];

  const counts = {
    total: countsData?.total || 0,
    active: countsData?.active || 0,
    new: countsData?.new || 0,
    pending: countsData?.pending || 0,
    approved: countsData?.approved || 0,
    rejected: countsData?.rejected || 0,
  };

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["useAllTesterApplications"] });
    queryClient.invalidateQueries({ queryKey: ["useTesterApplicationCounts"] });
  };

  const updateStatusMutation = useUpdateTesterApplicationStatus({
    onSuccess: (_data, variables) => {
      invalidateQueries();
      const action =
        variables.status === "approved" ? "approved" : "rejected";
      setFeedbackModal({
        open: true,
        status: "success",
        title: `Application ${action === "approved" ? "Approved" : "Rejected"}`,
        description: `The tester application has been successfully ${action}.`,
        primaryAction: {
          label: "Done",
          onClick: () => setFeedbackModal((prev) => ({ ...prev, open: false })),
        },
      });
    },
    onError: (err: Error) => {
      setFeedbackModal({
        open: true,
        status: "error",
        title: "Action Failed",
        description: err.message || "Failed to update application status.",
        primaryAction: {
          label: "Try Again",
          onClick: () => setFeedbackModal((prev) => ({ ...prev, open: false })),
        },
      });
    },
  });

  const handleApprove = (appId: string) => {
    updateStatusMutation.mutate({ id: appId, status: "approved" });
  };

  const handleReject = (appId: string, reason?: string) => {
    updateStatusMutation.mutate({
      id: appId,
      status: "rejected",
      reason: reason || undefined,
    });
  };

  const handleStatCardClick = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);

    if (filter === "all") {
      setActiveTab("all");
    } else if (filter === "active") {
      setActiveTab("approved");
    } else if (filter === "new") {
      setActiveTab("all");
    } else {
      setActiveTab(filter);
    }
  };

  // Server handles filtering, but do client-side tab filtering as fallback
  const filteredApplications = applications.filter((app: TesterApp) => {
    const matchesTab =
      activeTab === "all" ||
      app.status?.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase());
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

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          title="Total Applications"
          value={counts.total}
          icon={Users}
          iconColor="text-blue-500"
          bgColor="bg-blue-500/10"
          isLoading={countsLoading}
          onClick={() => handleStatCardClick("all")}
          isActive={activeFilter === "all"}
        />
        <StatCard
          title="Pending Review"
          value={counts.pending}
          icon={Clock}
          iconColor="text-amber-500"
          bgColor="bg-amber-500/10"
          isLoading={countsLoading}
          onClick={() => handleStatCardClick("pending")}
          isActive={activeFilter === "pending"}
        />
        <StatCard
          title="Approved"
          value={counts.approved}
          icon={CheckCircle2}
          iconColor="text-green-500"
          bgColor="bg-green-500/10"
          isLoading={countsLoading}
          onClick={() => handleStatCardClick("approved")}
          isActive={activeFilter === "approved"}
        />
        <StatCard
          title="Rejected"
          value={counts.rejected}
          icon={XCircle}
          iconColor="text-red-500"
          bgColor="bg-red-500/10"
          isLoading={countsLoading}
          onClick={() => handleStatCardClick("rejected")}
          isActive={activeFilter === "rejected"}
        />
        <StatCard
          title="Active Testers"
          value={counts.active}
          icon={UserCheck}
          iconColor="text-emerald-500"
          bgColor="bg-emerald-500/10"
          isLoading={countsLoading}
          onClick={() => handleStatCardClick("active")}
          isActive={activeFilter === "active"}
        />
        <StatCard
          title="New This Week"
          value={counts.new}
          icon={UserPlus}
          iconColor="text-purple-500"
          bgColor="bg-purple-500/10"
          isLoading={countsLoading}
          onClick={() => handleStatCardClick("new")}
          isActive={activeFilter === "new"}
        />
      </div>

      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1);
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
                onApprove={handleApprove}
                onReject={handleReject}
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

      <FeedbackModal
        open={feedbackModal.open}
        onOpenChange={(open) =>
          setFeedbackModal((prev) => ({ ...prev, open }))
        }
        status={feedbackModal.status}
        title={feedbackModal.title}
        description={feedbackModal.description}
        primaryAction={feedbackModal.primaryAction}
      />
    </div>
  );
}
