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
  const freeApps = stats?.submissionsByAppType?.FREE || 0;
  const paidApps = stats?.submissionsByAppType?.PAID || 0;

  return (
    <Card className="bg-white dark:bg-[#0a0a0a] border-none shadow-2xl shadow-black/10 rounded-[2.5rem] overflow-hidden relative h-[220px] p-6 flex flex-col justify-between transition-all duration-300">
      {/* Primary Bottom Glow */}
      <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[200px] h-[150px] bg-primary/20 dark:bg-primary/30 blur-[40px] rounded-full pointer-events-none" />

      <div className="flex justify-between items-start">
        <div>
          <p className="text-foreground/40 text-[10px] tracking-[0.2em] font-bold uppercase mb-1">
            APP SUBMISSIONS
          </p>
          <p className="text-foreground/30 text-[10px]">Free and paid apps listed on the platform</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <p className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-tight mb-1">
            Free
          </p>
          <h3 className="text-4xl font-black text-foreground leading-none tracking-tighter tabular-nums">
            {isLoading ? (
              <Skeleton className="h-10 w-16 bg-muted" />
            ) : (
              freeApps
            )}
          </h3>
          <p className="text-foreground/30 text-[10px] mt-1">apps</p>
        </div>
        <div>
          <p className="text-muted-foreground/50 text-[10px] font-bold uppercase tracking-tight mb-1">
            Paid
          </p>
          <h3 className="text-4xl font-black text-primary leading-none tracking-tighter tabular-nums">
            {isLoading ? (
              <Skeleton className="h-10 w-16 bg-muted" />
            ) : (
              paidApps
            )}
          </h3>
          <p className="text-foreground/30 text-[10px] mt-1">apps</p>
        </div>
      </div>
    </Card>
  );
}
