
'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

interface AnimatedRoundedButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  backgroundColor?: string;
}

export default function AnimatedRoundedButton({
  children,
  backgroundColor = "#9400D3", // Default to primary theme color
  className,
  ...attributes
}: AnimatedRoundedButtonProps) {
  const circle = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const { contextSafe } = useGSAP(() => {
    timeline.current = gsap.timeline({ paused: true });
    if (timeline.current && circle.current) {
        timeline.current
          .to(circle.current, { top: "-25%", width: "150%", duration: 0.4, ease: "power3.in" }, "enter")
          .to(circle.current, { top: "-150%", width: "125%", duration: 0.25 }, "exit");
    }
  }, [circle]);

  const manageMouseEnter = contextSafe(() => {
    timeline.current?.tweenFromTo('enter', 'exit');
  });

  const manageMouseLeave = contextSafe(() => {
    setTimeout(() => {
      timeline.current?.play();
    }, 300);
  });

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border px-[60px] py-[15px]",
        className
      )}
      onMouseEnter={manageMouseEnter}
      onMouseLeave={manageMouseLeave}
      {...attributes}
    >
      <div className="relative z-10 text-foreground transition-colors duration-300 group-hover:text-white">
        {children}
      </div>
      <div
        ref={circle}
        style={{ backgroundColor }}
        className="absolute top-full h-[150%] w-full rounded-full"
      ></div>
    </div>
  );
}
