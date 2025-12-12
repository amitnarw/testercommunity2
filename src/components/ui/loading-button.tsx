"use client";

import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";

type LoadingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  loadingText?: string;
};

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      className,
      isLoading = false,
      isSuccess = false,
      isError = false,
      loadingText = "Loading...",
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    // Track internal success/error state to auto-reset after 2 seconds
    const [internalState, setInternalState] = React.useState<"idle" | "success" | "error">("idle");

    const state = isSuccess ? "success" : isError ? "error" : isLoading ? "loading" : "idle";
    const showSuccess = state === "success" || internalState === "success";
    const showError = state === "error" || internalState === "error";
    const showLoading = state === "loading";

    // Auto-reset success/error after 2s
    React.useEffect(() => {
      if (isSuccess || isError) {
        const timer = setTimeout(() => {
          setInternalState("idle");
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess, isError]);

    return (
      <button
        ref={ref}
        disabled={showLoading || disabled || showSuccess}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg px-6 py-3 font-medium text-white transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
          showSuccess && "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500",
          showError && "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500",
          !showSuccess && !showError && "bg-primary hover:bg-primary/90 focus-visible:ring-primary",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <AnimatePresence mode="popLayout">
          {showLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{loadingText}</span>
            </motion.div>
          )}

          {showSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              <Check className="h-5 w-5" />
              <span>Success!</span>
            </motion.div>
          )}

          {showError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              <span>Error</span>
            </motion.div>
          )}

          {!showLoading && !showSuccess && !showError && (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";