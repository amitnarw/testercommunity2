
"use client";

import React, { useRef, useState, useEffect } from "react";
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
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [initialWidth, setInitialWidth] = useState<number | 'auto'>('auto');

    useEffect(() => {
      if (buttonRef.current && initialWidth === 'auto') {
        setInitialWidth(buttonRef.current.offsetWidth);
      }
    }, [initialWidth]);

    const buttonVariants = {
      idle: {
        width: initialWidth,
        borderRadius: "0.75rem",
      },
      loading: {
        width: "40px",
        borderRadius: "9999px",
      },
      success: {
        width: "40px",
        borderRadius: "9999px",
        backgroundColor: "rgb(34 197 94 / 1)",
      },
    };
    
    const contentVariants = {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0, transition: { delay: 0.2, ease: "easeInOut" } },
      exit: { opacity: 0, y: 10, transition: { duration: 0.2, ease: "easeInOut" } },
    };
    
    const spinnerVariants = {
      initial: { opacity: 0, y: -10, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.3, ease: "easeInOut" } },
      exit: { opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.2, ease: "easeInOut" } },
    };

    return (
      <motion.button
        ref={buttonRef}
        variants={buttonVariants}
        initial="idle"
        animate={success ? "success" : loading ? "loading" : "idle"}
        transition={{
          type: "tween",
          duration: 0.7,
          ease: "easeInOut",
        }}
        className={cn(
          "relative flex items-center justify-center overflow-hidden h-10 px-6 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
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
              variants={spinnerVariants}
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
              variants={spinnerVariants}
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
