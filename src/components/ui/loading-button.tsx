
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
        layout
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden h-10 text-sm font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          loading ? "rounded-full w-10 px-0" : "rounded-xl px-4 py-2",
          className
        )}
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
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: duration / 2000 } }}
              exit={{ opacity: 0, y: 10, scale: 0.9, transition: { duration: duration / 2000 } }}
              className="absolute"
            >
              <Spinner className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: duration / 2000 } }}
              className="flex items-center justify-center gap-2"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
