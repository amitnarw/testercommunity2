"use client";

import { Clock, Coins, Trophy, Sparkles, Timer, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface LastDayReminderProps {
  appName?: string;
  isTestingCompleted?: boolean;
}

export function LastDayReminder({
  appName = "this app",
  isTestingCompleted = false,
}: LastDayReminderProps) {
  if (isTestingCompleted) {
    return <TestingCompletedBanner appName={appName} />;
  }

  return <LastDayBanner appName={appName} />;
}

// Last Day Warning Banner
function LastDayBanner({ appName }: { appName: string }) {
  return (
    <Card className="relative overflow-hidden border-0 bg-white dark:bg-zinc-950 shadow-xl shadow-primary/5 mb-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Animated Icon */}
          <div className="shrink-0">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25">
                <Timer className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              {/* Pulse ring */}
              <div
                className="absolute inset-0 rounded-2xl animate-ping bg-primary/20"
                style={{ animationDuration: "2s" }}
              />
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                Final Day
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                Action Needed
              </span>
            </div>

            <p className="mt-2 text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Today is your last day to test{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {appName}
              </span>
              . Complete your verification to unlock your reward.
            </p>

            {/* Action hint */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <div className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <span>Upload screenshot to verify</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-zinc-700" />
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <div className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <span>View-only after completion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="h-1 bg-slate-100 dark:bg-zinc-800">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: "92%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </Card>
  );
}

// Testing Completed Banner
function TestingCompletedBanner({ appName }: { appName: string }) {
  return (
    <Card className="relative overflow-hidden border-0 bg-white dark:bg-zinc-950 shadow-xl shadow-primary/5 mb-6">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/50 dark:from-emerald-950/10 to-transparent" />
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          {/* Left: Status */}
          <div className="flex items-start gap-4 flex-1">
            <div className="shrink-0">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Trophy className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  Testing Complete
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  View Only
                </span>
              </div>

              <p className="mt-2 text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Great work testing{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {appName}
                </span>
                ! Your feedback has been submitted and is now read-only.
              </p>
            </div>
          </div>

          {/* Right: Verification Status */}
          <div className="lg:w-80 lg:shrink-0">
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Under Verification
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Typically takes 2-3 days
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 text-xs">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Points credited automatically after approval
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400" />
    </Card>
  );
}
