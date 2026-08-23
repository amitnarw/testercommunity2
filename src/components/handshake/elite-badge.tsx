"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface EliteBadgeProps {
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const LABEL_SIZE_CLASSES = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function EliteBadge({
  size = "sm",
  showLabel = false,
  className,
}: EliteBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        className,
      )}
      title="Elite Badge"
    >
      <Star
        className={cn(SIZE_CLASSES[size], "fill-current")}
        aria-hidden="true"
      />
      {showLabel && (
        <span
          className={cn(
            "font-semibold uppercase tracking-wide",
            LABEL_SIZE_CLASSES[size],
          )}
        >
          Elite
        </span>
      )}
    </span>
  );
}
