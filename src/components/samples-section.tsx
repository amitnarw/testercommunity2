"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Play,
  CheckCircle,
  Star,
  Bug,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock preview screenshots - simplified UI representations
const FreeCommunityPreview = ({ compact = false }: { compact?: boolean }) => (
  <div
    className={cn(
      "w-full h-full bg-background overflow-hidden",
      compact ? "p-2 pt-4" : "p-3 sm:p-4",
    )}
  >
    {/* Header */}
    <div
      className={cn(
        "flex items-center mb-3",
        compact ? "gap-1.5 mb-2" : "gap-2 sm:gap-3 sm:mb-4",
      )}
    >
      <div
        className={cn(
          "bg-primary/20 rounded-lg flex items-center justify-center",
          compact ? "w-5 h-5" : "w-8 h-8 sm:w-10 sm:h-10",
        )}
      >
        <div
          className={cn(
            "bg-primary/40 rounded",
            compact ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6",
          )}
        />
      </div>
      <div className="flex-1">
        <div
          className={cn(
            "bg-foreground/20 rounded mb-1",
            compact ? "h-1.5 w-10" : "h-2 sm:h-2.5 w-16 sm:w-20",
          )}
        />
        <div
          className={cn(
            "bg-muted-foreground/20 rounded",
            compact ? "h-1 w-7" : "h-1.5 sm:h-2 w-12 sm:w-14",
          )}
        />
      </div>
    </div>

    {/* Day Progress Grid */}
    <div
      className={cn(
        "grid grid-cols-7 mb-3",
        compact ? "gap-0.5 mb-2" : "gap-1 sm:mb-4",
      )}
    >
      {[...Array(14)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "aspect-square rounded flex items-center justify-center font-bold",
            compact ? "text-[4px]" : "text-[6px] sm:text-[8px]",
            i < 6
              ? "bg-primary/20 text-primary"
              : i === 6
                ? "bg-primary text-primary-foreground"
                : "bg-secondary",
          )}
        >
          {i < 6 ? (
            <CheckCircle
              className={cn(compact ? "w-1.5 h-1.5" : "w-2 h-2 sm:w-3 sm:h-3")}
            />
          ) : (
            i + 1
          )}
        </div>
      ))}
    </div>

    {/* Reward Card */}
    <div
      className={cn(
        "bg-gradient-to-r from-primary to-primary/60 rounded-lg text-primary-foreground",
        compact ? "p-1.5 mb-2" : "p-2 sm:p-3 mb-3 sm:mb-4",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={cn(
              compact ? "text-[5px]" : "text-[8px] sm:text-[10px]",
              "opacity-80",
            )}
          >
            REWARD
          </p>
          <p
            className={cn(
              compact ? "text-[9px]" : "text-sm sm:text-base",
              "font-bold",
            )}
          >
            150 Points
          </p>
        </div>
        <Star
          className={cn(
            compact ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6",
            "opacity-40",
          )}
        />
      </div>
    </div>

    {/* Feedback Preview */}
    <div
      className={cn(
        "bg-card rounded-lg border border-border/50",
        compact ? "p-1.5" : "p-2",
      )}
    >
      <div
        className={cn(
          "flex items-center mb-1",
          compact ? "gap-1" : "gap-1.5 sm:gap-2",
        )}
      >
        <div
          className={cn(
            "bg-muted rounded-full",
            compact ? "w-2.5 h-2.5" : "w-4 h-4 sm:w-5 sm:h-5",
          )}
        />
        <div
          className={cn(
            "bg-muted rounded",
            compact ? "h-1 w-5" : "h-1.5 sm:h-2 w-10 sm:w-12",
          )}
        />
        <div className="ml-auto flex items-center gap-0.5">
          <Star
            className={cn(
              "text-primary fill-primary",
              compact ? "w-1.5 h-1.5" : "w-2 h-2 sm:w-2.5 sm:h-2.5",
            )}
          />
          <span
            className={cn(compact ? "text-[4px]" : "text-[6px] sm:text-[8px]")}
          >
            4.5
          </span>
        </div>
      </div>
      <div
        className={cn(
          "bg-muted/50 rounded mb-0.5",
          compact ? "h-1 w-full" : "h-1.5 sm:h-2",
        )}
      />
      <div
        className={cn(
          "bg-muted/50 rounded w-3/4",
          compact ? "h-1" : "h-1.5 sm:h-2",
        )}
      />
    </div>
  </div>
);

const PaidDashboardPreview = ({ compact = false }: { compact?: boolean }) => (
  <div
    className={cn(
      "w-full h-full bg-background overflow-hidden",
      compact ? "p-2 pt-4" : "p-3 sm:p-4",
    )}
  >
    {/* Header */}
    <div
      className={cn(
        "flex items-center mb-3",
        compact ? "gap-1.5 mb-2" : "gap-2 sm:gap-3 sm:mb-4",
      )}
    >
      <div
        className={cn(
          "bg-primary/20 rounded-lg flex items-center justify-center",
          compact ? "w-5 h-5" : "w-8 h-8 sm:w-10 sm:h-10",
        )}
      >
        <div
          className={cn(
            "bg-primary/40 rounded",
            compact ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6",
          )}
        />
      </div>
      <div className="flex-1">
        <div
          className={cn(
            "bg-foreground/20 rounded mb-1",
            compact ? "h-1.5 w-12" : "h-2 sm:h-2.5 w-20 sm:w-24",
          )}
        />
        <div
          className={cn(
            "bg-muted-foreground/20 rounded",
            compact ? "h-1 w-8" : "h-1.5 sm:h-2 w-14 sm:w-16",
          )}
        />
      </div>
      <div
        className={cn(
          "bg-primary/20 rounded font-bold text-primary",
          compact
            ? "px-1 py-0.5 text-[4px]"
            : "px-1.5 sm:px-2 py-0.5 sm:py-1 text-[6px] sm:text-[8px]",
        )}
      >
        In Testing
      </div>
    </div>

    {/* Stats Grid */}
    <div
      className={cn(
        "grid grid-cols-2 mb-3",
        compact ? "gap-1 mb-2" : "gap-1.5 sm:gap-2 sm:mb-4",
      )}
    >
      <div
        className={cn(
          "bg-gradient-to-br from-primary to-primary/60 rounded-lg text-primary-foreground text-center",
          compact ? "p-1" : "p-1.5 sm:p-2",
        )}
      >
        <p
          className={cn(
            compact ? "text-[4px]" : "text-[6px] sm:text-[8px]",
            "opacity-80",
          )}
        >
          Testers
        </p>
        <p
          className={cn(
            compact ? "text-[9px]" : "text-sm sm:text-base",
            "font-bold",
          )}
        >
          12/14
        </p>
      </div>
      <div
        className={cn(
          "bg-gradient-to-br from-primary/80 to-primary/40 rounded-lg text-primary-foreground text-center",
          compact ? "p-1" : "p-1.5 sm:p-2",
        )}
      >
        <p
          className={cn(
            compact ? "text-[4px]" : "text-[6px] sm:text-[8px]",
            "opacity-80",
          )}
        >
          Days
        </p>
        <p
          className={cn(
            compact ? "text-[9px]" : "text-sm sm:text-base",
            "font-bold",
          )}
        >
          10/14
        </p>
      </div>
    </div>

    {/* Feedback Breakdown */}
    <div
      className={cn(
        "bg-card rounded-lg border border-border/50",
        compact ? "p-1.5 mb-1.5" : "p-1.5 sm:p-2 mb-2 sm:mb-3",
      )}
    >
      <p
        className={cn(
          "text-muted-foreground",
          compact
            ? "text-[4px] mb-1"
            : "text-[6px] sm:text-[8px] mb-1.5 sm:mb-2",
        )}
      >
        Feedback
      </p>
      <div className="grid grid-cols-3 gap-1">
        <div
          className={cn(
            "bg-secondary/50 rounded text-center",
            compact ? "p-0.5" : "p-1 sm:p-1.5",
          )}
        >
          <Bug
            className={cn(
              "mx-auto text-muted-foreground mb-0.5",
              compact ? "w-1.5 h-1.5" : "w-2 h-2 sm:w-3 sm:h-3",
            )}
          />
          <p
            className={cn(
              "font-bold",
              compact ? "text-[5px]" : "text-[6px] sm:text-[8px]",
            )}
          >
            2
          </p>
        </div>
        <div
          className={cn(
            "bg-secondary/50 rounded text-center",
            compact ? "p-0.5" : "p-1 sm:p-1.5",
          )}
        >
          <Lightbulb
            className={cn(
              "mx-auto text-muted-foreground mb-0.5",
              compact ? "w-1.5 h-1.5" : "w-2 h-2 sm:w-3 sm:h-3",
            )}
          />
          <p
            className={cn(
              "font-bold",
              compact ? "text-[5px]" : "text-[6px] sm:text-[8px]",
            )}
          >
            1
          </p>
        </div>
        <div
          className={cn(
            "bg-secondary/50 rounded text-center",
            compact ? "p-0.5" : "p-1 sm:p-1.5",
          )}
        >
          <Star
            className={cn(
              "mx-auto text-muted-foreground mb-0.5",
              compact ? "w-1.5 h-1.5" : "w-2 h-2 sm:w-3 sm:h-3",
            )}
          />
          <p
            className={cn(
              "font-bold",
              compact ? "text-[5px]" : "text-[6px] sm:text-[8px]",
            )}
          >
            1
          </p>
        </div>
      </div>
    </div>

    {/* Tester Row */}
    <div
      className={cn(
        "bg-card rounded-lg border border-border/50",
        compact ? "p-1.5" : "p-1.5 sm:p-2",
      )}
    >
      <div
        className={cn(
          "flex items-center",
          compact ? "gap-1" : "gap-1.5 sm:gap-2",
        )}
      >
        <div
          className={cn(
            "flex",
            compact ? "-space-x-0.5" : "-space-x-1 sm:-space-x-1.5",
          )}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-gradient-to-br from-primary/30 to-secondary border border-background",
                compact ? "w-2 h-2" : "w-3 h-3 sm:w-4 sm:h-4",
              )}
            />
          ))}
        </div>
        <span
          className={cn(
            "text-muted-foreground",
            compact ? "text-[4px]" : "text-[6px] sm:text-[8px]",
          )}
        >
          +8 testers
        </span>
      </div>
    </div>
  </div>
);

