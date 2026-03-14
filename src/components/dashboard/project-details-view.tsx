"use client";

import { SafeImage } from "@/components/safe-image";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, XCircle, Search, X } from "lucide-react";
import { DeviceOSCoverage } from "@/components/dashboard/device-os-coverage";
import { useState, useEffect } from "react";
import type { Project } from "@/lib/types";
import { motion } from "framer-motion";
import { BackButton } from "@/components/back-button";
import { MediaGallery } from "@/components/media-gallery";
import AppInfoHeader from "@/components/app-info-header";
import DeveloperInstructions from "@/components/developerInstructions";
import { SubmittedFeedback } from "@/components/dashboard/submitted-feedback";
import Confetti from "react-dom-confetti";
import { useInView } from "react-intersection-observer";
import InfoBar from "@/components/dashboard/info-bar";
import { TesterDeviceDetails } from "@/components/dashboard/tester-device-details";
import { TestCompleteSection } from "@/components/dashboard/test-complete-section";
import { RejectedProjectSection } from "@/components/dashboard/rejected-project-section";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "In Testing":
      return {
        badgeVariant: "destructive" as const,
        icon: <Clock className="w-5 h-5" />,
        color: "text-destructive",
      };
    case "Completed":
      return {
        badgeVariant: "secondary" as const,
        icon: <CheckCircle className="w-5 h-5" />,
        color: "text-green-500",
      };
    case "Rejected":
      return {
        badgeVariant: "destructive" as const,
        icon: <XCircle className="w-5 h-5" />,
        color: "text-destructive",
      };
    case "In Review":
      return {
        badgeVariant: "secondary" as const,
        icon: <Search className="w-5 h-5" />,
        color: "text-muted-foreground",
      };
    case "Approved":
      return {
        badgeVariant: "default" as const,
        icon: <Clock className="w-5 h-5" />,
        color: "text-primary",
      };
    default:
      return {
        badgeVariant: "secondary" as const,
        icon: <Clock className="w-5 h-5" />,
        color: "text-muted-foreground",
      };
  }
};

export default function ProjectDetailsView({
  project,
  showBackButton = true,
}: {
  project: Project;
  showBackButton?: boolean;
}) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [isConfettiActive, setConfettiActive] = useState(false);

  const { ref: confettiTriggerRef, inView: confettiInView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (confettiInView && project?.status === "Completed") {
      setTimeout(() => setConfettiActive(true), 300);
    }
  }, [confettiInView, project?.status]);

  const statusConfig = getStatusConfig(project.status);
  const isUnderReviewOrRejected =
    project.status === "In Review" ||
    project.status === "Rejected" ||
    project.status === "Draft";

  const screenshots = project.feedback
    .map((fb) => fb.screenshot)
    .filter(Boolean) as string[];
  const videos = project.feedback
    .map((fb) => fb.videoUrl)
    .filter(Boolean) as string[];

  const osData = project.osCoverage.map((os) => ({
    name: os.version,
    value: os.testers,
  }));
  const deviceData = project.deviceCoverage.map((d) => ({
    name: d.device,
    value: d.testers,
  }));

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const feedbackBreakdown = {
    bugs: isUnderReviewOrRejected
      ? 0
      : project.feedback.filter((fb) => fb.type === "Bug").length,
    suggestions: isUnderReviewOrRejected
      ? 0
      : project.feedback.filter((fb) => fb.type === "Suggestion").length,
    praise: isUnderReviewOrRejected
      ? 0
      : project.feedback.filter((fb) => fb.type === "Praise").length,
  };

  return (
    <div className="min-h-screen relative">
      <div
        ref={confettiTriggerRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
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

      <div className="container px-4 md:px-6">
        {showBackButton && (
          <div className="sticky top-0 z-[50] pt-2 pb-4 pl-0 xl:pl-8 w-1/2">
            <BackButton href="/dashboard" />
          </div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={pageVariants}
          className="max-w-7xl mx-auto"
        >
          <AppInfoHeader
            logo={project.icon}
            name={project.name}
            dataAiHint={project.dataAiHint}
            category={project.category}
            description={project.description}
            status={project.status}
            statusConfig={statusConfig}
          />

          {project.status === "Rejected" && project.rejectionReason && (
            <RejectedProjectSection
              project={project}
              setFullscreenImage={setFullscreenImage}
              itemVariants={itemVariants}
            />
          )}

          <div
            className={`relative z-10 ${
              isUnderReviewOrRejected ? "blur-md pointer-events-none" : ""
            }`}
          >
            {project?.status !== "Completed" ? (
              <InfoBar
                project={project}
                isUnderReviewOrRejected={isUnderReviewOrRejected}
                feedbackBreakdown={feedbackBreakdown}
              />
            ) : (
              <TestCompleteSection
                app={project}
                isUnderReviewOrRejected={isUnderReviewOrRejected}
              />
            )}

            <div className="w-full mx-auto mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 space-y-8"
              >
                <DeveloperInstructions
                  title="Instructions for Testers"
                  instruction={project?.testingInstructions}
                  mt={1}
                />
                <SubmittedFeedback
                  feedbacks={project.feedback.map((fb) => ({
                    id: fb.id,
                    type: fb.type as "Bug" | "Suggestion" | "Praise",
                    comment: fb.comment,
                    screenshot: fb.screenshot || null,
                    tester: fb.tester,
                    severity: fb.severity as any,
                    videoUrl: fb.videoUrl || null,
                  }))}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="lg:col-span-1 space-y-8"
              >
                <DeviceOSCoverage osData={osData} deviceData={deviceData} />

                <MediaGallery screenshots={screenshots} videos={videos} />
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <TesterDeviceDetails testers={project.testers} />
            </motion.div>
          </div>
        </motion.div>
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
    </div>
  );
}
