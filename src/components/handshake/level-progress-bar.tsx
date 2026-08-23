"use client";

import { Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useMyLevel } from "@/hooks/useLevel";
import { EliteBadge } from "./elite-badge";
import { Skeleton } from "@/components/ui/skeleton";

interface LevelProgressBarProps {
  className?: string;
  showNextLabel?: boolean;
}

export function LevelProgressBar({ className, showNextLabel = true }: LevelProgressBarProps) {
  const { data, isLoading } = useMyLevel();

  if (isLoading || !data) {
    return (
      <div className={className}>
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  const isMax = data.nextThreshold === null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold">Level {data.level}</span>
          {data.eliteBadge && <EliteBadge size="xs" />}
        </div>
        {showNextLabel && !isMax && (
          <span className="text-muted-foreground">
            {data.remaining} to L{data.level + 1}
          </span>
        )}
        {showNextLabel && isMax && (
          <span className="text-amber-600 font-semibold">Max level</span>
        )}
      </div>
      <Progress value={data.percent} />
      <p className="text-[10px] text-muted-foreground mt-1">
        {data.completedCount} completed · {data.slots} slots
      </p>
    </div>
  );
}
