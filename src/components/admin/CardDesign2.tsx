"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

export function CardDesign2({
  stats,
  isLoading,
}: {
  stats: any;
  isLoading?: boolean;
}) {
  const totalSubmissions = stats?.totalSubmissions || 0;

  return (
    <Card className="bg-white dark:bg-[#0a0a0a] border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative h-[220px] p-6 flex flex-col justify-between transition-all duration-300">
      {/* Primary Bottom Glow */}
      <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[200px] h-[150px] bg-primary/20 dark:bg-primary/30 blur-[40px] rounded-full pointer-events-none" />

      <div className="flex justify-between items-start">
        <div>
          <p className="text-foreground/40 text-[10px] tracking-[0.2em] font-bold uppercase mb-1">
            PLATFORM ACTIVITY
          </p>
          <p className="text-foreground/30 text-[10px]">Active Submissions</p>
        </div>
        <div className="p-2 bg-foreground/5 rounded-xl">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="flex flex-col items-start gap-2">
        <h3 className="text-6xl font-black text-primary leading-none tracking-tighter tabular-nums">
          {isLoading ? (
            <Skeleton className="h-16 w-32 bg-muted" />
          ) : (
            totalSubmissions
          )}
        </h3>
        <p className="text-foreground/30 text-[10px] ml-1">
          Increasing day by day
        </p>
      </div>
    </Card>
  );
}
