"use client";

import { notFound } from "next/navigation";
import { CheckCircle, Star, Users } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { cn } from "@/lib/utils";
import { AppInfoSidebar } from "@/components/appInfoSidebar";
import { SubmittedFeedback } from "@/components/community-dashboard/submitted-feedback";
import DeveloperInstructions from "@/components/developerInstructions";
import { use } from "react";
import { useSingleHubAppDetails } from "@/hooks/useHub";
import { ExpandableText } from "@/components/expandable-text";

const DailyProgress = ({
  progress,
  totalDays,
}: {
  progress: number;
  totalDays: number;
}) => {
  const completedDays = Math.floor((totalDays * (progress || 0)) / 100);

  return (
    <div className="w-full grid grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-3">
      {Array.from({ length: totalDays }, (_, i) => {
        const day = i + 1;
        const isCompleted = day <= completedDays;
        const isCurrent = day === completedDays + 1;

        return (
          <div
            key={day}
            className={cn(
              "aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all duration-300 shadow-none hover:scale-105",
              isCurrent
                ? "bg-gradient-to-br from-primary to-accent text-primary-foreground scale-110"
                : "bg-gradient-to-br from-gray-400/20 to-gray-400/2",
              isCompleted
                ? "bg-gradient-to-br from-green-400/50 to-green-400/20 dark:from-green-400/60 dark:to-green-400/20 text-muted-foreground"
                : "",
            )}
          >
            {isCompleted ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <>
                <p
                  className={cn(
                    "text-[10px] sm:text-xs",
                    isCurrent ? "opacity-80" : "text-muted-foreground",
                  )}
                >
                  Day
                </p>
                <p
                  className={cn(
                    "font-bold",
                    isCurrent ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
                  )}
                >
                  {day}
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function AppTestingOngoingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    data: appDetails,
    isPending: appDetailsIsPending,
    refetch: appDetailsRefetch,
  } = useSingleHubAppDetails({ id });

  if (!id) {
    notFound();
  }

  const isTestingNotStarted = appDetails?.status === "AVAILABLE";

  return (
    <div className="min-h-screen mb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 xl:pl-8 w-1/2">
          <BackButton href="/community-dashboard" />
        </div>

        <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 mt-8">
          <div className="flex flex-col gap-10 lg:col-span-2">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent pb-1">
                  {appDetails?.androidApp?.appName}
                </h1>
                <ExpandableText
                  text={appDetails?.androidApp?.description}
                  className="text-muted-foreground text-md sm:text-lg leading-relaxed"
                />
              </section>
            </div>
            {/* Day Progress Section */}
            <section className="relative">
              <div
                className={cn(
                  isTestingNotStarted &&
                    "blur-sm pointer-events-none select-none",
                )}
              >
                <DailyProgress
                  progress={
                    ((appDetails?.currentDay || 0) /
                      (appDetails?.totalDay || 0)) *
                      100 || 0
                  }
                  totalDays={appDetails?.totalDay || 0}
                />
              </div>
              {isTestingNotStarted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl px-5 py-3 shadow-lg flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <span className="font-medium text-sm">
                      Waiting for testers ({appDetails?.currentTester || 0}/
                      {appDetails?.totalTester || 0})
                    </span>
                  </div>
                </div>
              )}
            </section>

            {appDetails?.instructionsForTester && (
              <DeveloperInstructions
                instruction={appDetails?.instructionsForTester}
              />
            )}

            {/* Feedback Section */}
            <div className="relative">
              <div
                className={cn(
                  isTestingNotStarted &&
                    "blur-sm pointer-events-none select-none",
                )}
              >
                <SubmittedFeedback
                  feedback={appDetails?.feedback || []}
                  hubId={id}
                  refetch={appDetailsRefetch}
                />
              </div>
              {isTestingNotStarted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/90 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center shadow-lg max-w-md">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary">
                        Feedback locked
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can submit feedback once testing begins.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-1">
            {appDetails && (
              <AppInfoSidebar
                app={appDetails}
                buttonType="external"
                url={`https://play.google.com/store/apps/details?id=${appDetails?.androidApp?.packageName}`}
              />
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}
