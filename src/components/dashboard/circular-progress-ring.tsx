"use client";

import { cn } from "@/lib/utils";

interface CircularProgressRingProps {
  dayValue: number;
  dayMax: number;
  testerValue: number;
  testerMax: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CircularProgressRing({
  dayValue,
  dayMax,
  testerValue,
  testerMax,
  size = 48,
  strokeWidth = 3,
  className,
}: CircularProgressRingProps) {
  const center = size / 2;
  const radius = (size - strokeWidth * 2) / 2;
  const innerRadius = radius * 0.68;
  const circumference = 2 * Math.PI * radius;
  const innerCircumference = 2 * Math.PI * innerRadius;

  const dayProgress = dayMax > 0 ? Math.min(dayValue / dayMax, 1) : 0;
  const testerProgress = testerMax > 0 ? Math.min(testerValue / testerMax, 1) : 0;

  const isBehind = testerProgress < dayProgress * 0.7;
  const isOnTrack = testerProgress >= dayProgress;
  const strokeColor = isBehind ? "#ef4444" : isOnTrack ? "#22c55e" : "#f59e0b";

  const dayOffset = dayProgress > 0 ? circumference - dayProgress * circumference : circumference;
  const testerOffset = testerProgress > 0 ? innerCircumference - testerProgress * innerCircumference : innerCircumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("shrink-0", className)}
      aria-label={`Day progress ${Math.round(dayProgress * 100)}%, tester progress ${Math.round(testerProgress * 100)}%`}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-border"
        opacity={0.25}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dayOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        className="transition-all duration-700 ease-out"
      />
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-border"
        opacity={0.25}
      />
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={innerCircumference}
        strokeDashoffset={testerOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        opacity={0.7}
        className="transition-all duration-700 ease-out delay-100"
      />
    </svg>
  );
}
