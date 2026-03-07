"use client";

import { motion } from "framer-motion";
import { CheckCircle, Bug, Lightbulb, PartyPopper } from "lucide-react";
import { useInView } from "react-intersection-observer";
import type { Project } from "@/lib/types";

export function TestCompleteSection({
  app,
  isUnderReviewOrRejected,
}: {
  app: Project;
  isUnderReviewOrRejected: boolean;
}) {
  const { ref, inView } = useInView({
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

  // Calculate feedback breakdown from actual feedback data
  const feedbackBreakdown = {
    bugs: app.feedback.filter((fb: any) => fb.type === "Bug").length,
    suggestions: app.feedback.filter((fb: any) => fb.type === "Suggestion")
      .length,
    praise: app.feedback.filter((fb: any) => fb.type === "Praise").length,
    totalTesters: app.testersStarted,
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
          <div className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground p-5 rounded-lg">
            <p className="text-xs hidden sm:block">Average Rating</p>
            <p className="text-xs block sm:hidden">Avg. Rating</p>
            <p className="text-4xl font-bold">
              {app?.overallRating?.toFixed(1)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
