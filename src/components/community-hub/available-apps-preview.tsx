"use client";

import { motion } from "framer-motion";
import { Play, CheckCircle, Star, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AutoTransitionLink } from "@/components/auto-transition-link";
import { useState } from "react";

const FreeCommunityPreview = ({
  compact = false,
}: {
  compact?: boolean;
}) => (
  <div className={cn("w-full h-full bg-background overflow-hidden", compact ? "p-2 pt-4" : "p-3 sm:p-4")}>
    <div className={cn("flex items-center mb-3", compact ? "gap-1.5 mb-2" : "gap-2 sm:gap-3 sm:mb-4")}>
      <div className={cn("bg-primary/20 rounded-lg flex items-center justify-center", compact ? "w-5 h-5" : "w-8 h-8 sm:w-10 sm:h-10")}>
        <div className={cn("bg-primary/40 rounded", compact ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6")} />
      </div>
      <div className="flex-1">
        <div className={cn("bg-foreground/20 rounded mb-1", compact ? "h-1.5 w-10" : "h-2 sm:h-2.5 w-16 sm:w-20")} />
        <div className={cn("bg-muted-foreground/20 rounded", compact ? "h-1 w-7" : "h-1.5 sm:h-2 w-12 sm:w-14")} />
      </div>
    </div>

    <div className={cn("grid grid-cols-7 mb-3", compact ? "gap-0.5 mb-2" : "gap-1 sm:mb-4")}>
      {[...Array(14)].map((_, i) => (
        <div
          key={i}
          className={cn("aspect-square rounded flex items-center justify-center font-bold", compact ? "text-[4px]" : "text-[6px] sm:text-[8px]", i < 6 ? "bg-primary/20 text-primary" : i === 6 ? "bg-primary text-primary-foreground" : "bg-secondary")}
        >
          {i < 6 ? <CheckCircle className={cn(compact ? "w-1.5 h-1.5" : "w-2 h-2 sm:w-3 sm:h-3")} /> : i + 1}
        </div>
      ))}
    </div>

    <div className={cn("bg-gradient-to-r from-primary to-primary/60 rounded-lg text-primary-foreground", compact ? "p-1.5 mb-2" : "p-2 sm:p-3 mb-3 sm:mb-4")}>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn(compact ? "text-[5px]" : "text-[8px] sm:text-[10px]", "opacity-80")}>REWARD</p>
          <p className={cn(compact ? "text-[9px]" : "text-sm sm:text-base", "font-bold")}>150 Points</p>
        </div>
        <Star className={cn(compact ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6", "opacity-40")} />
      </div>
    </div>

    <div className={cn("bg-card rounded-lg border border-border/50", compact ? "p-1.5" : "p-2")}>
      <div className={cn("flex items-center mb-1", compact ? "gap-1" : "gap-1.5 sm:gap-2")}>
        <div className={cn("bg-muted rounded-full", compact ? "w-2.5 h-2.5" : "w-4 h-4 sm:w-5 sm:h-5")} />
        <div className={cn("bg-muted rounded", compact ? "h-1 w-5" : "h-1.5 sm:h-2 w-10 sm:w-12")} />
        <div className="ml-auto flex items-center gap-0.5">
          <Star className={cn("text-primary fill-primary", compact ? "w-1.5 h-1.5" : "w-2 h-2 sm:w-2.5 sm:h-2.5")} />
          <span className={cn(compact ? "text-[4px]" : "text-[6px] sm:text-[8px]")}>4.5</span>
        </div>
      </div>
      <div className={cn("bg-muted/50 rounded mb-0.5", compact ? "h-1 w-full" : "h-1.5 sm:h-2")} />
      <div className={cn("bg-muted/50 rounded w-3/4", compact ? "h-1" : "h-1.5 sm:h-2")} />
    </div>
  </div>
);

const PhoneFrame = ({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <div className="relative group/frame" onClick={onClick}>
    <div className="absolute inset-x-4 inset-y-2 bg-foreground/10 rounded-[2rem] blur-xl -z-10" />
    <div className="relative bg-gradient-to-b from-zinc-700 to-zinc-800 dark:from-zinc-600 dark:to-zinc-700 rounded-[2rem] p-1.5 shadow-xl mx-auto max-w-[130px]">
      <div className="absolute -left-0.5 top-16 w-0.5 h-6 bg-zinc-600 dark:bg-zinc-500 rounded-l" />
      <div className="absolute -left-0.5 top-24 w-0.5 h-6 bg-zinc-600 dark:bg-zinc-500 rounded-l" />
      <div className="absolute -right-0.5 top-20 w-0.5 h-8 bg-zinc-600 dark:bg-zinc-500 rounded-r" />
      <div className="relative bg-background rounded-[1.625rem] overflow-hidden">
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-black rounded-full z-20 flex items-center justify-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-900 ring-1 ring-zinc-700" />
        </div>
        <div className="aspect-[9/19] max-h-[260px]">
          <div
            className={cn("absolute inset-0 backdrop-blur-[2px] bg-background/50 z-10 transition-all duration-500 flex items-center justify-center cursor-pointer", isActive ? "opacity-0 pointer-events-none" : "opacity-100")}
          >
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 border border-primary/20 shadow-lg shadow-primary/10">
                <Play className="w-4 h-4 text-primary ml-0.5" />
              </div>
              <p className="text-[10px] font-medium text-foreground/70">Tap to preview</p>
            </div>
          </div>
          {children}
        </div>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-foreground/20 rounded-full" />
      </div>
    </div>
    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[60%] h-3 bg-foreground/5 blur-lg rounded-full" />
  </div>
);

export function AvailableAppsPreview() {
  const [mobileActive, setMobileActive] = useState<"free" | null>("free");
  const [isDesktopActive, setIsDesktopActive] = useState(false);

  const handleMobileClick = () => {
    setMobileActive(mobileActive === "free" ? null : "free");
  };

  return (
    <section data-loc="AvailableAppsPreview" className="py-16 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/20 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight">
            Browse{" "}
            <span className="text-primary italic">Available Apps</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Explore apps waiting for testers. Filter by category, testing
            duration, or number of testers to find the perfect match.
          </p>
        </motion.div>

        <div className="hidden md:flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="p-5 rounded-2xl bg-gradient-to-t from-primary/10 via-primary/5 to-transparent max-w-sm"
            onMouseEnter={() => setIsDesktopActive(true)}
            onMouseLeave={() => setIsDesktopActive(false)}
          >
            <p className="font-bold text-primary text-center mb-4">Community Hub Preview</p>
            <PhoneFrame isActive={isDesktopActive}>
              <FreeCommunityPreview />
            </PhoneFrame>
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full shadow-primary/20 bg-transparent text-white border-none">
                <AutoTransitionLink href="/community-dashboard">
                  Browse All Apps
                </AutoTransitionLink>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:hidden w-full max-w-xs mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="p-2 rounded-xl bg-gradient-to-t from-primary/20 to-transparent"
          >
            <p className="text-[10px] font-bold text-primary text-center mb-1">Community Hub</p>
            <PhoneFrame isActive={mobileActive === "free"} onClick={handleMobileClick}>
              <FreeCommunityPreview compact />
            </PhoneFrame>
            <div className="mt-1">
              <Button asChild variant="outline" size="sm" className="text-[9px] py-0.5 w-full bg-transparent text-white border-none">
                <AutoTransitionLink href="/community-dashboard">
                  Browse Apps
                </AutoTransitionLink>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
