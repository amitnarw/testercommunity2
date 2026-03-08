"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  Briefcase,
  CheckCircle,
  DollarSign,
  ListFilter,
  Search,
  AlertCircle,
  Star,
  LogIn,
  LogOut,
  UserCheck,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AppPagination } from "@/components/app-pagination";
import { useQuery } from "@tanstack/react-query";
import { getTesterActivities } from "@/lib/apiCalls";
import type { TesterActivityItem } from "@/lib/types";

const ITEMS_PER_PAGE = 10;

const ACTION_TYPE_LABELS: Record<string, string> = {
  SUBMIT_APP: "App Submitted",
  JOIN_TEST_REQUEST: "Join Request",
  JOIN_TEST_ACCEPT: "Joined Test",
  JOIN_TEST_REJECTED: "Join Rejected",
  COMPLETE_TEST: "Test Completed",
  GIVE_FEEDBACK: "Feedback Given",
  RATE_APP: "App Rated",
  LOGIN: "Login",
  LOGOUT: "Logout",
  UPDATE_PROFILE: "Profile Updated",
  REGISTER: "Registered",
  RENEW_TOKENS: "Session Renewed",
  OTHER: "Other",
  DRAFT: "Draft",
};

const FILTER_OPTIONS = [
  { label: "All", value: "" },
  { label: "Test Completed", value: "COMPLETE_TEST" },
  { label: "Join Request", value: "JOIN_TEST_REQUEST" },
  { label: "Joined Test", value: "JOIN_TEST_ACCEPT" },
  { label: "Feedback", value: "GIVE_FEEDBACK" },
  { label: "App Rated", value: "RATE_APP" },
  { label: "Login", value: "LOGIN" },
];

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "COMPLETE_TEST":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "JOIN_TEST_ACCEPT":
    case "JOIN_TEST_REQUEST":
      return <Briefcase className="w-5 h-5 text-purple-500" />;
    case "GIVE_FEEDBACK":
      return <FileText className="w-5 h-5 text-blue-500" />;
    case "RATE_APP":
      return <Star className="w-5 h-5 text-yellow-500" />;
    case "LOGIN":
      return <LogIn className="w-5 h-5 text-emerald-500" />;
    case "LOGOUT":
      return <LogOut className="w-5 h-5 text-gray-500" />;
    case "UPDATE_PROFILE":
    case "REGISTER":
      return <UserCheck className="w-5 h-5 text-cyan-500" />;
    default:
      return <Bell className="w-5 h-5 text-muted-foreground" />;
  }
};

function getStatusBadgeClass(status: TesterActivityItem["status"]) {
  return status === "SUCCESS"
    ? "bg-green-500/20 text-green-700 dark:text-green-400"
    : "bg-red-500/20 text-red-700 dark:text-red-400";
}

export default function ProfessionalActivitiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["testerActivities", currentPage, activeFilter],
    queryFn: () =>
      getTesterActivities(
        currentPage,
        ITEMS_PER_PAGE,
        activeFilter || undefined,
      ),
  });

  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  // Client-side search filter on loaded page
  const activities = (data?.activities ?? []).filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (a.description ?? "").toLowerCase().includes(q) ||
      (a.appName ?? "").toLowerCase().includes(q) ||
      (ACTION_TYPE_LABELS[a.actionType] ?? a.actionType)
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-8 pt-0 sm:pt-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            My Activities
          </h2>
          <p className="text-sm sm:text-md text-muted-foreground">
            A complete log of your testing activities.
          </p>
        </div>
        {data?.pagination?.total !== undefined && (
          <span className="text-xs text-muted-foreground">
            {data.pagination.total} total activities
          </span>
        )}
      </div>

      <Card>
        <CardHeader className="p-2 sm:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-8 w-full md:w-[300px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ListFilter className="h-4 w-4" />
                  {activeFilter
                    ? (ACTION_TYPE_LABELS[activeFilter] ?? activeFilter)
                    : "Filter by Type"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {FILTER_OPTIONS.map((opt) => (
                  <DropdownMenuCheckboxItem
                    key={opt.value}
                    checked={activeFilter === opt.value}
                    onCheckedChange={() => handleFilterChange(opt.value)}
                  >
                    {opt.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 p-2 sm:p-6">
          {isError ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm">
                Failed to load activities. Please try again.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px]"></TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>App</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 7 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-9 w-9 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : activities.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
                      {search || activeFilter
                        ? "No activities match your filter."
                        : "No activities recorded yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="p-2 bg-secondary rounded-full inline-flex">
                          <ActivityIcon type={activity.actionType} />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {activity.description ??
                          ACTION_TYPE_LABELS[activity.actionType] ??
                          activity.actionType}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {activity.appName ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="capitalize text-xs"
                        >
                          {ACTION_TYPE_LABELS[activity.actionType] ??
                            activity.actionType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatusBadgeClass(activity.status)}
                        >
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString(
                          "en-IN",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {!isLoading && totalPages > 1 && (
        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => {
            setCurrentPage(p);
          }}
        />
      )}
    </div>
  );
}
