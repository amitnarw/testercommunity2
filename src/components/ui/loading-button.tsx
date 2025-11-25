
"use client";

import React, { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Spinner from "./spinner";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  duration?: number;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, children, className, duration = 300, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden h-10 text-sm font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          className
        )}
        animate={loading ? "loading" : "idle"}
        variants={{
          idle: {
            borderRadius: "0.75rem", // "rounded-xl"
            width: "auto"
          },
          loading: {
            borderRadius: "9999px", // "rounded-full"
            width: "2.5rem", // "w-10"
          },
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        disabled={loading || props.disabled}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {loading ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.15 } }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
              className="absolute"
            >
              <Spinner className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.span
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="flex items-center justify-center gap-2 px-4"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