// Modern Browser Window Frame for Desktop
const BrowserFrame = ({
  children,
  isActive,
}: {
  children: React.ReactNode;
  isActive: boolean;
}) => (
  <div className="relative group/frame">
    {/* Shadow */}
    <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-foreground/10 rounded-xl blur-xl -z-10 scale-95 group-hover/frame:scale-100 transition-transform duration-300" />

    {/* Browser Window */}
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl shadow-foreground/5">
      {/* Title Bar */}
      <div className="bg-secondary/50 px-4 py-2.5 flex items-center gap-3 border-b border-border/50">
        {/* Traffic Lights */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        {/* URL Bar */}
        <div className="flex-1 flex justify-center">
          <div className="bg-background/80 rounded-md px-4 py-1 flex items-center gap-1.5 text-muted-foreground text-xs max-w-[200px]">
            <div className="w-3 h-3 rounded-full bg-primary/30" />
            <span className="truncate">intesters.com</span>
          </div>
        </div>
        {/* Spacer */}
        <div className="w-[52px]" />
      </div>

      {/* Content Area */}
      <div className="relative bg-background aspect-[16/10]">
        {/* Blur Overlay */}
        <div
          className={cn(
            "absolute inset-0 backdrop-blur-[3px] bg-background/50 z-10 transition-all duration-500 flex items-center justify-center",
            isActive ? "opacity-0 pointer-events-none" : "opacity-100",
          )}
        >
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 border border-primary/20 shadow-lg shadow-primary/10">
              <Play className="w-6 h-6 text-primary ml-0.5" />
            </div>
            <p className="text-sm font-medium text-foreground/70">
              Hover to preview
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  </div>
);

// Modern Phone Frame for Mobile
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
    {/* Shadow */}
    <div className="absolute inset-x-4 inset-y-2 bg-foreground/10 rounded-[2rem] blur-xl -z-10" />

    {/* Phone Body */}
    <div className="relative bg-gradient-to-b from-zinc-700 to-zinc-800 dark:from-zinc-600 dark:to-zinc-700 rounded-[2rem] p-1.5 shadow-xl mx-auto max-w-[130px]">
      {/* Side Buttons - Volume */}
      <div className="absolute -left-0.5 top-16 w-0.5 h-6 bg-zinc-600 dark:bg-zinc-500 rounded-l" />
      <div className="absolute -left-0.5 top-24 w-0.5 h-6 bg-zinc-600 dark:bg-zinc-500 rounded-l" />
      {/* Side Button - Power */}
      <div className="absolute -right-0.5 top-20 w-0.5 h-8 bg-zinc-600 dark:bg-zinc-500 rounded-r" />

      {/* Screen */}
      <div className="relative bg-background rounded-[1.625rem] overflow-hidden">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-black rounded-full z-20 flex items-center justify-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-900 ring-1 ring-zinc-700" />
        </div>

        {/* Screen Content */}
        <div className="aspect-[9/19] max-h-[260px]">
          {/* Blur Overlay */}
          <div
            className={cn(
              "absolute inset-0 backdrop-blur-[2px] bg-background/50 z-10 transition-all duration-500 flex items-center justify-center cursor-pointer",
              isActive ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 border border-primary/20 shadow-lg shadow-primary/10">
                <Play className="w-4 h-4 text-primary ml-0.5" />
              </div>
              <p className="text-[10px] font-medium text-foreground/70">
                Tap to preview
              </p>
            </div>
          </div>
          {children}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-foreground/20 rounded-full" />
      </div>
    </div>

    {/* Subtle Reflection */}
    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[60%] h-3 bg-foreground/5 blur-lg rounded-full" />
  </div>
);

export function SamplesSection() {
  const [activePreview, setActivePreview] = useState<"free" | "paid" | null>(
    null,
  );
  const [mobileActive, setMobileActive] = useState<"free" | "paid" | null>(
    null,
  );

  const handleMobileClick = (id: "free" | "paid") => {
    setMobileActive(mobileActive === id ? null : id);
  };

  const samples = [
    {
      id: "free" as const,
      label: "For Testers",
      href: "/samples/free-community-hub",
    },
    {
      id: "paid" as const,
      label: "For Developers",
      href: "/samples/paid-dashboard",
    },
  ];

  return (
    <section
      data-loc="SamplesSection"
      className="relative py-10 md:py-28 overflow-hidden"
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-secondary/30 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-2xl md:text-5xl font-bold font-heading tracking-tight leading-none mb-3 md:mb-4">
            A <span className="text-primary italic mr-2">Preview</span> of Our
            Work
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl mx-auto"
          >
            Want to see what you're getting before committing? We proudly
            showcase our platform, explore both dashboards with no signup
            required.
          </motion.p>
        </div>

        {/* Desktop: Browser Window Mockups */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {samples.map((sample, index) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group p-5 rounded-2xl bg-gradient-to-t from-primary/80 to-primary/0"
              onMouseEnter={() => setActivePreview(sample.id)}
              onMouseLeave={() => setActivePreview(null)}
            >
              {/* Browser Mockup */}
              <div className="mb-6 transition-transform duration-300 group-hover:-translate-y-2">
                <p className="font-bold text-primary text-center mb-5">
                  {sample.label}
                </p>
                <BrowserFrame isActive={activePreview === sample.id}>
                  {sample.id === "free" ? (
                    <FreeCommunityPreview />
                  ) : (
                    <PaidDashboardPreview />
                  )}
                </BrowserFrame>
              </div>

              <Link
                href={sample.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full shadow-primary/20 bg-transparent text-white border-none"
                >
                  VIEW SAMPLE
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Phone Mockups Side by Side */}
        <div className="grid grid-cols-2 gap-2 md:hidden w-full">
          {samples.map((sample, index) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-2 rounded-2xl bg-gradient-to-t from-primary/80 to-primary/0 flex flex-col"
            >
              {/* Phone Mockup */}
              <div className="mb-2">
                <p className="text-[11px] font-bold text-primary text-center mb-2">
                  {sample.label}
                </p>
                <PhoneFrame
                  isActive={mobileActive === sample.id}
                  onClick={() => handleMobileClick(sample.id)}
                >
                  {sample.id === "free" ? (
                    <FreeCommunityPreview compact />
                  ) : (
                    <PaidDashboardPreview compact />
                  )}
                </PhoneFrame>
              </div>

              <div>
                <Link
                  href={sample.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="text-[10px] py-1 w-full shadow-primary/20 bg-transparent text-white border-none"
                  >
                    VIEW SAMPLE
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
