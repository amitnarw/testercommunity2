"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const radius = 26;
  const strokeWidth = 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  useEffect(() => {
    let requestRunning = false;
    const handleScroll = () => {
      if (!requestRunning) {
        requestRunning = true;
        window.requestAnimationFrame(() => {
          const scrollTop =
            window.scrollY || document.documentElement.scrollTop;
          const scrollHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
          const progress =
            scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

          setIsVisible(scrollTop > 300);
          setScrollProgress(progress);
          requestRunning = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      data-loc="ScrollToTopButton"
      className={cn(
        "fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="relative w-12 h-12 md:w-16 md:h-16">
        {/* Progress border */}
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none z-10"
          viewBox="0 0 60 60"
        >
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="var(--tw-border-color)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary"
          />
        </svg>

        {/* Button */}
        <Button
          onClick={scrollToTop}
          variant="ghost"
          size="icon"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-background/50 backdrop-blur-sm shadow-lg"
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      </div>
    </div>
  );
}
