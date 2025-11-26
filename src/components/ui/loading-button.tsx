
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
  duration?: number;
  children: React.ReactNode;
}

const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(
  (
    { loading = false, success = false, duration = 700, children, className, ...props },
    ref
  ) => {
    const [initialWidth, setInitialWidth] = useState<number | 'auto'>('auto');
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (buttonRef.current && initialWidth === 'auto') {
            setInitialWidth(buttonRef.current.offsetWidth);
        }
    }, [initialWidth]);

    const isShowingContent = !loading && !success;

    const buttonVariants = {
      idle: {
        width: initialWidth === 'auto' ? 'auto' : initialWidth,
        borderRadius: "0.75rem",
        paddingLeft: '1rem',
        paddingRight: '1rem',
      },
      loading: {
        width: "40px",
        borderRadius: "9999px",
        paddingLeft: '0px',
        paddingRight: '0px',
      },
      success: {
        width: "40px",
        borderRadius: "9999px",
        backgroundColor: "rgb(22 163 74)", // green-500
        paddingLeft: '0px',
        paddingRight: '0px',
      },
    };
    
    const contentVariants = {
      initial: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeInOut" } },
      animate: { opacity: 1, y: 0, transition: { delay: 0.2, ease: "easeInOut" } },
      exit: { opacity: 0, y: 10, transition: { duration: 0.2, ease: "easeInOut" } },
    };
    
    const iconVariants = {
      initial: { opacity: 0, y: -10, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1, transition: { delay: duration / 1000 * 0.5, ease: "easeInOut" } },
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
          duration: duration / 1000,
          ease: "easeInOut",
        }}
        className={cn(
          "relative flex items-center justify-center overflow-hidden h-10 text-sm font-medium transition-colors disabled:pointer-events-none",
          "bg-primary text-primary-foreground hover:bg-primary/90",
           className
        )}
        disabled={loading || success || props.disabled}
        {...props} // Pass the rest of the props here
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
              variants={iconVariants}
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
              variants={iconVariants}
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
