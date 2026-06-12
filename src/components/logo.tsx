"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type LogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface LogoProps {
  size?: LogoSize;
  className?: string;
  onClick?: () => void;
}

const sizeMap: Record<LogoSize, string> = {
  xs: "w-6 h-6", // 24px
  sm: "w-8 h-8", // 32px
  md: "w-10 h-10", // 40px
  lg: "w-12 h-12", // 48px
  xl: "w-16 h-16", // 64px
  "2xl": "w-24 h-24", // 96px
  "3xl": "w-32 h-32", // 128px
};

export function Logo({ size = "md", className, onClick }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const src = resolvedTheme === "dark" ? "/inTesters-logo-light.svg" : "/inTesters-logo-dark.svg";

  return (
    <div
      className={cn("relative select-none shrink-0", sizeMap[size], className)}
      onClick={onClick}
    >
      {mounted && (
        <Image
          src={src}
          alt="inTesters Logo"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
          priority
        />
      )}
    </div>
  );
}
