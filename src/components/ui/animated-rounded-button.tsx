
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
  backgroundColor = "hsl(var(--primary))", // Default to primary theme color
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
      <div className={cn("relative z-10 transition-colors duration-300",
       className?.includes('bg-primary') 
        ? 'text-primary-foreground group-hover:text-foreground dark:group-hover:text-background' 
        : 'text-foreground group-hover:text-primary-foreground'
      )}>
        {children}
      </div>
      <div
        ref={circle}
        style={{ backgroundColor }}
        className="absolute top-full h-[150%] w-full rounded-[300%]"
      ></div>
    </div>
  );
}
