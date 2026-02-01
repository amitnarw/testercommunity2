"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Users,
  Trophy,
  Sparkles,
  Loader2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CompleteTestingBannerProps {
  appName: string;
  currentDay: number;
  totalDays: number;
  completedTesters: number;
  totalTesters: number;
  requiredTesters?: number; // Google Play requirement (default 12)
  onComplete?: () => Promise<void>;
}

export function CompleteTestingBanner({
  appName,
  currentDay,
  totalDays,
  completedTesters,
  totalTesters,
  requiredTesters = 12,
  onComplete,
}: CompleteTestingBannerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Logic:
  // - Soft Completion: Day >= 14 AND Testers >= 12
  // - Warning Completion: Day > 14 AND Testers < 12
  const isLastDay = currentDay >= totalDays;
  const isPastLastDay = currentDay > totalDays;
  const hasMinimumTesters = completedTesters >= requiredTesters;
  const remainingTesters = totalTesters - completedTesters;

  const showSoftCompletion = isLastDay && hasMinimumTesters;
  const showWarningCompletion = isPastLastDay && !hasMinimumTesters;

  if (!showSoftCompletion && !showWarningCompletion) {
    return null;
  }

  const handleComplete = async () => {
    if (!onComplete) return;
    setIsLoading(true);
    try {
      await onComplete();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to complete testing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isWarningMode = showWarningCompletion || !hasMinimumTesters;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="my-8"
      >
        <Card
          className={cn(
            "rounded-2xl overflow-hidden border shadow-sm relative my-20",
            isWarningMode
              ? "bg-gradient-to-br from-orange-600/80 to-amber-500/20 shadow-amber-500/20"
              : "bg-gradient-to-br from-blue-600/80 to-primary/20 shadow-primary/25",
          )}
        >
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            {isWarningMode ? (
              <AlertTriangle className="w-32 h-32 text-white" />
            ) : (
              <Trophy className="w-32 h-32 text-white" />
            )}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 sm:p-6 gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 border backdrop-blur-md",
                  isWarningMode
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-white/20 text-white border-white/30",
                )}
              >
                {isWarningMode ? (
                  <AlertTriangle className="h-6 w-6" />
                ) : (
                  <Trophy className="h-6 w-6" />
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
                    {isWarningMode ? "Action Required" : "Ready to Graduate"}
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed max-w-xl font-medium">
                    {isWarningMode
                      ? "Testing period ended, but minimum tester requirements aren't met yet."
                      : "Congratulations! You've met all Google Play testing requirements."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold bg-white/20 px-2.5 py-1 rounded-md border border-white/20 shadow-sm text-white backdrop-blur-sm">
                    <Users className="w-3.5 h-3.5 text-white/90" />
                    <span>
                      {completedTesters}/{requiredTesters} Testers
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold bg-white/20 px-2.5 py-1 rounded-md border border-white/20 shadow-sm text-white backdrop-blur-sm">
                    <Clock className="w-3.5 h-3.5 text-white/90" />
                    <span>
                      {currentDay}/{totalDays} Days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsDialogOpen(true)}
              className={cn(
                "w-full md:w-auto h-11 rounded-xl font-bold shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-white/20",
                isWarningMode
                  ? "bg-white text-orange-600 hover:bg-white/95 hover:shadow-orange-500/20"
                  : "bg-white text-blue-600 hover:bg-white/95 hover:shadow-blue-500/20",
              )}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isWarningMode ? "Complete Anyway" : "Finish Testing"}
            </Button>
          </div>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg overflow-hidden border-0 p-0 rounded-2xl gap-0 bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col max-h-[90vh]">
          {/* Native scroll container for reliable scrollbars */}
          <div className="overflow-y-auto flex-1 p-3 sm:p-6">
            <DialogHeader className="mb-4">
              <div className="flex items-center gap-4 relative">
                <div
                  className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner",
                    "absolute -top-2 -left-2 scale-[2] -z-10 sm:static sm:scale-100 sm:origin-center sm:z-auto",
                    isWarningMode
                      ? "bg-amber-100/20 text-amber-600/20 dark:bg-amber-900/10 dark:text-amber-400/10"
                      : "bg-blue-100/20 text-blue-600/20 dark:bg-blue-900/10 dark:text-blue-400/10",
                  )}
                >
                  {isWarningMode ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : (
                    <Trophy className="h-6 w-6" />
                  )}
                </div>
                <div className="sm:pl-0 transition-all duration-300">
                  <DialogTitle className="text-xl sm:text-2xl font-bold">
                    {isWarningMode
                      ? "End Testing Early?"
                      : "Complete Testing Phase"}
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base mt-1">
                    Finalize the testing process for {appName}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background dark:bg-secondary/30 rounded-xl p-4 border border-border/50 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Testers
                  </span>
                  <span
                    className={cn(
                      "text-2xl font-bold",
                      hasMinimumTesters
                        ? "text-green-600 dark:text-green-400"
                        : "text-amber-600 dark:text-amber-400",
                    )}
                  >
                    {completedTesters}/{requiredTesters}
                  </span>
                </div>
                <div className="bg-background dark:bg-secondary/30 rounded-xl p-4 border border-border/50 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Duration
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {currentDay}/{totalDays}
                  </span>
                </div>
              </div>

              {/* Warnings or Success Message */}
              {isWarningMode ? (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-4 flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-red-900 dark:text-red-300 text-sm">
                      Critical Warning
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-400/90 leading-relaxed">
                      Ending now with insufficient testers may lead to rejection
                      on Google Play Console. We strongly recommend waiting
                      until you have {requiredTesters}+ testers.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 p-4 flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-green-900 dark:text-green-300 text-sm">
                      Requirements Met
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-400/90 leading-relaxed">
                      Excellent work! You have met all Google Play requirements
                      for closed testing.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-background dark:bg-secondary/30 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed border border-border/50">
                {hasMinimumTesters
                  ? "Requirements are fulfilled. All testers will be notified about the completion. You can manually check and verify the testers' participation; they will receive their points only after your verification."
                  : "By clicking confirm, all current testers will be notified, and no new testers will be able to join."}
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 gap-3 sm:gap-4 bg-muted/20 mt-auto border-t">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl h-11 flex-1 border-2 font-medium"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className={cn(
                "rounded-xl h-11 flex-1 font-bold text-white shadow-md transition-all",
                isWarningMode
                  ? "bg-red-600 hover:bg-red-700 hover:shadow-red-500/20"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20",
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>{isWarningMode ? "End Anyway" : "Confirm Completion"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
