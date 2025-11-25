
"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [meteorStyles, setMeteorStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const styles = [...new Array(number || 30)].map(() => {
      const size = Math.random() * 0.4 + 0.3; // Random size between 0.3rem and 0.7rem
      const tailLength = Math.floor(Math.random() * 150 + 50);
      return {
        top: -5,
        left: `${Math.floor(Math.random() * 140) - 40}%`, // Start off-screen more
        width: `${size}px`,
        height: `${size}px`,
        '--tail-width': `${tailLength}px`,
        animationDelay: `${Math.random() * 1 + 0.2}s`,
        animationDuration: `${Math.floor(Math.random() * 8 + 2)}s`,
      };
    });
    setMeteorStyles(styles);
  }, [number]);

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {[...meteorStyles].map((style, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute rounded-[9999px] bg-white shadow-[0_0_15px_2px_rgba(255,255,255,0.2)]",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[var(--tail-width)] before:-translate-y-1/2 before:transform before:bg-gradient-to-r before:from-white/80 before:to-transparent"
          )}
          style={style}
        ></span>
      ))}
    </div>
  );
};

export default Meteors;
