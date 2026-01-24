"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Search, Calendar, Star } from "lucide-react";
import { CommunityCompletedAppCard } from "@/components/community-completed-app-card";
import { AppPagination } from "@/components/app-pagination";
import { motion } from "framer-motion";
import type { HubSubmittedAppResponse } from "@/lib/types";
import { useHubApps } from "@/hooks/useUser";
import { useTransitionRouter } from "@/context/transition-context";
import { AppCardSkeleton } from "@/components/app-card-skeleton";
import { Input } from "@/components/ui/input";

const APPS_PER_PAGE = 9;

const PaginatedCompletedList = ({
  apps,
  isLoading,
}: {
  apps: HubSubmittedAppResponse[];
  isLoading?: boolean;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = apps.filter((app) =>
    app?.androidApp?.appName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredApps.length / APPS_PER_PAGE);
  const startIndex = (currentPage - 1) * APPS_PER_PAGE;
  const endIndex = startIndex + APPS_PER_PAGE;
  const currentApps = filteredApps.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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

  return (
    <>
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search completed tests..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentApps.map((app) => (
              <CommunityCompletedAppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card/50 rounded-3xl border border-dashed border-muted-foreground/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="p-6 bg-green-500/10 rounded-full mb-6 relative z-10 ring-8 ring-green-500/5"
            >
              <Trophy className="w-10 h-10 text-green-500" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2 relative z-10">
              {searchQuery ? "No Results Found" : "No Completed Tests Yet"}
            </h3>
            <p className="text-muted-foreground max-w-sm relative z-10 px-4">
              {searchQuery
                ? "Try adjusting your search query."
                : "Once you complete testing an app, it will appear here. Start testing to build your history!"}
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

export default function HistoryPage() {
  const router = useTransitionRouter();

  const { data: hubAppsData, isPending: hubAppsIsPending } = useHubApps({
    type: "COMPLETED",
  });

  const totalPoints =
    hubAppsData?.reduce((sum, app) => sum + (app.rewardPoints || 0), 0) || 0;

  return (
    <div data-loc="HistoryPage" className="min-h-screen mb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header with back button */}
        <header className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/community-dashboard")}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community Hub
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-green-600 to-green-400 bg-clip-text text-transparent leading-[unset] pb-2 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-green-500" />
                Test History
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
                All the apps you've successfully tested. Your contributions help
                developers build better products!
              </p>
            </div>

            {/* Stats summary */}
            <div className="flex gap-4">
              <div className="bg-card rounded-2xl p-4 border border-border/50 min-w-[120px]">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Tests Done</span>
                </div>
                <p className="text-2xl font-bold">{hubAppsData?.length || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl p-4 border border-green-500/20 min-w-[120px]">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs mb-1">
                  <Star className="w-3.5 h-3.5" />
                  <span>Total Earned</span>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalPoints} pts
                </p>
              </div>
            </div>
          </div>
        </header>

        <main>
          <PaginatedCompletedList
            apps={hubAppsData || []}
            isLoading={hubAppsIsPending}
          />
        </main>
      </div>
    </div>
  );
}
