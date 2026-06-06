"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { SafeImage } from "@/components/safe-image";
import { CircularProgressRing } from "@/components/dashboard/circular-progress-ring";
import { AmbientGlowOrb } from "@/components/dashboard/ambient-glow-orb";
import { AutoTransitionLink } from "@/components/auto-transition-link";
import { cn } from "@/lib/utils";
import type { HubSubmittedAppResponse } from "@/lib/types";

interface PremiumAppCardProps {
  app: HubSubmittedAppResponse;
  type: "PAID" | "FREE";
  index: number;
}

export function PremiumAppCard({ app, type, index }: PremiumAppCardProps) {
  const appName = app.androidApp?.appName || "Untitled";
  const appLogo = app.androidApp?.appLogoUrl || null;
  const currentDay = app.currentDay || 0;
  const totalDay = app.totalDay || 14;
  const currentTester = app.currentTester || 0;
  const totalTester = app.totalTester || 12;
  const remaining = totalDay - currentDay;

  const dayProgress = totalDay > 0 ? Math.min(currentDay / totalDay, 1) : 0;
  const testerProgress = totalTester > 0 ? Math.min(currentTester / totalTester, 1) : 0;
  const isBehind = testerProgress < dayProgress * 0.7;
  const isOnTrack = testerProgress >= dayProgress;
  const statusColor = isBehind ? "text-red-500" : isOnTrack ? "text-green-500" : "text-amber-500";

  const detailHref =
    type === "PAID" ? "/app/pro-testing" : "/app/free-testing";

  const accentColor =
    type === "PAID"
      ? "from-amber-500/10 via-amber-500/5 to-transparent"
      : "from-blue-500/10 via-blue-500/5 to-transparent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <AutoTransitionLink href={detailHref} className="block h-full">
        <MagicCard
          className="h-full !rounded-2xl border-border/40 bg-card/80"
          gradientColor={type === "PAID" ? "#f59e0b" : "#3b82f6"}
          gradientOpacity={0.15}
        >
          <div className="relative h-full p-4 flex flex-col overflow-hidden">
            {/* Shimmer sweep on hover */}
            <div className="pointer-events-none absolute inset-0 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out z-20"
              style={{
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 55%, transparent 70%)",
                clipPath: "polygon(0 0, 60% 0, 60% 100%, 0 100%)",
              }}
            />

            {/* Ambient glow orbs */}
            <AmbientGlowOrb
              color={type === "PAID" ? "bg-amber-500/5" : "bg-blue-500/5"}
              className="absolute -top-8 -right-8 w-24 h-24"
            />
            <AmbientGlowOrb
              color={type === "PAID" ? "bg-amber-500/5" : "bg-blue-500/5"}
              className="absolute -bottom-8 -left-8 w-20 h-20"
            />

            {/* Top row: logo + name + badge */}
            <div className="flex items-start gap-3 mb-3 relative z-10">
              <SafeImage
                src={appLogo}
                alt={appName}
                width={40}
                height={40}
                className="rounded-xl shrink-0 w-10 h-10 overflow-hidden ring-1 ring-border/50"
                fallbackIcon={
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-muted-foreground/60" />
                  </div>
                }
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{appName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                      type === "PAID"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                    )}
                  >
                    {type === "PAID" ? "PRO" : "FREE"}
                  </span>
                  <span className={cn("text-[10px] font-medium", statusColor)}>
                    {remaining > 0 ? `${remaining}d left` : "Final day"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row: ring + tester info */}
            <div className="flex items-center gap-3 mt-auto relative z-10">
              <CircularProgressRing
                dayValue={currentDay}
                dayMax={totalDay}
                testerValue={currentTester}
                testerMax={totalTester}
                size={44}
                strokeWidth={3}
              />
              <div className="min-w-0 text-xs text-muted-foreground">
                <p>
                  Day <span className="font-medium text-foreground">{currentDay}</span>
                  <span className="text-muted-foreground/60">/{totalDay}</span>
                </p>
                <p>
                  <span className="font-medium text-foreground">{currentTester}</span>
                  <span className="text-muted-foreground/60">/{totalTester}</span> testers
                </p>
              </div>

              {/* Gradient accent line */}
              <div
                className={cn(
                  "ml-auto w-1 h-8 rounded-full bg-gradient-to-b opacity-60",
                  accentColor,
                )}
              />
            </div>
          </div>
        </MagicCard>
      </AutoTransitionLink>
    </motion.div>
  );
}
