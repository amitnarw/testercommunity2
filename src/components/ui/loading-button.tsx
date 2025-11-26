
"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useAnimate,
} from "framer-motion";

type MotionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  success?: boolean;
  children: React.ReactNode;
  className?: string;
};

export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  MotionButtonProps
>(({ className, children, ...props }, ref) => {
  const [scope, animate] = useAnimate();
  const [buttonWidth, setButtonWidth] = useState<number | "auto">("auto");
  const [padding, setPadding] = useState<{ pl: string, pr: string}>({ pl: "1rem", pr: "1rem"});
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      const computedStyle = window.getComputedStyle(buttonRef.current);
      setButtonWidth(buttonRef.current.offsetWidth);
      setPadding({
        pl: computedStyle.paddingLeft,
        pr: computedStyle.paddingRight
      });
    }
  }, [children]);

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // 1. Animate text out
    await animate(".text", { opacity: 0, y: 10 }, { duration: 0.2 });

    // 2. Animate button collapse after text is gone
    await animate(
      scope.current,
      { width: 40, height: 40, paddingLeft: "0px", paddingRight: "0px" },
      { duration: 0.7, ease: "easeInOut" }
    );

    // 3. Show loader
    animate(
      ".loader",
      { opacity: 1, scale: 1, y: 0 },
      { duration: 0.2, delay: 0.1 }
    );

    // Call original onClick if it exists, simulating the async operation
    if (props.onClick) {
      await (props.onClick as (
        e: React.MouseEvent<HTMLButtonElement>
      ) => Promise<void> | void)(event);
    }

    // 4. Animate loader out and check in
    await animate(
      ".loader",
      { opacity: 0, scale: 0 },
      { duration: 0.2, at: "+0.5" }
    );
    await animate(
      ".check",
      { opacity: 1, scale: 1 },
      { duration: 0.2 }
    );

    // 5. Restore button to its original state
    await animate(
      scope.current,
      { width: buttonWidth, height: "auto", paddingLeft: padding.pl, paddingRight: padding.pr },
      { duration: 0.7, ease: "easeInOut", at: "+0.5" }
    );
    animate(".text", { opacity: 1, y: 0 }, { duration: 0.2 });
    animate(".check", { opacity: 0, scale: 0 }); // Hide check for next click
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        "relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-4 py-2 font-medium text-white ring-offset-2 transition duration-200 hover:ring-2 hover:ring-primary dark:ring-offset-black",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
      onClick={handleClick}
    >
      <div ref={scope} className="relative flex items-center justify-center">
        <motion.span
          className="text"
          initial={{ opacity: 1, y: 0 }}
        >
          {children}
        </motion.span>
        <motion.div
          className="loader absolute"
          initial={{ opacity: 0, scale: 0, y: -10 }}
        >
          <Loader />
        </motion.div>
        <motion.div
          className="check absolute"
          initial={{ opacity: 0, scale: 0 }}
        >
          <CheckIcon />
        </motion.div>
      </div>
    </motion.button>
  );
});
LoadingButton.displayName = "LoadingButton";


const Loader = () => {
  return (
    <motion.svg
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </motion.svg>
  );
};

const CheckIcon = () => {
  return (
    <motion.svg
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
    >
      <path d="M20 6 9 17l-5-5" />
    </motion.svg>
  );
};

