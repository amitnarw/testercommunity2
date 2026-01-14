"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackClassName?: string;
  fallbackIcon?: React.ReactNode;
}

export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackIcon,
  onLoad,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setError(false);
    setIsLoading(true);
  }, [src]);

  const isValidSrc = (src: string | null | undefined) => {
    if (!src) return false;
    // Allow relative paths and data URLs
    if (src.startsWith("/") || src.startsWith("data:")) return true;

    // Check absolute URLs
    try {
      new URL(src);
      return true;
    } catch {
      return false;
    }
  };

  if (error || !isValidSrc(src)) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/50 text-muted-foreground transition-colors",
          className,
          fallbackClassName
        )}
        role="img"
        aria-label={alt}
      >
        {fallbackIcon || <ImageOff className="w-8 h-8 opacity-50" />}
      </div>
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      className={cn(className, isLoading ? "animate-pulse bg-muted" : "")}
      onError={() => setError(true)}
      onLoad={(e) => {
        setIsLoading(false);
        onLoad?.(e);
      }}
      {...props}
    />
  );
}
