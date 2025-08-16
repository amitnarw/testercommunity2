
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverBorderGradientProps = {
  children?: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
  [key: string]: any;
};

export function HoverBorderGradient({
  children,
  as: Component = "button",
  containerClassName,
  className,
  duration = 1,
  clockwise = true,
  ...props
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<"top" | "left" | "bottom" | "right">("top");
  const rotateDirection = clockwise ? 1 : -1;

  const gradientVariants = {
    initial: {
      background: `conic-gradient(from 0deg at 50% 50%, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--primary)) 100%)`,
    },
    hovered: {
      background: `conic-gradient(from 180deg at 50% 50%, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--primary)) 100%)`,
    },
  };

  return (
    <Component
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex h-min w-fit items-center justify-center rounded-full border border-transparent p-px transition-all duration-300",
        containerClassName
      )}
      {...props}
    >
      <motion.div
        className={cn(
          "absolute inset-0 z-0 rounded-full"
        )}
        style={{
          filter: "blur(2px)",
        }}
        initial="initial"
        animate={hovered ? "hovered" : "initial"}
        variants={gradientVariants}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <div className={cn("relative z-10 w-full rounded-full", className)}>
        {children}
      </div>
    </Component>
  );
}
