"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

type FeedbackStatus = "success" | "error" | "warning" | "info" | "loading";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: FeedbackStatus;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  dismissLabel?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconRing: "ring-emerald-500/20",
    gradientFrom: "from-emerald-500/10",
    gradientVia: "via-emerald-500/5",
    gradientTo: "to-emerald-500/5",
    titleColor: "text-emerald-600 dark:text-emerald-400",
    primaryBg: "bg-emerald-600 hover:bg-emerald-700",
    primaryShadow: "shadow-emerald-500/25",
    particleColor: "bg-emerald-400",
  },
  error: {
    icon: XCircle,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
    iconRing: "ring-red-500/20",
    gradientFrom: "from-red-500/10",
    gradientVia: "via-red-500/5",
    gradientTo: "to-red-500/5",
    titleColor: "text-red-600 dark:text-red-400",
    primaryBg: "bg-red-600 hover:bg-red-700",
    primaryShadow: "shadow-red-500/25",
    particleColor: "bg-red-400",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconRing: "ring-amber-500/20",
    gradientFrom: "from-amber-500/10",
    gradientVia: "via-amber-500/5",
    gradientTo: "to-amber-500/5",
    titleColor: "text-amber-600 dark:text-amber-400",
    primaryBg: "bg-amber-600 hover:bg-amber-700",
    primaryShadow: "shadow-amber-500/25",
    particleColor: "bg-amber-400",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconRing: "ring-blue-500/20",
    gradientFrom: "from-blue-500/10",
    gradientVia: "via-blue-500/5",
    gradientTo: "to-blue-500/5",
    titleColor: "text-blue-600 dark:text-blue-400",
    primaryBg: "bg-blue-600 hover:bg-blue-700",
    primaryShadow: "shadow-blue-500/25",
    particleColor: "bg-blue-400",
  },
  loading: {
    icon: Loader2,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    iconRing: "ring-primary/20",
    gradientFrom: "from-primary/10",
    gradientVia: "via-primary/5",
    gradientTo: "to-primary/5",
    titleColor: "text-foreground",
    primaryBg: "bg-primary hover:bg-primary/90",
    primaryShadow: "shadow-primary/25",
    particleColor: "bg-primary",
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -15 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 250, damping: 15, delay: 0.1 },
  },
};

const contentVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20, delay: 0.15 + i * 0.08 },
  }),
};

const particleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.3 + i * 0.1, duration: 0.3 },
  }),
};

export function FeedbackModal({
  open,
  onOpenChange,
  status,
  title,
  description,
  primaryAction,
  secondaryAction,
  dismissLabel = "Close",
}: FeedbackModalProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isSuccess = status === "success";
  const isLoading = status === "loading";

  const handlePrimaryAction = () => {
    if (primaryAction?.onClick) {
      primaryAction.onClick();
    }
    onOpenChange(false);
  };

  const handleSecondaryAction = () => {
    if (secondaryAction?.onClick) {
      secondaryAction.onClick();
    }
    onOpenChange(false);
  };

  const handleDismiss = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] w-[calc(100vw-40px)] p-0 overflow-hidden border-none shadow-2xl">
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-background rounded-3xl overflow-hidden w-full"
            >
              {/* Dynamic gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${config.gradientFrom} ${config.gradientVia} ${config.gradientTo} opacity-60`}
              />

              {/* Decorative blobs */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${config.gradientFrom} to-transparent rounded-full blur-3xl opacity-40`}
                />
              </div>

              {/* Floating particles for success */}
              {isSuccess && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={particleVariants}
                      initial="hidden"
                      animate="visible"
                      className={`absolute w-2 h-2 rounded-full ${config.particleColor}`}
                      style={{
                        left: `${20 + (i * 10) % 60}%`,
                        top: `${15 + (i * 15) % 70}%`,
                        opacity: 0.6,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="relative p-8 flex flex-col items-center text-center">

                {/* Icon with animated ring */}
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative mb-6"
                >
                  {/* Pulsing ring for non-loading states */}
                  {status !== "loading" && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`absolute inset-0 rounded-full ${config.iconBg} ${config.iconRing} ring-4`}
                    />
                  )}

                  <div
                    className={`relative w-20 h-20 rounded-full ${config.iconBg} flex items-center justify-center ${config.iconRing} ring-4`}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Icon className="w-10 h-10" />
                      </motion.div>
                    ) : (
                      <Icon className={`w-10 h-10 ${config.iconColor}`} />
                    )}
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  custom={0}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className={`text-2xl font-bold tracking-tight mb-3 ${config.titleColor}`}
                >
                  {title}
                </motion.h2>

                {/* Description */}
                {description && (
                  <motion.p
                    custom={1}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-[280px]"
                  >
                    {description}
                  </motion.p>
                )}

                {/* Action buttons */}
                <motion.div
                  custom={2}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full flex flex-col gap-3"
                >
                  {primaryAction && (
                    <Button
                      size="lg"
                      className={`w-full py-3 ${config.primaryBg} text-white font-semibold rounded-xl shadow-lg ${config.primaryShadow} transition-all duration-300 hover:shadow-xl`}
                      onClick={handlePrimaryAction}
                    >
                      {primaryAction.label}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                  {secondaryAction && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full py-3 rounded-xl border-border/60 hover:bg-secondary/50 transition-all duration-300"
                      onClick={handleSecondaryAction}
                    >
                      {secondaryAction.label}
                    </Button>
                  )}

                  {!primaryAction && !secondaryAction && (
                    <Button
                      size="lg"
                      className={`w-full py-3 ${config.primaryBg} text-white font-semibold rounded-xl shadow-lg ${config.primaryShadow} transition-all duration-300`}
                      onClick={handleDismiss}
                    >
                      {dismissLabel}
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}