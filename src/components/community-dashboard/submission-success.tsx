"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function SubmissionSuccess({
  onReturn,
  onSubmitAnother,
}: {
  onReturn: () => void;
  onSubmitAnother: () => void;
}) {
  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full bg-background rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="relative p-4 sm:p-12 flex flex-col items-center text-center">
          {/* Confetti / Decoration Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-10 left-10 w-2 h-2 rounded-full bg-emerald-400"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-20 right-20 w-3 h-3 rounded-full bg-blue-400"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute bottom-20 left-20 w-2 h-2 rounded-full bg-purple-400"
            />
          </div>

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/10"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight text-foreground mb-3"
          >
            Submission Successful!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mb-8 max-w-sm"
          >
            Your app has been successfully submitted to the Community Hub. We
            will review it shortly to ensure it meets our quality standards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 w-full"
          >
            <Button size="lg" className="w-full flex-1 py-3" onClick={onReturn}>
              Back to Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={onSubmitAnother}
            >
              Submit Another
            </Button>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="bg-secondary/30 p-4 text-center border-t border-border">
          <p className="text-xs text-muted-foreground">
            Need help?{" "}
            <a href="#" className="underline hover:text-primary">
              Contact Support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
