"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CardDesign3({
  stats,
  isLoading,
  className,
}: {
  stats: any;
  isLoading?: boolean;
  className?: string;
}) {
  const totalTesters = stats?.totalTesters || 0;
  const verificationsToday = stats?.todayVerifications || 0;
  const activeTesters = stats?.activeTestersToday || 0;
  const pendingTasks =
    (stats?.pendingApprovals || 0) +
    (stats?.pendingVerifications || 0) +
    (stats?.pendingSupportRequests || 0);

  return (
    <Card
      className={cn(
        "bg-white dark:bg-[#0f0f0f] border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative flex items-center px-0 sm:p-3 transition-all duration-300 group",
        className,
      )}
    >
      <div className="flex flex-col md:flex-row items-center w-full h-full gap-4">
        {/* Left Side Primary Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 w-full sm:w-[190px] h-1/3 sm:h-full rounded-3xl p-6 relative flex flex-col justify-between shrink-0 shadow-lg dark:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.3)] overflow-hidden">
          <div className="hidden sm:flex justify-between items-center">
            <span className="text-white/80 text-[10px] font-bold tracking-wider uppercase">
              METRIC
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>

          <div className="z-10 relative">
            <p className="text-white/70 text-xs font-medium">
              Verified Testers
            </p>
            <h2 className="text-5xl font-black text-white tracking-tighter tabular-nums">
              {isLoading ? (
                <Skeleton className="h-10 w-20 bg-white/20" />
              ) : (
                totalTesters
              )}
            </h2>
          </div>

          <h2 className="absolute -bottom-4 -right-2 text-[6rem] font-black text-black/5 dark:text-white/5 select-none pointer-events-none tracking-tighter italic transition-transform group-hover:scale-110 duration-700 font-sans">
            Hub
          </h2>
        </div>

        {/* Right Side Text Content */}
        <div className="flex-1 space-y-5 px-4 pr-0 sm:pr-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="text-primary text-[10px] font-bold uppercase tracking-widest">
                Quality & Operations
              </p>
            </div>
            <h3 className="text-2xl font-black text-foreground tracking-tighter leading-[0.9]">
              Platform Health & Monitoring
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-foreground/40 text-[9px] font-bold uppercase tracking-tight">
                Verifications
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {isLoading ? "..." : verificationsToday}
                </p>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Today
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-foreground/40 text-[9px] font-bold uppercase tracking-tight">
                Active Testers
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {isLoading ? "..." : activeTesters}
                </p>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Active
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-primary/60 text-[9px] font-bold uppercase tracking-tight">
                Pending
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-primary tabular-nums">
                  {isLoading ? "..." : pendingTasks}
                </p>
                <span className="text-[10px] text-primary/60 font-medium">
                  Jobs
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-[2px] w-12 bg-primary/20 rounded-full" />
            <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/10 to-transparent rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}
