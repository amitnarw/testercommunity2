
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Spinner from "./spinner";
import { Check } from "lucide-react";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  success?: boolean;
  children: React.ReactNode;
}

const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(
  (
    { loading = false, success = false, children, className, ...props },
    ref
  ) => {
    const isShowingContent = !loading && !success;

    const buttonVariants = {
      idle: {
        width: "auto",
        borderRadius: "0.75rem", // Corresponds to rounded-xl
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      },
      loading: {
        width: "2.5rem", // h-10
        borderRadius: "9999px",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      },
      success: {
        width: "2.5rem", // h-10
        borderRadius: "9999px",
        backgroundColor: "rgb(34 197 94 / var(--tw-bg-opacity))", // bg-green-500
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      },
    };
    
    const contentVariants = {
      initial: {
        opacity: 0,
        y: -10,
      },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.15,
        }
      },
      exit: {
        opacity: 0,
        y: 10,
        transition: {
          duration: 0.15
        }
      },
    };

    return (
      <motion.button
        ref={ref}
        variants={buttonVariants}
        animate={success ? "success" : loading ? "loading" : "idle"}
        className={cn(
          "relative flex items-center justify-center overflow-hidden h-10 text-sm font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          className
        )}
        disabled={loading || success || props.disabled}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isShowingContent && (
            <motion.div
              key="content"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={contentVariants}
              className="flex items-center gap-2"
            >
              {children}
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="spinner"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={contentVariants}
              className="absolute"
            >
              <Spinner className="h-5 w-5" />
            </motion.div>
          )}

          {success && (
             <motion.div
              key="success"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={contentVariants}
              className="absolute"
            >
              <Check className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
