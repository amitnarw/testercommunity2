"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ExpandableTextProps {
  text?: string | null;
  maxLength?: number;
  className?: string;
}

export function ExpandableText({
  text,
  maxLength,
  className,
}: ExpandableTextProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const limit = maxLength ?? (isDesktop ? 150 : 80);
  const shouldTruncate = text.length > limit;

  if (!shouldTruncate) {
    return <p className={cn("", className)}>{text}</p>;
  }

  return (
    <div className={cn("", className)}>
      <p className="inline">
        {isExpanded ? text : `${text.slice(0, limit).trim()}...`}
      </p>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="ml-1 text-primary font-medium hover:underline focus:outline-none inline-block"
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
