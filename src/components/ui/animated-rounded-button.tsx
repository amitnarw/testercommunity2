
'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

interface AnimatedRoundedButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  backgroundColor?: string;
  fromTextColor?: string;
  toTextColor?: string;
  borderRadius?: string;
}

export default function AnimatedRoundedButton({
  children,
  backgroundColor = "hsl(var(--primary))",
  fromTextColor = "hsl(var(--primary-foreground))",
  toTextColor = "hsl(var(--foreground))",
  borderRadius = "9999px",
  className,
  ...attributes
}: AnimatedRoundedButtonProps) {
  const circle = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { contextSafe } = useGSAP(() => {
    timeline.current = gsap.timeline({ paused: true });
    if (timeline.current && circle.current) {
        timeline.current
          .to(circle.current, { top: "-25%", width: "150%", duration: 0.4, ease: "power3.in" }, "enter")
          .to(circle.current, { top: "-150%", width: "125%", duration: 0.25 }, "exit");
    }
  }, [circle]);

  const manageMouseEnter = contextSafe(() => {
    setIsHovered(true);
    timeline.current?.tweenFromTo('enter', 'exit');
  });

  const manageMouseLeave = contextSafe(() => {
    setIsHovered(false);
    setTimeout(() => {
      timeline.current?.play();
    }, 300);
  });
  
  const textColor = isHovered ? toTextColor : fromTextColor;

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-center justify-center overflow-hidden border border-border px-[60px] py-[15px]",
        className
      )}
      style={{ borderRadius }}
      onMouseEnter={manageMouseEnter}
      onMouseLeave={manageMouseLeave}
      {...attributes}
    >
      <div 
        className="relative z-10 transition-colors duration-300"
        style={{ color: textColor }}
      >
        {children}
      </div>
      <div
        ref={circle}
        style={{ backgroundColor }}
        className="absolute top-full h-[150%] w-full"
        // The high border radius on the inner circle helps create the illusion of it being a perfect circle expanding
        // even though its width and height are not equal.
        // It's a common trick for these types of effects.
        // We'll keep it as a very high value to ensure it works correctly.
        // We will not pass borderRadius prop to this div
      ></div>
    </div>
  );
}
