"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

export function SubmissionError({
  error,
  onRetry,
}: {
  error: any;
  onRetry: () => void;
}) {
  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full bg-background rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-2 sm:p-12 py-10 flex flex-col items-center text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6 ring-8 ring-red-50 dark:ring-red-900/10"
          >
            <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 dark:text-red-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3"
          >
            Submission Failed
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base text-muted-foreground mb-2 max-w-sm"
          >
            We encountered an issue while submitting your app.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg text-xs sm:text-sm font-medium mb-8 max-w-full break-all"
          >
            {error?.message ||
              "An unexpected error occurred. Please try again."}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={onRetry}
              className="w-full sm:min-w-[200px]"
            >
              Try Again
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
