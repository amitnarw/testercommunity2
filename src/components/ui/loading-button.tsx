
"use client";

import React, { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Spinner from "./spinner";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, children, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "relative flex items-center justify-center overflow-hidden h-10 text-sm font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          loading ? "w-10 rounded-full" : "w-auto rounded-xl px-4",
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {loading ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute"
            >
              <Spinner className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-2"
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
