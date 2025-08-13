
"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({
  className,
}: {
  className?: string;
}) => {
  const Svg = ({ path, className }: { path: string; className?: string }) => {
    return (
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor" 
        className={className}
        initial={{
          pathLength: 0,
        }}
        animate={{
          pathLength: 1,
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        <path d={path} />
      </motion.svg>
    );
  };
  const paths = [
    "M100 200 L1100 200",
    "M100 400 L1100 400",
    "M100 600 L1100 600",
    "M200 100 L200 900",
    "M400 100 L400 900",
    "M600 100 L600 900",
    "M800 100 L800 900",
    "M1000 100 L1000 900",
    "M100 200 C 400 200, 400 500, 700 500 S 1000 800, 1100 800",
    "M100 800 C 400 800, 400 500, 700 500 S 1000 200, 1100 200",
  ];
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full -z-10",
        "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
        className
      )}
    >
      <div className="absolute inset-0 z-20 bg-dot-pattern" />
      {paths.map((path, i) => {
        const SvgComponent = (
          <Svg
            key={i}
            path={path}
            className={cn(
              "absolute h-full w-full",
              "text-border",
              "blur-[1px]",
              "[mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]"
            )}
          />
        );
        const GlowComponent = (
          <Svg
            key={`glow-${i}`}
            path={path}
            className={cn(
              "absolute h-full w-full",
              "text-primary",
              "blur-md"
            )}
          />
        );
        return (
          <React.Fragment key={`beams-${i}`}>
            {SvgComponent}
            {GlowComponent}
          </React.Fragment>
        );
      })}
    </div>
  );
};
