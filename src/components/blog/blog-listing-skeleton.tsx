"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BlogListingSkeleton() {
  return (
    <div className="space-y-20">
      {/* Header Skeleton - immediate render */}
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
      <div className="min-h-[600px] columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} index={idx} />
        ))}
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

function SkeletonCard({ index }: { index: number }) {
  const isTall = index % 3 === 1;

  return (
    <div className="relative overflow-hidden bg-card/80 border border-border/50 rounded-[2rem]">
      {/* Image Skeleton */}
      <div
        className={cn(
          "bg-muted/60",
          isTall ? "aspect-[3/4]" : "aspect-[4/3]"
        )}
      />

      {/* Content Skeleton */}
      <div className="p-6 md:p-8 space-y-4">
        {/* Meta info */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-20 bg-muted/60 rounded" />
          <div className="h-4 w-16 bg-muted/40 rounded" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-8 bg-muted/60 rounded-lg w-3/4" />
          {isTall && <div className="h-8 bg-muted/40 rounded-lg w-1/2" />}
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 bg-muted/60 rounded w-full" />
          <div className="h-4 bg-muted/40 rounded w-5/6" />
          <div className="h-4 bg-muted/40 rounded w-4/6" />
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 pt-6 border-t border-border/50">
          <div className="h-8 w-8 bg-muted/60 rounded-full" />
          <div className="h-4 w-24 bg-muted/40 rounded" />
        </div>
      </div>
    </div>
  );
}
