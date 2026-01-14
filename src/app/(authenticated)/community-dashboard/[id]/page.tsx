"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { SafeImage } from "@/components/safe-image";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Expand,
  Trophy,
  RefreshCw,
  CheckCircle,
  Compass,
  PenTool,
  Smile,
  ThumbsUp,
  X,
  AlertTriangle,
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { AppInfoSidebar } from "@/components/appInfoSidebar";
import { useSingleHubAppDetails } from "@/hooks/useUser";
import { ExpandableText } from "@/components/expandable-text";

function AppTestingPageClient({ id }: { id: string }) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const { data: appDetails, isPending: appDetailsIsPending } =
    useSingleHubAppDetails({ id });

  if (appDetailsIsPending) {
    return (
      <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 xl:pl-8 w-1/2">
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>

          <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 mt-8">
            <div className="lg:col-span-2 space-y-12 overflow-hidden">
              <section className="space-y-4">
                <Skeleton className="h-10 sm:h-12 w-3/4 max-w-lg rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full max-w-2xl" />
                  <Skeleton className="h-4 w-5/6 max-w-xl" />
                </div>
              </section>

              <section>
                <Skeleton className="h-8 w-40 mb-6 rounded-md" />
                <div className="flex flex-row gap-4 overflow-hidden">
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      className="w-40 sm:w-60 h-[320px] sm:h-[480px] rounded-xl flex-shrink-0"
                    />
                  ))}
                </div>
              </section>

              <div className="block lg:hidden">
                <Skeleton className="h-[400px] w-full rounded-2xl" />
              </div>

              <section className="!mt-20">
                <Skeleton className="h-8 w-48 mb-6 rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                  ))}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-8 w-56 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-lg hidden sm:block" />
                </div>
                <Skeleton className="h-48 w-full rounded-lg" />
              </section>

              <section>
                <Skeleton className="h-8 w-64 mb-6 rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-lg" />
                  ))}
                </div>
              </section>
            </div>
            <aside className="lg:col-span-1 hidden lg:block">
              <Skeleton className="h-[600px] w-full rounded-2xl sticky top-24" />
            </aside>
          </main>
        </div>
      </div>
    );
  }

  if (!appDetails) {
    notFound();
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] text-foreground min-h-screen pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 xl:pl-8 w-1/2">
          <BackButton href="/community-dashboard" />
        </div>

        <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 mt-8">
          <div className="lg:col-span-2 space-y-12 overflow-hidden">
            <section>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                {appDetails?.androidApp?.appName}
              </h1>
              <ExpandableText
                text={appDetails?.androidApp?.description}
                className="text-muted-foreground text-md sm:text-lg mt-2 leading-relaxed"
              />
            </section>

            {appDetails?.status === "REJECTED" &&
              appDetails?.statusDetails?.description && (
                <section className="bg-destructive/10 border-2 border-dashed border-destructive/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-destructive/5 sm:bg-destructive/10 p-3 rounded-full text-destructive absolute sm:static top-2 right-0 sm:top-auto sm:right-auto scale-[3] sm:scale-100">
                      <AlertTriangle className="w-8 h-8 text-destructive/20 sm:text-destructive" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-destructive dark:text-red-500">
                      Request Rejected
                    </h2>
                  </div>
                  <div className="flex flex-row gap-6 items-start">
                    <p className="text-destructive/80 dark:text-red-500/80 leading-relaxed">
                      {appDetails?.statusDetails?.description}
                    </p>
                    {appDetails?.statusDetails?.image && (
                      <div
                        className="relative rounded-lg overflow-hidden group cursor-pointer"
                        onClick={() =>
                          setFullscreenImage(appDetails?.statusDetails?.image!)
                        }
                      >
                        <SafeImage
                          src={appDetails?.statusDetails?.image}
                          alt="Request Rejected"
                          width={600}
                          height={400}
                          className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={appDetails?.statusDetails?.image}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Expand className="w-10 h-10 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

            <section>
              <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
              <div className="w-full">
                <div className="flex flex-row gap-2 overflow-x-auto pb-4 -mb-4">
                  {appDetails?.androidApp?.appScreenshotUrl1 && (
                    <div
                      className="overflow-hidden rounded-xl flex-shrink-0 w-40 sm:w-60 relative group cursor-pointer"
                      onClick={() =>
                        setFullscreenImage(
                          appDetails?.androidApp?.appScreenshotUrl1
                        )
                      }
                    >
                      <SafeImage
                        src={appDetails?.androidApp?.appScreenshotUrl1}
                        alt="App Screenshot 1"
                        width={400}
                        height={800}
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300 bg-muted/20"
                        data-ai-hint={appDetails?.androidApp?.appScreenshotUrl1}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Expand className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                  {appDetails?.androidApp?.appScreenshotUrl2 && (
                    <div
                      className="overflow-hidden rounded-xl flex-shrink-0 w-40 sm:w-60 relative group cursor-pointer"
                      onClick={() =>
                        setFullscreenImage(
                          appDetails?.androidApp?.appScreenshotUrl2
                        )
                      }
                    >
                      <SafeImage
                        src={appDetails?.androidApp?.appScreenshotUrl2}
                        alt="App Screenshot 2"
                        width={400}
                        height={800}
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300 bg-muted/20"
                        data-ai-hint={appDetails?.androidApp?.appScreenshotUrl2}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Expand className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Sidebar for mobile, shown in flow */}
            <div className="block lg:hidden">
              <AppInfoSidebar app={appDetails} />
            </div>

            <section className="!mt-20">
              <h2 className="text-2xl font-bold mb-4">Testing Protocol</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-gradient-to-br from-secondary to-secondary/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold">Complete the Full Cycle</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You must keep the app installed for the entire 14-day
                    period. Points are awarded only after successful completion.
                  </p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-secondary to-secondary/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold">No Skipping Days</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    If you uninstall the app or fail to engage, your progress
                    will reset to Day 1. Consistency is key!
                  </p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-secondary to-secondary/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold">Provide Quality Feedback</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Once ongoing, you can submit feedback via the 'Ongoing
                    Tests' tab. Quality feedback helps everyone.
                  </p>
                </Card>
              </div>
            </section>

            {appDetails?.instructionsForTester && (
              <section>
                <h2 className="mb-4 flex flex-row items-center justify-between gap-2 sm:justify-start">
                  <span className="text-2xl font-bold whitespace-nowrap">
                    Developer's Instructions
                  </span>
                  <span className="bg-gradient-to-b from-primary to-primary/50 text-white font-bold rounded-lg px-4 py-0.5 text-xl hidden sm:inline">
                    Important
                  </span>
                </h2>
                <div className="prose prose-base dark:prose-invert leading-relaxed text-white dark:text-black bg-[#121212] dark:bg-white p-3 sm:p-6 rounded-lg border-primary border-l-4 shadow-xl shadow-gray-300 dark:shadow-gray-700 text-sm sm:text-base">
                  <span className="bg-gradient-to-b from-primary to-primary/50 text-white font-bold rounded-md px-4 py-0.5 text-lg inline sm:hidden">
                    Important
                  </span>
                  <p className="mt-2 sm:mt-0">
                    {appDetails?.instructionsForTester}
                  </p>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">
                General Testing Instructions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-secondary p-4 rounded-lg flex items-start gap-3">
                  <Compass className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Explore Freely</h4>
                    <p className="text-muted-foreground">
                      Use the app as you normally would. Explore different
                      screens, features, and user flows.
                    </p>
                  </div>
                </div>
                <div className="bg-secondary p-4 rounded-lg flex items-start gap-3">
                  <Smile className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Note Your Feelings</h4>
                    <p className="text-muted-foreground">
                      Pay attention to what feels delightful, confusing, or
                      frustrating. All emotional feedback is valuable.
                    </p>
                  </div>
                </div>
                <div className="bg-secondary p-4 rounded-lg flex items-start gap-3">
                  <PenTool className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Be Specific</h4>
                    <p className="text-muted-foreground">
                      When you find a bug, describe the steps to reproduce it.
                      Clear context helps developers fix issues faster.
                    </p>
                  </div>
                </div>
                <div className="bg-secondary p-4 rounded-lg flex items-start gap-3">
                  <ThumbsUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">Be Constructive</h4>
                    <p className="text-muted-foreground">
                      The goal is to help developers improve. Frame your
                      feedback constructively and respectfully.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <aside className="lg:col-span-1 hidden lg:block">
            <AppInfoSidebar app={appDetails} />
          </aside>
        </main>
      </div>
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
          onClick={() => setFullscreenImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg z-50"
            onClick={() => setFullscreenImage(null)}
          >
            <X className="w-8 h-8" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
            <SafeImage
              src={fullscreenImage}
              alt="Fullscreen view"
              layout="fill"
              objectFit="contain"
              className="animate-in zoom-in-95"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppTestingPage() {
  const params = useParams<{ id: string }>();

  if (!params.id) {
    notFound();
  }

  return <AppTestingPageClient id={params.id} />;
}
