
"use client";

import { useWindowSize } from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect, useId, useState } from "react";

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: number | string;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 3,
  repeatDelay = 0.5,
  ...props
}: GridPatternProps) {
  const id = useId();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState<[number, number][]>([]);

  useEffect(() => {
    setDimensions({ width: windowWidth, height: windowHeight });
    setSquares(
      Array.from({ length: numSquares }).map(() => [
        Math.floor(Math.random() * (windowWidth / width)),
        Math.floor(Math.random() * (windowHeight / height)),
      ]),
    );
  }, [windowWidth, windowHeight, numSquares, width, height]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = {
    damping: 25,
    stiffness: 200,
    mass: 1,
  };

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(dimensions.width / 2);
    mouseY.set(dimensions.height / 2);
  };

  useEffect(() => {
    mouseX.set(dimensions.width / 2);
    mouseY.set(dimensions.height / 2);
  }, [dimensions]);

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 fill-black/30 stroke-neutral-500/20",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${id})`} />

      <motion.rect
        width={dimensions.width}
        height={dimensions.height}
        fill="url(#gradient)"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          mask: "url(#mask)",
          pointerEvents: "auto",
        }}
      />
      <defs>
        <motion.radialGradient
          id="gradient"
          cx={springX}
          cy={springY}
          r={dimensions.width / 2.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="hsl(var(--primary))" />
          <stop offset={1} stopColor="hsl(var(--primary) / 0)" />
        </motion.radialGradient>

        <mask id="mask">
          <rect width="100%" height="100%" fill="white" />
          {squares.map(([x, y], i) => (
            <motion.rect
              key={i}
              width={width}
              height={height}
              x={x * width}
              y={y * height}
              fill="black"
              initial={{ opacity: 0 }}
              animate={{ opacity: maxOpacity }}
              transition={{
                duration,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * repeatDelay,
              }}
            />
          ))}
        </mask>
      </defs>
    </svg>
  );
}
