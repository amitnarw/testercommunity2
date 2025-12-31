"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { motion, useAnimate } from "framer-motion";
import { CircleX } from "lucide-react";

type MotionButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onDrag"
  | "onDragEnd"
  | "onDragStart"
  | "onAnimationStart"
  | "onAnimationComplete"
  | "onUpdate"
  | "onFocus"
  | "onBlur"
> & {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  reset?: () => void;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<any> | void;
};

export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  MotionButtonProps
>(
  (
    {
      className,
      children,
      isLoading,
      isSuccess,
      isError,
      reset,
      onClick,
      ...props
    },
    ref
  ) => {
    const [scope, animate] = useAnimate();
    const [checkError, setCheckError] = useState(true);

    const runAnimation = async () => {
      const loader = scope.current?.querySelector(".loader");
      const check = scope.current?.querySelector(".check");
      const text = scope.current?.querySelector(".text");
      const error = scope.current?.querySelector(".error");

      if (!loader || !check || !text || !error) return;

      // 1. Animate text out
      await animate(text, { opacity: 0, y: 10 }, { duration: 0.2 });

      if (!scope.current) return;

      animate(check, { opacity: 0, scale: 0 });
      animate(error, { opacity: 0, scale: 0 });

      // 2. Animate button collapse after text is gone
      await animate(
        scope.current,
        { width: 10, height: 25, paddingLeft: "0px", paddingRight: "0px" },
        { duration: 0.7, ease: "easeInOut" }
      );

      // 3. Show loader
      animate(loader, { opacity: 1, scale: 1, y: 0 }, { duration: 0.2 });
    };

    const runSuccessAnimation = async () => {
      const loader = await scope.current?.querySelector(".loader");
      const check = await scope.current?.querySelector(".check");

      if (!loader || !check) return;

      // 4. Animate loader out and check in using a sequence
      await animate([
        [loader, { opacity: 0, scale: 0 }, { duration: 0.2 }],
        [check, { opacity: 1, scale: 1 }, { duration: 0.2 }],
      ]);

      if (!scope.current) return;

      // 5. Restore button to its original state
      await animate(
        scope.current,
        { width: "auto", height: "auto" },
        { duration: 0.7, ease: "easeInOut" }
      );
      animate(loader, { opacity: 0 });
      // animate(".text", { opacity: 1, y: 0 }, { duration: 0.2 });
      // animate(".check", { opacity: 0, scale: 0 });
    };

    const runErrorAnimation = async () => {
      const loader = scope.current?.querySelector(".loader");
      const text = scope.current?.querySelector(".text");
      const error = scope.current?.querySelector(".error");

      if (!loader || !text || !error) return;

      // 4. Animate loader out and check in using a sequence
      await animate([
        [loader, { opacity: 0, scale: 0 }, { duration: 0.2 }],
        [error, { opacity: 1, scale: 1 }, { duration: 0.2 }],
      ]);

      // 5. Restore button to its original state
      await animate(
        scope.current,
        { width: "auto", height: "auto" },
        { duration: 0.7, ease: "easeInOut" }
      );
      animate(loader, { opacity: 0, scale: 0 }, { duration: 0.2 });
      animate(text, { opacity: 1, y: 0 }, { duration: 0.2 });
      animate(error, { opacity: 0, scale: 0 }, { duration: 0.2 });
    };

    const runReset = async () => {
      const loader = scope.current?.querySelector(".loader");
      const check = scope.current?.querySelector(".check");
      const error = scope.current?.querySelector(".error");
      const text = scope.current?.querySelector(".text");

      if (!loader || !check || !error || !text) return;

      // 4. Animate loader out and check in using a sequence
      await animate([
        [loader, { opacity: 0, scale: 0 }, { duration: 0.2 }],
        [check, { opacity: 0, scale: 0 }, { duration: 0.2 }],
        [error, { opacity: 0, scale: 0 }, { duration: 0.2 }],
        [text, { opacity: 1, y: 0 }, { duration: 0.2 }],
      ]);
    };

    useEffect(() => {
      if (reset) {
        reset();
        runReset();
      }
    }, [reset]);

    useEffect(() => {
      setCheckError(true);
      if (isLoading && !isSuccess && !isError) {
        runAnimation();
      }
      if (!isLoading && isSuccess && !isError) {
        runSuccessAnimation();
      }
      if (!isLoading && !isSuccess && isError) {
        runErrorAnimation();
        setTimeout(() => {
          setCheckError(false);
        }, 1000);
      }
    }, [isLoading, isSuccess, isError]);

    return (
      <motion.button
        type="button"
        className={cn(
          `relative flex items-center justify-center gap-2 overflow-hidden rounded-full ${
            isSuccess
              ? "bg-green-500 hover:ring-green-500"
              : isError && checkError
              ? "bg-red-500 hover:ring-red-500"
              : "bg-primary hover:ring-primary"
          } px-4 py-2 font-medium text-white ring-offset-2 transition duration-2000 hover:ring-2 dark:ring-offset-black`,
          "disabled:cursor-not-allowed",
          className
        )}
        {...props}
        disabled={isSuccess}
        onClick={onClick}
      >
        <div ref={scope} className="relative flex items-center justify-center">
          <motion.span className="text" initial={{ opacity: 1, y: 0 }}>
            {children}
          </motion.span>
          <motion.div
            className="loader absolute"
            initial={{ opacity: 0, scale: 0 }}
          >
            <Loader />
          </motion.div>
          <motion.div
            className="check absolute"
            initial={{ opacity: 0, scale: 0 }}
          >
            <CheckIcon />
          </motion.div>
          <motion.div
            className="error absolute"
            initial={{ opacity: 0, scale: 0 }}
          >
            <ErrorIcon />
          </motion.div>
        </div>
      </motion.button>
    );
  }
);
LoadingButton.displayName = "LoadingButton";

const Loader = () => {
  return (
    <motion.svg
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
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

const ErrorIcon = () => {
  return <CircleX className="error" />;
};
