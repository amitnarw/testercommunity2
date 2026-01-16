"use client";

import { SafeImage } from "@/components/safe-image";
import { projects as allProjects } from "@/lib/data"; // Using project data as it's richer
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bug,
  CheckCircle,
  Clock,
  MessageSquare,
  LayoutGrid,
  List,
  Lightbulb,
  PartyPopper,
  Search,
  ClipboardList,
  X,
  XCircle,
  AlertTriangle,
  Expand,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { BackButton } from "@/components/back-button";
import { AppPagination } from "@/components/app-pagination";
import DeveloperInstructions from "@/components/developerInstructions";
import AppInfoHeader from "@/components/app-info-header";
import Confetti from "react-dom-confetti";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useSingleHubAppDetails } from "@/hooks/useUser";

const FEEDBACK_PER_PAGE = 5;

const getStatusConfig = (status: string) => {
  switch (status) {
    case "In Testing":
      return {
        badgeVariant: "destructive",
        icon: <Clock className="w-5 h-5" />,
      };
    case "Completed":
      return {
        badgeVariant: "secondary",
        icon: <CheckCircle className="w-5 h-5" />,
      };
    case "In Review":
      return {
        badgeVariant: "secondary",
        icon: <Search className="w-5 h-5" />,
      };
    case "Rejected":
      return {
        badgeVariant: "destructive",
        icon: <XCircle className="w-5 h-5" />,
      };
    default:
      return { badgeVariant: "secondary", icon: <Clock className="w-5 h-5" /> };
  }
};

const getFeedbackIcon = (type: string) => {
  switch (type) {
    case "Bug":
      return <Bug className="w-4 h-4 text-red-500" />;
    case "Suggestion":
      return <Lightbulb className="w-4 h-4 text-amber-500" />;
    case "Praise":
      return <PartyPopper className="w-4 h-4 text-green-500" />;
    default:
      return <MessageSquare className="w-4 h-4" />;
  }
};

const getSeverityBadge = (severity: string) => {
  if (severity === "N/A") return null;
  switch (severity) {
    case "CRITICAL":
      return (
        <Badge
          variant="destructive"
          className="bg-red-700 hover:bg-red-800 text-[10px] sm:text-xs p-0 px-1 sm:px-2 sm:py-0.5"
        >
          {severity}
        </Badge>
      );
    case "HIGH":
      return (
        <Badge
          variant="destructive"
          className="bg-red-500/80 hover:bg-red-600 text-[10px] sm:text-xs p-0 px-1 sm:px-2 sm:py-0.5"
        >
          {severity}
        </Badge>
      );
    case "MEDIUM":
      return (
        <Badge
          variant="secondary"
          className="bg-amber-500/80 hover:bg-amber-600 text-white text-[10px] sm:text-xs p-0 px-1 sm:px-2 sm:py-0.5"
        >
          {severity}
        </Badge>
      );
    case "LOW":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-500/80 hover:bg-yellow-600 text-white text-[10px] sm:text-xs p-0 px-1 sm:px-2 sm:py-0.5"
        >
          {severity}
        </Badge>
      );
    default:
      return <Badge variant="outline">{severity}</Badge>;
  }
};

