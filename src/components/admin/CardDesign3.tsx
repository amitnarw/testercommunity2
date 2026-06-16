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
  const totalUsers = stats?.totalUsers || 0;
  const completedPaidApps = stats?.completedPaidApps || 0;
  const completedFreeApps = stats?.completedFreeApps || 0;
  const paidTesters = stats?.paidTesters || 0;

  return (
    <Card
      className={cn(
        "bg-white dark:bg-[#0f0f0f] border-none shadow-2xl shadow-black/10 rounded-[2.5rem] overflow-hidden relative flex items-center px-0 sm:p-3 transition-all duration-300 group",
        className,
      )}
    >
      <div className="flex flex-col md:flex-row items-center w-full h-full gap-4">
        {/* Left Side Primary Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 w-full sm:w-[190px] sm:h-full rounded-3xl p-6 relative flex flex-col justify-between shrink-0 shadow-lg dark:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.3)] overflow-hidden">
          <div className="hidden sm:flex justify-between items-center">
            <span className="text-white/80 text-[10px] font-bold tracking-wider uppercase">
              METRIC
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>

          <div className="z-10 relative">
            <p className="text-white/70 text-xs font-medium">
              Platform Members
            </p>
            <h2 className="text-5xl font-black text-white tracking-tighter tabular-nums">
              {isLoading ? (
                <Skeleton className="h-10 w-20 bg-white/20" />
              ) : (
                totalUsers
              )}
            </h2>
            <p className="text-white/50 text-[10px] mt-1">
              Registered accounts
            </p>
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
                Completion & Engagement
              </p>
            </div>
            <h3 className="text-2xl font-black text-foreground tracking-tighter leading-[0.9]">
              Project Completions
            </h3>
            <p className="text-foreground/40 text-[11px] mt-1">
              Completed apps and paid app tester engagement
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-foreground/40 text-[9px] font-bold uppercase tracking-tight">
                Paid Apps Completed
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {isLoading ? "..." : completedPaidApps}
                </p>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Projects
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-foreground/40 text-[9px] font-bold uppercase tracking-tight">
                Free Apps Completed
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {isLoading ? "..." : completedFreeApps}
                </p>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Projects
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-foreground/40 text-[9px] font-bold uppercase tracking-tight">
                Paid Testers
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {isLoading ? "..." : paidTesters}
                </p>
                <span className="text-[10px] text-muted-foreground font-medium">
                  Enrolled
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
