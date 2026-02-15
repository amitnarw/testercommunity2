"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface TabItem {
  label: string;
  value: string;
  count?: number | string;
}

interface CustomTabsListProps {
  tabs: TabItem[];
  activeTab: string;
  isLoading?: boolean;
  className?: string;
  listClassName?: string;
  layoutId?: string;
}

export function CustomTabsList({
  tabs,
  activeTab,
  isLoading = false,
  className,
  listClassName,
  layoutId = "activeTab",
}: CustomTabsListProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-30 backdrop-blur-xl py-2 -mx-4 sm:mx-0 px-2 sm:px-0",
        className,
      )}
    >
      <TabsList
        className={cn(
          "relative flex w-full bg-muted p-0.5 sm:p-1 h-auto rounded-lg overflow-x-auto no-scrollbar",
          listClassName,
        )}
      >
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.value;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "relative px-2 sm:px-4 text-sm font-medium rounded-lg transition-all duration-300",
                isSelected
                  ? "text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40",
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 bg-background rounded-lg shadow-sm"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2 text-xs sm:text-sm">
                {tab.label}
                {isLoading ? (
                  <Skeleton className="w-4 h-4 rounded-full" />
                ) : (
                  <span
                    className={cn(
                      "text-[10px] w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center rounded-full",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "bg-primary/5 text-muted-foreground group-hover:bg-muted/80",
                    )}
                  >
                    {tab.count ?? 0}
                  </span>
                )}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
}
