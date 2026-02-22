"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransitionRouter } from "@/context/transition-context";

interface BackButtonProps {
  href?: string;
  className?: string;
}

export function BackButton({ href, className }: BackButtonProps) {
  const router = useTransitionRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else if (href) {
      router.push(href);
    } else {
      router.push("/");
    }
  };

  const commonProps = {
    variant: "outline" as const,
    className: cn(
      "rounded-full px-4 h-8 md:h-10 group md:pl-12 border-0 shadow-lg shadow-[hsl(var(--primary))]/10 hover:bg-white hover:dark:bg-secondary hover:text-[hsl(var(--primary))]",
      className,
    ),
  };

  const content = (
    <div className="flex items-center justify-center absolute -left-2 rounded-full duration-300 group-hover:bg-[hsl(var(--primary))] p-5 group-hover:scale-[1.3]">
      <ChevronLeft className="absolute group-hover:text-white scale-[1.1] left-4 md:left-5" />
    </div>
  );

  return (
    <Button {...commonProps} onClick={handleClick}>
      {content}
      <span className="hidden md:inline">Back</span>
    </Button>
  );
}
