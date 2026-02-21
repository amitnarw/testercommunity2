"use client";

import { useState, useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { SafeImage } from "@/components/safe-image";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Confetti from "react-dom-confetti";
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
  ArrowLeft,
  Edit2,
  RotateCcw,
  Check,
  XCircle,
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { AppInfoSidebar } from "@/components/appInfoSidebar";
import {
  useAddHubAppTestingRequest,
  useSingleHubAppDetails,
} from "@/hooks/useHub";
import { ExpandableText } from "@/components/expandable-text";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "500px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

function AppTestingPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [fireConfetti, setFireConfetti] = useState(false);

  const { data: appDetails, isPending: appDetailsIsPending } =
    useSingleHubAppDetails({ id });

  const { mutate, isPending, isSuccess, isError, error, reset } =
    useAddHubAppTestingRequest();

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessModal(true);
      // specific small delay to make it pop with the modal
      setTimeout(() => setFireConfetti(true), 300);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  const handleSubmit = () => {
    mutate({ hub_id: id });
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    setFireConfetti(false);
    router.push("/community-dashboard");
  };

  const handleErrorRetry = () => {
    setShowErrorModal(false);
    mutate({ hub_id: id });
  };

  const handleErrorEdit = () => {
    setShowErrorModal(false);
    reset();
  };

  const handleErrorGoBack = () => {
    setShowErrorModal(false);
    router.push("/community-dashboard");
  };

  if (appDetailsIsPending) {
    return (
      <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="sticky top-0 z-[50] pt-2 pb-4 pl-0 xl:pl-8 w-1/2">
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
        <div className="sticky top-0 z-[50] pt-2 pb-4 pl-0 xl:pl-8 w-1/2">
          <BackButton href="/community-dashboard" />
        </div>

        <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 mt-8">
          <div className="lg:col-span-2 space-y-12 overflow-hidden">
            <section>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent pb-2">
                {appDetails?.androidApp?.appName}
              </h1>
              <ExpandableText
                text={appDetails?.androidApp?.description}
                className="text-muted-foreground text-md sm:text-lg leading-relaxed"
              />
            </section>

            {appDetails?.testerRelations?.[0]?.status === "REJECTED" && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[32px] border border-destructive/10 bg-background/50 backdrop-blur-xl shadow-2xl shadow-destructive/5 relative overflow-hidden group mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/60 to-red-500/20 dark:from-red-500/30 dark:to-red-500/5 opacity-30 dark:opacity-70" />

                <div className="flex flex-col lg:flex-row relative z-10">
                  {/* Content Side */}
                  <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center gap-6 mb-8 sm:mb-0">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shadow-inner ring-1 ring-destructive/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-transparent opacity-50" />
                        <XCircle className="w-7 h-7 relative z-10" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex h-2 w-2 rounded-full bg-destructive"></span>
                          <p className="text-xs font-bold text-destructive uppercase tracking-widest">
                            Action Required
                          </p>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                          {appDetails?.testerRelations?.[0]?.statusDetails
                            ?.title || "Request Rejected"}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-6 relative">
                      <div className="bg-white/50 dark:bg-white/10 rounded-2xl p-3 sm:p-5 border border-destructive/10 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-3 text-yellow-500 font-medium text-sm uppercase tracking-wider">
                          <AlertTriangle className="w-4 h-4" />
                          Publisher Feedback
                        </div>
                        <p className="text-base text-foreground/80 leading-relaxed font-medium">
                          {
                            appDetails?.testerRelations?.[0]?.statusDetails
                              ?.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Media Side */}
                  {appDetails?.testerRelations?.[0]?.statusDetails?.image && (
                    <div
                      className="flex w-full lg:w-[400px] relative h-[300px] lg:h-auto lg:min-h-full group/image cursor-pointer overflow-hidden border-t lg:border-t-0 lg:border-l border-destructive/10"
                      onClick={() =>
                        setFullscreenImage(
                          appDetails?.testerRelations?.[0]?.statusDetails
                            ?.image!,
                        )
                      }
                    >
                      <SafeImage
                        src={
                          appDetails?.testerRelations?.[0]?.statusDetails?.image
                        }
                        alt="Rejection details"
                        fill
                        className="object-cover transition-transform duration-700 group-hover/image:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 lg:opacity-0 group-hover/image:opacity-100 transition-all duration-500 lg:bg-black/40 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                        <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transform scale-0 group-hover/image:scale-100 transition-transform duration-300 delay-100">
                          <Expand className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white text-sm font-medium opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 delay-200">
                          View Evidence
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
              <div className="w-full">
                <div className="flex flex-row gap-2 overflow-x-auto pb-4 -mb-4">
                  {appDetails?.androidApp?.appScreenshotUrl1 && (
                    <div
                      className="overflow-hidden rounded-xl flex-shrink-0 w-40 sm:w-60 relative group cursor-pointer"
                      onClick={() => {
                        setFullscreenImage(
                          appDetails?.androidApp?.appScreenshotUrl1,
                        );
                      }}
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
                      onClick={() => {
                        setFullscreenImage(
                          appDetails?.androidApp?.appScreenshotUrl2,
                        );
                      }}
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
              <AppInfoSidebar
                app={appDetails}
                handleRequestToJoin={handleSubmit}
                isPending={isPending}
                isSuccess={isSuccess}
                isError={isError}
                error={error}
                reset={reset}
              />
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
                <div className="prose prose-base dark:prose-invert leading-relaxed text-white dark:text-black bg-sidebar p-3 sm:p-6 rounded-lg border-primary border-l-4 shadow-xl shadow-gray-300 dark:shadow-gray-700 text-sm sm:text-base">
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
            <AppInfoSidebar
              app={appDetails}
              handleRequestToJoin={handleSubmit}
              isPending={isPending}
              isSuccess={isSuccess}
              isError={isError}
              error={error}
              reset={reset}
            />
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
          <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            <SafeImage
              src={fullscreenImage}
              alt="Fullscreen view"
              layout="fill"
              objectFit="contain"
              priority
              className="animate-in zoom-in-95"
              loadingClassName="w-[300px] h-[600px] max-h-[80vh] rounded-[2.5rem] border-[6px] border-white/5 dark:border-white/10 shadow-2xl bg-muted/20"
            />
          </div>
        </div>
      )}

      {/* Premium Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[425px] p-0 border-none bg-transparent shadow-none overflow-hidden outline-none [&>button]:hidden">
          <div className="relative rounded-3xl bg-white dark:bg-[#1A1A1A] p-6 sm:p-8 flex flex-col items-center shadow-2xl overflow-hidden border border-white/20 dark:border-white/5">
            {/* Confetti Explosion (Centered behind icon) */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
              <Confetti active={fireConfetti} config={confettiConfig} />
            </div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25 mb-6"
            >
              <Check className="w-10 h-10 text-white stroke-[3px]" />
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-2 z-10"
            >
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Application Sent!
              </h2>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                Good luck! You will be notified once the developer accepts your
                request.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 w-full z-10"
            >
              <Button
                onClick={handleSuccessConfirm}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl h-12 text-md font-semibold shadow-lg shadow-green-500/20 active:scale-95 transition-all duration-200"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Premium Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-[425px] p-0 border-none bg-transparent shadow-none overflow-hidden outline-none [&>button]:hidden">
          <div className="relative rounded-3xl bg-white dark:bg-[#1A1A1A] p-6 sm:p-8 flex flex-col items-center shadow-2xl border border-white/20 dark:border-white/5">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6"
            >
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
            </motion.div>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xl font-bold text-foreground">
                Oops! Something went wrong
              </h2>
              <p className="text-destructive text-sm font-medium px-4">
                {error?.message ||
                  "We couldn't submit your request. Please try again."}
              </p>
            </div>

            <div className="w-full space-y-3">
              <Button
                onClick={handleErrorRetry}
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-semibold shadow-md shadow-red-500/20"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleErrorEdit}
                  className="w-full border-2 rounded-xl h-11 font-medium hover:bg-secondary/50 dark:hover:bg-secondary/20"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleErrorGoBack}
                  className="w-full rounded-xl h-11 font-medium hover:bg-secondary/50 dark:hover:bg-secondary/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
