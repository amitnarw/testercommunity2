"use client";

import { cn } from "@/lib/utils";

export function AmbientGlowOrb({
  className,
  color = "bg-primary/10",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none rounded-full blur-[60px] transition-all duration-700",
        color,
        className,
      )}
      aria-hidden
    />
  );
}
