"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SubmissionDetailsSkeleton() {
  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen relative">
      <div className="container mx-auto px-4 md:px-6">
        <main className="max-w-7xl mx-auto space-y-8">
          <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 w-1/2">
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>

          {/* App Info Header Skeleton */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-card p-6 rounded-3xl border shadow-sm">
            <Skeleton className="h-24 w-24 rounded-2xl shrink-0" />
            <div className="space-y-3 w-full">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48 sm:w-64 rounded-lg" />
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full max-w-2xl rounded" />
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
            <div className="flex flex-row gap-1 items-center justify-center rounded-2xl overflow-hidden h-[180px]">
              <Skeleton className="h-full w-full" />
              <Skeleton className="h-full w-full" />
            </div>
            <Skeleton className="h-[180px] w-full rounded-2xl" />
            <div className="flex flex-row gap-2 h-[180px]">
              <Skeleton className="h-full w-full rounded-2xl" />
              <Skeleton className="h-full w-full rounded-2xl" />
            </div>
          </div>

          {/* Feedback Section Skeleton */}
          <div className="bg-card/50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 rounded" />
                <Skeleton className="h-4 w-64 rounded" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
