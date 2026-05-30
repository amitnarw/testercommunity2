"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  BarChart3,
  FileText,
  FileDown,
  Check,
  RefreshCw,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const steps = [
  { label: "Testing Data", icon: BarChart3 },
  { label: "Answer Compilation", icon: FileText },
  { label: "PDF Build", icon: FileDown },
  { label: "Ready for Review", icon: Check },
];

const skeletonSections = [
  {
    title: "Play Store Summary",
    description: "Test metrics, ratings, bug reports",
    icon: BarChart3,
  },
  {
    title: "Declaration Q&A",
    description: "Formatted production answers",
    icon: FileText,
  },
  {
    title: "PDF Document",
    description: "Download-ready report export",
    icon: FileDown,
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
      delay: 0.15 + i * 0.1,
    },
  }),
};

export function ReportPreparing({ onRefetch }: { onRefetch?: () => void }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-background shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-primary/[0.02]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-30" />

      <div
        className="relative p-5 select-none cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0, 0.25] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full ring-4 ring-primary/15"
            />
            <div className="relative w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-6 h-6 text-primary" />
              </motion.div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold tracking-tight">
              Preparing Your Declaration
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-sm text-muted-foreground">
                Report generation in progress
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-xl"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="relative overflow-hidden"
          >
            <div className="px-5 pb-6 space-y-6">
              {/* Progress Stepper */}
              <div className="flex items-center justify-between px-2">
                {steps.map((step, i) => (
                  <div key={step.label} className="flex items-center gap-0 flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 250,
                          damping: 15,
                          delay: 0.1 + i * 0.12,
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          i < 1
                            ? "bg-primary text-primary-foreground"
                            : i === 1
                              ? "bg-primary/20 text-primary ring-2 ring-primary/30"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i < 1 ? (
                          <Check className="w-4 h-4" />
                        ) : i === 1 ? (
                          <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <step.icon className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <step.icon className="w-4 h-4" />
                        )}
                      </motion.div>
                      <span
                        className={`text-[11px] font-medium whitespace-nowrap ${
                          i <= 1 ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="flex-1 h-px mx-2 mb-5">
                        <div
                          className={`h-full rounded-full ${
                            i < 1 ? "bg-primary/40" : "bg-border"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Instructions Banner */}
              <motion.div
                custom={0}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-5">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-blue-900 dark:text-blue-200">
                        Google Play Production Access
                      </p>
                      <p className="text-sm text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                        Use this declaration report to complete your Google Play Console
                        production access application. The answers and testing metrics are
                        formatted for direct copy-paste into the production declaration
                        form. You can download the PDF version for offline reference.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Skeleton Sections */}
              <div className="space-y-3">
                {skeletonSections.map((section, i) => (
                  <motion.div
                    key={section.title}
                    custom={i}
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30"
                  >
                    <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-[180px]" />
                      <Skeleton className="h-3 w-[140px]" />
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary/60" />
                      </span>
                      <span className="text-[11px] text-muted-foreground/60">
                        Pending
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-2 h-9"
                  disabled={isChecking}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!onRefetch) return;
                    setIsChecking(true);
                    await onRefetch();
                    setIsChecking(false);
                  }}
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Check Status
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
