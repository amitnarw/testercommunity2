"use client";

import { cn } from "@/lib/utils";

export function BlogListingSkeleton() {
  return (
    <div className="space-y-20">
      {/* Header Skeleton */}
      <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 space-y-6">
        <div className="h-14 md:h-20 w-3/4 mx-auto bg-muted/60 rounded-2xl" />
        <div className="h-6 md:h-8 w-1/2 mx-auto bg-muted/40 rounded-xl" />
      </div>

      {/* Category Filter Skeleton */}
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 bg-muted/20 backdrop-blur-xl rounded-full border border-white/10">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className={cn(
                "h-10 w-20 rounded-full bg-muted/40",
                i === 1 && "bg-primary/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Blog Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Newsletter Skeleton */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/80 via-primary/80 to-blue-600/80 p-8 md:p-24 text-center">
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="h-8 w-48 mx-auto bg-white/10 rounded-full" />
          <div className="h-12 md:h-16 w-3/4 mx-auto bg-white/10 rounded-2xl" />
          <div className="h-8 w-2/3 mx-auto bg-white/10 rounded-xl" />
          <div className="flex gap-4 max-w-lg mx-auto pt-6">
            <div className="flex-1 h-14 bg-white/10 rounded-full" />
            <div className="h-14 w-32 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card border border-border/40">
      <div className="aspect-[16/9] bg-muted/60" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-14 rounded-full bg-muted/40" />
          <div className="h-3 w-16 bg-muted/30 rounded" />
        </div>
        <div className="h-5 bg-muted/50 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-muted/30 rounded w-full" />
          <div className="h-3 bg-muted/30 rounded w-4/6" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="h-6 w-6 rounded-full bg-muted/40" />
          <div className="h-3 w-20 bg-muted/30 rounded" />
        </div>
      </div>
    </div>
  );
}
