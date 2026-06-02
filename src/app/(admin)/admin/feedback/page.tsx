"use client";

import { useState, Suspense, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Trash2, MessageSquare, Bug, Lightbulb, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAllFeedback, useFeedbackCounts, useUpdateFeedbackStatus, useDeleteFeedback } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { AppPagination } from "@/components/app-pagination";

const ITEMS_PER_PAGE = 15;

const typeLabels: Record<string, string> = {
  BUG: "Bug",
  SUGGESTION: "Suggestion",
  PRAISE: "Praise",
  OTHER: "Other",
};

const typeIcons: Record<string, any> = {
  BUG: Bug,
  SUGGESTION: Lightbulb,
  PRAISE: Star,
  OTHER: MessageSquare,
};

const typeColors: Record<string, string> = {
  BUG: "bg-red-500/10 text-red-600 border-red-500/20",
  SUGGESTION: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  PRAISE: "bg-green-500/10 text-green-600 border-green-500/20",
  OTHER: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const priorityColors: Record<string, string> = {
  CRITICAL: "bg-red-500/20 text-red-700 border-red-500/30",
  HIGH: "bg-orange-500/20 text-orange-700 border-orange-500/30",
  MEDIUM: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  LOW: "bg-green-500/20 text-green-700 border-green-500/30",
};

function FeedbackContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [appTypeFilter, setAppTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const invalidate = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["useFeedbackCounts"] });
  };

  const { data: feedbackList = [], isLoading, refetch } = useAllFeedback(
    typeFilter !== "ALL" || appTypeFilter !== "ALL"
      ? {
          ...(typeFilter !== "ALL" && { status: typeFilter }),
          ...(appTypeFilter !== "ALL" && { appType: appTypeFilter }),
        }
      : undefined,
  );

  const { data: counts } = useFeedbackCounts();

  const updatePriorityMutation = useUpdateFeedbackStatus({
    onSuccess: () => {
      toast({ title: "Success", description: "Priority updated" });
      invalidate();
    },
    onError: (err: any) =>
      toast({ title: "Error", description: err?.message || "Failed to update priority", variant: "destructive" }),
  });

  const deleteMutation = useDeleteFeedback({
    onSuccess: () => {
      toast({ title: "Success", description: "Feedback deleted" });
      invalidate();
    },
    onError: (err: any) =>
      toast({ title: "Error", description: err?.message || "Failed to delete", variant: "destructive" }),
  });

  const filtered = searchQuery
    ? feedbackList.filter(
        (f: any) =>
          f.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.tester?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : feedbackList;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, Math.max(totalPages, 1)));
  }, [totalPages]);

  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePriorityChange = (id: number, priority: string) => {
    updatePriorityMutation.mutate({ id, priority: priority === "none" ? null : priority });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this feedback?")) {
      deleteMutation.mutate(id);
    }
  };

  const statCards = counts
    ? Object.entries(counts)
        .filter(([key]) => key !== "__typename")
        .map(([key, value]: [string, any]) => ({
          label: key === "All" ? "Total" : typeLabels[key] || key,
          value,
          color: key === "All" ? "" : typeColors[key] || "",
          icon: key === "All" ? MessageSquare : typeIcons[key] || MessageSquare,
        }))
    : [];

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Feedback
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage feedback submitted by testers on submitted apps.
          </p>
        </div>
      </div>

      {statCards.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statCards.map((stat: any) => (
            <Card key={stat.label} className="overflow-hidden">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("p-2 rounded-lg shrink-0", stat.color || "bg-muted")}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "BUG", "SUGGESTION", "PRAISE", "OTHER"].map((type) => (
            <Button
              key={type}
              variant={typeFilter === type ? "default" : "outline"}
              size="sm"
              onClick={() => { setTypeFilter(type); setCurrentPage(1); }}
            >
              {type === "ALL" ? "All Types" : typeLabels[type] || type}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "PAID", "FREE"].map((appType) => (
            <Button
              key={appType}
              variant={appTypeFilter === appType ? "default" : "outline"}
              size="sm"
              onClick={() => { setAppTypeFilter(appType); setCurrentPage(1); }}
            >
              {appType === "ALL" ? "All Apps" : appType}
            </Button>
          ))}
        </div>
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tester</TableHead>
              <TableHead className="max-w-[250px]">Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>App</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No feedback found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.tester?.image && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0">
                          <img src={item.tester.image} alt={item.tester.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="font-medium text-sm truncate max-w-[120px]">
                        {item.tester?.name || "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
                    &quot;{item.message}&quot;
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", typeColors[item.type] || "")}>
                      {typeLabels[item.type] || item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.priority || "none"}
                      onValueChange={(v) => handlePriorityChange(item.id, v)}
                    >
                      <SelectTrigger className={cn(
                        "h-7 text-xs w-[110px]",
                        item.priority && priorityColors[item.priority],
                      )}>
                        <SelectValue placeholder="Set priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.dashboardAndHub?.androidApp?.appName || "Unknown"}
                    {item.dashboardAndHub?.appType && (
                      <Badge variant="outline" className="ml-1 text-[10px]">
                        {item.dashboardAndHub.appType}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {format(new Date(item.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && filtered.length > 0 && totalPages > 1 && (
        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <FeedbackContent />
    </Suspense>
  );
}
