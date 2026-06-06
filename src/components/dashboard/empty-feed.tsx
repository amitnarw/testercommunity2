"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface EmptyFeedProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyFeed({
  icon: Icon,
  title,
  description,
  className,
}: EmptyFeedProps) {
  return (
    <div className={cn("flex flex-col items-center py-8 text-center", className)}>
      <div className="rounded-2xl bg-muted/50 p-4 mb-3">
        <Icon className="w-8 h-8 text-muted-foreground/40" />
      </div>
      <p className="text-sm text-muted-foreground">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">
          {description}
        </p>
      )}
    </div>
  );
}