const TestCompleteSection = ({
  app,
  isUnderReviewOrRejected,
}: {
  app: any;
  isUnderReviewOrRejected: boolean;
}) => {
  const { ref } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  // Mock data for feedback breakdown, as it's not in the app object
  const feedbackBreakdown = {
    bugs: 3,
    suggestions: 2,
    praise: 1,
    totalTesters: 15,
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      className="grid grid-cols-2 sm:grid-cols-4 gap-2"
    >
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-green-500/20 to-green-500/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center "
      >
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-green-500/20 mb-2">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-md sm:text-lg font-bold text-green-500">
          Test Complete!
        </h2>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-1 items-center justify-center rounded-2xl overflow-hidden "
      >
        <div className="bg-gradient-to-tl from-primary/20 to-primary text-primary-foreground p-2 sm:p-5 h-full w-full flex flex-col items-center justify-center gap-1">
          <p className="text-xs">Total Testers</p>
          <p className="text-4xl sm:text-5xl font-bold">{app.testersStarted}</p>
        </div>
        <div className="bg-gradient-to-tr from-primary/20 to-primary text-primary-foreground p-2 sm:p-5 h-full w-full flex flex-col items-center justify-center gap-1">
          <p className="text-xs">Total Days</p>
          <p className="text-4xl sm:text-5xl font-bold">
            {isUnderReviewOrRejected ? 0 : app.totalDays}
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-card p-3 pt-2 rounded-2xl flex flex-col justify-between relative overflow-hidden col-span-2"
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-1 bg-gradient-to-b from-primary to-primary/50 text-transparent bg-clip-text text-center">
          Feedback Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-gradient-to-bl from-red-500/20 to-red-500/10 p-5 rounded-lg relative overflow-hidden">
            <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-red-500">
              <Bug />
            </div>
            <p className="text-xs text-muted-foreground">Bugs</p>
            <p className="text-4xl font-bold">{feedbackBreakdown.bugs}</p>
          </div>
          <div className="bg-gradient-to-bl from-yellow-500/20 to-yellow-500/10 p-5 rounded-lg relative overflow-hidden">
            <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-yellow-500">
              <Lightbulb />
            </div>
            <p className="text-xs text-muted-foreground">Suggestions</p>
            <p className="text-4xl font-bold">
              {feedbackBreakdown.suggestions}
            </p>
          </div>
          <div className="bg-gradient-to-bl from-green-500/20 to-green-500/10 p-5 rounded-lg relative overflow-hidden">
            <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-90 text-green-500">
              <PartyPopper />
            </div>
            <p className="text-xs text-muted-foreground">Praise</p>
            <p className="text-4xl font-bold">{feedbackBreakdown.praise}</p>
          </div>
          <div className="bg-secondary p-1.5 pt-3 rounded-lg flex flex-col gap-2 items-center justify-center">
            <p className="text-xs">Points Cost</p>
            <p className="text-3xl font-bold bg-card rounded-lg w-full h-full flex flex items-center justify-center">
              {isUnderReviewOrRejected ? 0 : app?.pointsCost.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

function SubmissionDetailsPage({ params }: { params: { id: string } }) {
  // const project = allProjects.find((p) => p.id.toString() === params.id);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [isConfettiActive, setConfettiActive] = useState(false);

  const { data: appDetails, isPending: appDetailsIsPending } =
    useSingleHubAppDetails({ id: params.id });

  const { ref: confettiTriggerRef, inView: confettiInView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (confettiInView && appDetails?.status === "COMPLETED") {
      setTimeout(() => setConfettiActive(true), 300);
    }
  }, [confettiInView, appDetails?.status]);

  if (!appDetails) {
    return <div>Project not found</div>;
  }

  const statusConfig = getStatusConfig(appDetails.status);
  const isUnderReviewOrRejected =
    appDetails.status === "IN_REVIEW" || appDetails.status === "REJECTED";

  const filteredFeedback = isUnderReviewOrRejected ? [] : appDetails?.feedback;

  const totalFeedbackPages = Math.ceil(
    filteredFeedback.length / FEEDBACK_PER_PAGE
  );
  const feedbackStartIndex = (feedbackPage - 1) * FEEDBACK_PER_PAGE;
  const feedbackEndIndex = feedbackStartIndex + FEEDBACK_PER_PAGE;
  const currentFeedback = filteredFeedback.slice(
    feedbackStartIndex,
    feedbackEndIndex
  );

  const handleFeedbackPageChange = (page: number) => {
    if (page < 1 || page > totalFeedbackPages) return;
    setFeedbackPage(page);
  };

  const feedbackBreakdown = {
    bugs: isUnderReviewOrRejected
      ? 0
      : appDetails?.feedback.filter((fb) => fb.type === "BUG").length,
    suggestions: isUnderReviewOrRejected
      ? 0
      : appDetails?.feedback.filter((fb) => fb.type === "SUGGESTION").length,
    praise: isUnderReviewOrRejected
      ? 0
      : appDetails?.feedback.filter((fb) => fb.type === "PRAISE").length,
    totalTesters: isUnderReviewOrRejected ? 0 : appDetails?.currentTester,
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] text-foreground min-h-screen relative">
      <div
        ref={confettiTriggerRef}
        className="absolute top-0 left-1/2 -translate-x-1/2"
      >
        <Confetti
          active={isConfettiActive}
          config={{
            angle: 90,
            spread: 360,
            startVelocity: 40,
            elementCount: 200,
            dragFriction: 0.12,
            duration: 5000,
            stagger: 3,
            width: "10px",
            height: "10px",
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
          }}
        />
      </div>
      <div className="container mx-auto px-4 md:px-6">
        <main className="max-w-7xl mx-auto space-y-8">
          <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 w-1/2">
            <BackButton href="/community-dashboard/my-submissions" />
          </div>

          <AppInfoHeader
            logo={appDetails?.androidApp?.appLogoUrl}
            name={appDetails?.androidApp?.appName}
            dataAiHint={appDetails?.androidApp?.appName}
            category={appDetails?.androidApp?.appCategory?.name}
            description={appDetails?.androidApp?.description || ""}
            status={appDetails?.status}
            statusConfig={statusConfig}
          />

          {appDetails?.status === "REJECTED" &&
            appDetails?.statusDetails?.description && (
              <section className="bg-destructive/10 border-2 border-dashed border-destructive/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-destructive/5 p-3 sm:bg-destructive/10 p-3 rounded-full text-destructive absolute sm:static top-2 right-0 sm:top-auto sm:right-auto scale-[3] sm:scale-100">
                    <AlertTriangle className="w-8 h-8 text-destructive/20 sm:text-destructive" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-destructive dark:text-red-500">
                    {appDetails?.statusDetails?.title}
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
                        alt={appDetails?.statusDetails?.title}
                        width={600}
                        height={400}
                        className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={appDetails?.statusDetails?.title}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Expand className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

          <div
            className={`relative flex flex-col gap-10 ${
              isUnderReviewOrRejected ? "blur-md pointer-events-none" : ""
            }`}
          >
            {/* {isUnderReviewOrRejected && (
                            <div className="absolute inset-0 bg-background/70 backdrop-blur-[10px] z-20 rounded-2xl flex flex-col items-center justify-center">
                                <div className="bg-secondary/80 p-4 rounded-full mb-4">
                                    {project.status === 'In Review' ? <Search className="w-12 h-12 text-primary" /> : <XCircle className="w-12 h-12 text-destructive" />}
                                </div>
                                <h2 className="text-2xl font-bold">{project.status}</h2>
                                <p className="text-black/80 dark:text-white/80 max-w-sm text-center">
                                    {project.status === 'In Review' 
                                        ? "Our team is currently reviewing this submission. Testing data and feedback will appear here once the app is published."
                                        : "This submission was rejected. Please check the rejection reason above for details from our review team."
                                    }
                                </p>
                            </div>
                        )} */}
            {appDetails?.status !== "COMPLETED" ? (
              <div
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 text-center",
                  isUnderReviewOrRejected && "pointer-events-none"
                )}
              >
                <div className="flex flex-row gap-1 items-center justify-center rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-tl from-primary/20 to-primary text-primary-foreground p-5 h-full w-full flex flex-col justify-center gap-1">
                    <p className="text-xs">Testers</p>
                    <p className="text-4xl sm:text-5xl font-bold">
                      {appDetails?.currentTester}
                      <span className="text-2xl text-white/50">
                        /{appDetails?.totalTester}
                      </span>
                    </p>
                  </div>
                  <div className="bg-gradient-to-tr from-primary/20 to-primary text-primary-foreground p-5 h-full w-full flex flex-col justify-center gap-1">
                    <p className="text-xs">Days</p>
                    <p className="text-4xl sm:text-5xl font-bold">
                      {isUnderReviewOrRejected ? 0 : appDetails?.currentDay}
                      <span className="text-2xl text-white/50">
                        /{appDetails?.totalDay}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center justify-center bg-card rounded-2xl p-3">
                  <p className="text-xs sm:text-sm">Feedback</p>
                  <div className="flex flex-row gap-2 items-center justify-center w-full">
                    <div className="bg-gradient-to-bl from-red-500/20 to-red-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full">
                      <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-red-500">
                        <Bug />
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Bugs
                      </p>
                      <p className="text-3xl sm:text-4xl font-bold">
                        {feedbackBreakdown.bugs}
                      </p>
                    </div>
                    <div className="bg-gradient-to-bl from-yellow-500/20 to-yellow-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full">
                      <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-45 text-yellow-500">
                        <Lightbulb />
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Suggestions
                      </p>
                      <p className="text-3xl sm:text-4xl font-bold">
                        {feedbackBreakdown.suggestions}
                      </p>
                    </div>
                    <div className="bg-gradient-to-bl from-green-500/20 to-green-500/10 p-2 sm:p-5 rounded-lg relative overflow-hidden w-full">
                      <div className="p-3 rounded-full absolute opacity-10 scale-[2] -right-2 -top-1 -rotate-90 text-green-500">
                        <PartyPopper />
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Praise
                      </p>
                      <p className="text-3xl sm:text-4xl font-bold">
                        {feedbackBreakdown.praise}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-center jutify-center">
                  <div className="bg-card p-3 pt-4 rounded-2xl flex flex-col justify-center h-full w-full">
                    <p className="text-xs sm:text-sm mb-3">Points Cost</p>
                    <p className="text-2xl sm:text-4xl font-bold bg-secondary rounded-lg h-full w-full flex items-center justify-center">
                      {isUnderReviewOrRejected ? 0 : appDetails?.rewardPoints}
                    </p>
                  </div>
                  <div className="bg-card p-3 pt-4 rounded-2xl flex flex-col justify-center h-full w-full">
                    <p className="text-xs sm:text-sm mb-3">Android Version</p>
                    <p className="text-2xl sm:text-4xl py-2 sm:py-0 font-bold bg-secondary rounded-lg h-full w-full flex items-center justify-center">
                      {isUnderReviewOrRejected
                        ? "N/A"
                        : appDetails?.minimumAndroidVersion}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <TestCompleteSection
                app={appDetails}
                isUnderReviewOrRejected={isUnderReviewOrRejected}
              />
            )}

            {appDetails?.instructionsForTester && (
              <DeveloperInstructions
                title="Instructions for Testers"
                instruction={`"${appDetails?.instructionsForTester}"`}
                mt={8}
              />
            )}

            <div
              className={cn(
                "bg-card/50 rounded-2xl p-2 sm:p-6 sm:pt-4",
                isUnderReviewOrRejected && "pointer-events-none"
              )}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Detailed Feedback Log
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    All feedback submitted by testers for this project.
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {currentFeedback.length > 0 ? (
                <>
                  {viewMode === "list" ? (
                    <div className="space-y-3">
                      {currentFeedback.map((fb) => (
                        <Card
                          key={fb.id}
                          className={`bg-gradient-to-tl ${
                            fb.type === "BUG"
                              ? "from-red-500/20"
                              : fb.type === "SUGGESTION"
                              ? "from-yellow-500/20"
                              : "from-green-500/20"
                          } ${
                            fb.type === "BUG"
                              ? "to-red-500/5"
                              : fb.type === "SUGGESTION"
                              ? "to-yellow-500/5"
                              : "to-green-500/5"
                          } p-0 pt-2 shadow-none border-0 relative overflow-hidden`}
                        >
                          <div className="flex items-start flex-col gap-0 pr-2 pl-5">
                            <div className="absolute scale-[2.5] rotate-45 top-2 left-1 opacity-5 dark:opacity-10">
                              {getFeedbackIcon(fb.type)}
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <p className="font-semibold">{fb.type}</p>
                                {fb?.priority && getSeverityBadge(fb?.priority)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {fb?.message}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground w-full mt-3 bg-black/5 dark:bg-white/10 px-5 h-12">
                            {fb?.media?.length > 0 ? (
                              <div
                                className="cursor-pointer h-10 w-7 relative"
                                onClick={() =>
                                  setFullscreenImage(fb?.media[0].src || "")
                                }
                              >
                                <SafeImage
                                  src={fb?.media[0].src}
                                  alt="Feedback screenshot"
                                  fill
                                  className="absolute rounded border object-cover"
                                />
                              </div>
                            ) : (
                              <div />
                            )}
                            <div className="flex flex-col sm:flex-row gap-0 sm:gap-5 items-end">
                              <div>
                                <span className="font-semibold text-foreground">
                                  {fb?.tester?.name}
                                </span>
                              </div>
                              <span className="text-[10px]">
                                {format(new Date(fb?.createdAt), "dd MMM yyyy")}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                      {currentFeedback.map((fb) => (
                        <Card
                          key={fb.id}
                          className={`bg-gradient-to-bl ${
                            fb.type === "BUG"
                              ? "from-red-500/20"
                              : fb.type === "SUGGESTION"
                              ? "from-yellow-500/20"
                              : "from-green-500/20"
                          } ${
                            fb.type === "BUG"
                              ? "to-red-500/10"
                              : fb.type === "SUGGESTION"
                              ? "to-yellow-500/10"
                              : "to-green-500/10"
                          } shadow-none border-0 h-full flex flex-col relative gap-1 sm:gap-2 overflow-hidden`}
                        >
                          <CardHeader className="p-2 px-3 pb-0 sm:px-4 flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-3 rounded-full absolute opacity-10 scale-[3] -right-1 -top-1 ${
                                  fb.type === "PRAISE"
                                    ? "-rotate-90"
                                    : "-rotate-45"
                                }`}
                              >
                                {getFeedbackIcon(fb.type)}
                              </div>
                              <CardTitle className="text-base">
                                {fb.type}
                              </CardTitle>
                            </div>
                            {fb?.priority && getSeverityBadge(fb?.priority)}
                          </CardHeader>
                          <CardContent className="p-2 px-3 py-0 sm:px-4 flex-grow">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {fb?.message}
                            </p>
                          </CardContent>
                          <CardFooter className="p-2 px-3 sm:px-4 flex items-center justify-between text-xs text-muted-foreground mt-2 h-10 bg-black/5 dark:bg-white/10">
                            {fb?.media?.length > 0 ? (
                              <div
                                className="cursor-pointer h-8 w-6 relative"
                                onClick={() =>
                                  setFullscreenImage(fb?.media[0].src || "")
                                }
                              >
                                <SafeImage
                                  src={fb?.media[0].src}
                                  alt="Feedback screenshot"
                                  fill
                                  className="absolute rounded-sm border object-cover"
                                />
                              </div>
                            ) : (
                              <div />
                            )}
                            <div className="flex flex-col sm:flex-row gap-0 sm:gap-5 items-end">
                              <div>
                                <span className="font-semibold text-foreground text-[10px] sm:text-[12px]">
                                  {fb?.tester?.name}
                                </span>
                              </div>
                              <span className="text-[8px] sm:text-[10px]">
                                {format(new Date(fb?.createdAt), "dd MMM yyyy")}
                              </span>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                  <AppPagination
                    currentPage={feedbackPage}
                    totalPages={totalFeedbackPages}
                    onPageChange={handleFeedbackPageChange}
                  />
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-muted-foreground/20 rounded-3xl bg-muted/50 dark:bg-muted/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 p-12 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                  <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
                    <div className="relative bg-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-border/50 ring-1 ring-black/5 dark:ring-white/5">
                      <ClipboardList className="w-10 h-10 text-primary" />
                    </div>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 4,
                        ease: "easeInOut",
                      }}
                      className="absolute -right-3 -top-3 bg-card rounded-lg p-2 shadow-sm border border-border/50 text-red-500"
                    >
                      <Bug className="w-4 h-4" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 5,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                      className="absolute -left-3 -bottom-3 bg-card rounded-lg p-2 shadow-sm border border-border/50 text-green-500"
                    >
                      <PartyPopper className="w-4 h-4" />
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">
                    Awaiting Feedback
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                    Your app is currently being tested by our community.
                    Detailed feedback, bug reports, and suggestions will appear
                    here soon.
                  </p>

                  <div className="flex items-center gap-3 text-sm font-medium text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-full shadow-sm">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                    </span>
                    Monitoring for submissions...
                  </div>
                </motion.div>
              )}
            </div>
          </div>
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

export default SubmissionDetailsPage;
