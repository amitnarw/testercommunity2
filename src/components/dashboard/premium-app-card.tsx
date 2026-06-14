"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
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
  const statusColor = isBehind ? "text-red-400" : isOnTrack ? "text-green-400" : "text-amber-400";

  const detailHref = type === "PAID" ? "/app/pro-testing" : "/app/free-testing";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.08, ease: "easeOut" }}
    >
      <AutoTransitionLink href={detailHref} className="block">
        <div className="relative group p-3 -mx-3 flex items-center gap-4 rounded-xl hover:bg-white/[0.04] transition-colors border-b border-white/[0.08] last:border-0">
          {/* Logo */}
          <SafeImage
            src={appLogo}
            alt={appName}
            width={44}
            height={44}
            className="rounded-lg shrink-0 w-11 h-11 object-cover ring-1 ring-white/10"
            fallbackIcon={
              <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center ring-1 ring-white/10">
                <Activity className="w-5 h-5 text-white/40" />
              </div>
            }
          />

          {/* Details */}
          <div className="min-w-0 flex-1 py-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[15px] font-semibold text-white/90 truncate leading-tight">
                {appName}
              </p>
            </div>
            
            <div className="flex items-center gap-3 text-[13px] text-white/50 leading-none">
              <span className={cn("font-medium", statusColor)}>
                {remaining > 0 ? `${remaining}d left` : "Final day"}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>
                <strong className="text-white/80 font-medium">{currentTester}</strong>/{totalTester} testers
              </span>
            </div>
          </div>

        </div>
      </AutoTransitionLink>
    </motion.div>
  );
}
