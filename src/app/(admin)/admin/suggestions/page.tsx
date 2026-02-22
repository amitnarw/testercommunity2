"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Lightbulb, PlusCircle, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  useAllSuggestions,
  useSuggestionCounts,
  useDeleteSuggestion,
  useUpdateSuggestionStatus,
} from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const SuggestionsTable = dynamic(
  () =>
    import("@/components/admin/suggestions/suggestions-table").then(
      (mod) => mod.SuggestionsTable,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading suggestions table...
      </div>
    ),
  },
);

export default function AdminSuggestionsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch suggestions
  const {
    data: suggestionsData,
    isLoading,
    error,
  } = useAllSuggestions({
    status: filter === "All" ? undefined : filter,
  });

  // Fetch counts
  const { data: countsData } = useSuggestionCounts();

  // Mutations
  const deleteMutation = useDeleteSuggestion({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useAllSuggestions"] });
      queryClient.invalidateQueries({ queryKey: ["useSuggestionCounts"] });
    },
  });

  const updateStatusMutation = useUpdateSuggestionStatus({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useAllSuggestions"] });
      queryClient.invalidateQueries({ queryKey: ["useSuggestionCounts"] });
    },
  });

  const suggestions = suggestionsData || [];

  // Filter by search query
  const filteredSuggestions = suggestions.filter((s: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const title = s.title?.toLowerCase() || "";
    const message = s.message?.toLowerCase() || "";
    const userName = s.user?.name?.toLowerCase() || "";
    return (
      title.includes(query) ||
      message.includes(query) ||
      userName.includes(query)
    );
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this suggestion?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusUpdate = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Feature Suggestions
          </h2>
          <p className="text-sm sm:text-md text-muted-foreground">
            Manage new feature ideas and suggestions from the community.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/suggestions/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Suggestion Manually
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="p-2 sm:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suggestions..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs
              defaultValue="All"
              onValueChange={setFilter}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="All" className="text-xs sm:text-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="PENDING" className="text-xs sm:text-sm">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="REVIEWED" className="text-xs sm:text-sm">
                  Reviewed
                </TabsTrigger>
                <TabsTrigger value="IMPLEMENTED" className="text-xs sm:text-sm">
                  Implemented
                </TabsTrigger>
                <TabsTrigger value="REJECTED" className="text-xs sm:text-sm">
                  Rejected
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 grid grid-cols-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error loading suggestions. Please try again.
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No suggestions found.
            </div>
          ) : (
            <SuggestionsTable
              suggestions={filteredSuggestions}
              onDelete={handleDelete}
              onUpdateStatus={handleStatusUpdate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
