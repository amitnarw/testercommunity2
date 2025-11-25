
"use client";

import React, { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Spinner from "./spinner";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, children, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden h-10 px-4 py-2 text-sm font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "rounded-xl",
          className
        )}
        initial={false}
        animate={
          loading
            ? {
                width: "40px", // h-10 is 40px
                borderRadius: "9999px",
              }
            : {
                width: "auto",
                borderRadius: "0.75rem", // Corresponds to rounded-xl
              }
        }
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        disabled={loading || props.disabled}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {loading ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.15 } }}
              exit={{ opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.15 } }}
              className="absolute"
            >
              <Spinner className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
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
