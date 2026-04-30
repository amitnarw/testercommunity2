"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

const ALLOWED_HOSTNAMES = [
  "placehold.co",
  "images.unsplash.com",
  "play.google.com",
  "play-lh.googleusercontent.com",
  "lh3.googleusercontent.com",
  "storage.googleapis.com",
  "picsum.photos",
  "pub-4118faf006a140b784ee878b5a5f7a46.r2.dev",
];

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackClassName?: string;
  fallbackIcon?: React.ReactNode;
  loadingClassName?: string;
}

export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackIcon,
  loadingClassName,
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

    // Allow any external URL - trust user's content
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
          fallbackClassName,
        )}
        role="img"
        aria-label={alt}
      >
        {fallbackIcon || <ImageOff className="w-8 h-8 opacity-50" />}
      </div>
    );
  }

  const isFill = (props as any).fill || (props as any).layout === "fill";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        isFill && "w-full h-full",
        className,
      )}
    >
      {isLoading && !error && isValidSrc(src) && (
        <div
          className={cn(
            "bg-muted/20 overflow-hidden relative flex items-center justify-center",
            loadingClassName || "w-full h-full",
          )}
        >
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      )}
      <Image
        src={src!}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          isFill && "absolute inset-0 w-full h-full",
          className,
        )}
        onError={() => setError(true)}
        onLoad={(e) => {
          setIsLoading(false);
          onLoad?.(e);
        }}
        {...props}
      />
    </div>
  );
}
