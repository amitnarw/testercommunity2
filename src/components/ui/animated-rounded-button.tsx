
'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

interface AnimatedRoundedButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  backgroundColor?: string;
  animatedBackgroundColor?: string;
  normalTextColor?: string;
  hoverTextColor?: string;
  borderRadius?: string;
  paddingYmobile?: string;
  paddingXmobile?: string;
  paddingY?: string;
  paddingX?: string;
}

export default function AnimatedRoundedButton({
  children,
  backgroundColor = "",
  animatedBackgroundColor = "hsl(var(--primary))",
  normalTextColor = "hsl(var(--primary-foreground))",
  hoverTextColor = "hsl(var(--foreground))",
  borderRadius = "9999px",
  paddingYmobile="2",
  paddingXmobile="4",
  paddingY="2",
  paddingX="5",
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
  
  const textColor = isHovered ? hoverTextColor : normalTextColor;

  return (
    <div
      className={cn(
        `group relative flex cursor-pointer items-center justify-center overflow-hidden px-${paddingX} py-${paddingY}`,
        className
      )}
      style={{ borderRadius, backgroundColor }}
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
        style={{ backgroundColor: animatedBackgroundColor }}
        className="absolute top-full h-[150%] w-full rounded-[300%]"
      ></div>
    </div>
  );
}
