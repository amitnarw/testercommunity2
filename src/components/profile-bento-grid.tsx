"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Settings,
  CreditCard,
  Headphones,
  MessageCircle,
  Trophy,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Star,
  Sparkles,
  ChevronRight,
  Users,
  Box,
  Crown,
} from "lucide-react";
import { TransitionLink } from "@/components/transition-link";
import { cn } from "@/lib/utils";

// --- Components ---

const Card = ({
  className,
  children,
  href,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  href?: string;
  delay?: number;
}) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[2rem] border border-border/40 bg-card p-8 shadow-2xl transition-all duration-500 hover:shadow-primary/20",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <TransitionLink
        href={href}
        className={cn("block h-full w-full", className && "col-span-1")}
      >
        <div className="h-full w-full">
          {/* Render the card content without the outer wrapper class since accessible link wraps it */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            className={cn(
              "group relative h-full flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border/40 bg-card p-6 md:p-8 shadow-none transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20",
              className,
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {children}
          </motion.div>
        </div>
      </TransitionLink>
    );
  }
  return content;
};

export function ProfileBentoGrid() {
  return (
    <section className="mx-auto max-w-7xl py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
        {/* LEFT COLUMN: Large Vertical "Refer & Earn" */}
        <div className="md:col-span-1 h-full">
          <Card
            href="/profile/referral"
            className="h-full bg-gradient-to-b from-card to-background"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-4 flex-1">
                <h3 className="text-3xl font-bold leading-tight">
                  Refer Friends. <br />
                  <span className="text-primary">Earn Pro.</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Invite your developer friends to the community. Unlock 1 month
                  of premium features for every successful referral.
                </p>

                {/* Visual Element */}
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex -space-x-4 rtl:space-x-reverse">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-[10px] text-white font-medium"
                      >
                        <Users className="w-4 h-4 opacity-50" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    +0 joined
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-6 flex items-center gap-2 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                Get Referral Link <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            {/* Decorative Sphere */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-colors" />
          </Card>
        </div>

        {/* RIGHT COLUMN: Stacked Items */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {/* Top: Upgrade Plan */}
          <Card
            href="/billing"
            delay={0.1}
            className="flex-1 min-h-[240px] bg-gradient-to-br from-primary via-blue-600 to-indigo-700 border-none"
          >
            <div className="relative z-10 flex flex-col h-full justify-between text-white">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                  <Crown className="w-6 h-6" />
                </div>
                <span className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  PRO
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-1">Upgrade Plan</h3>
                <p className="text-blue-100 text-sm opacity-90">
                  Unlock unlimited testing & priority support.
                </p>
              </div>

              <div className="flex justify-end">
                <div className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 opacity-20" />
          </Card>

          {/* Bottom: Settings & Support Split */}
          <div className="grid grid-cols-2 gap-4 h-[240px]">
            {/* Settings Card - Ambient Aurora (Cyan) */}
            <Card
              href="/settings"
              delay={0.2}
              className="h-full group/settings !p-6 flex flex-col justify-between bg-white dark:bg-zinc-950  transition-all duration-500 overflow-hidden relative shadow-sm border-none"
            >
              {/* Ambient Glow */}
              <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[50px] group-hover/settings:bg-cyan-400/20 dark:group-hover/settings:bg-cyan-400/30 group-hover/settings:scale-150 transition-all duration-700 ease-in-out" />
              <div className="absolute bottom-[-20%] left-[-10%] w-24 h-24 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[40px] group-hover/settings:bg-blue-500/10 dark:group-hover/settings:bg-blue-500/20 transition-all duration-700" />

              {/* Top: Icon */}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/10 backdrop-blur-md flex items-center justify-center group-hover/settings:scale-105 group-hover/settings:border-cyan-500/30 group-hover/settings:bg-cyan-500/5 dark:group-hover/settings:bg-cyan-500/10 transition-all duration-300">
                  <Settings className="w-6 h-6 text-cyan-600 dark:text-cyan-200 group-hover/settings:text-cyan-500 dark:group-hover/settings:text-cyan-100 transition-colors duration-300" />
                </div>
              </div>

              {/* Bottom: Typography */}
              <div className="relative z-10 space-y-1">
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                  Settings
                  <span className="opacity-0 -translate-x-2 group-hover/settings:opacity-100 group-hover/settings:translate-x-0 transition-all duration-300">
                    <ChevronRight className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  </span>
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium group-hover/settings:text-zinc-700 dark:group-hover/settings:text-zinc-300 transition-colors">
                  Preferences & Controls
                </p>
              </div>
            </Card>

            {/* Support Card - Ambient Aurora (Violet) */}
            <Card
              href="/support"
              delay={0.3}
              className="h-full group/support !p-6 flex flex-col justify-between bg-white dark:bg-zinc-950 border-none transition-all duration-500 overflow-hidden relative shadow-sm hover:shadow-violet-500/5"
            >
              {/* Ambient Glow */}
              <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-[50px] group-hover/support:bg-violet-500/20 dark:group-hover/support:bg-violet-500/30 group-hover/support:scale-150 transition-all duration-700 ease-in-out" />
              <div className="absolute bottom-[-20%] left-[-10%] w-24 h-24 bg-fuchsia-600/5 dark:bg-fuchsia-600/10 rounded-full blur-[40px] group-hover/support:bg-fuchsia-500/10 dark:group-hover/support:bg-fuchsia-500/20 transition-all duration-700" />

              {/* Top: Icon */}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-white/10 backdrop-blur-md flex items-center justify-center group-hover/support:scale-105 group-hover/support:border-violet-500/30 group-hover/support:bg-violet-500/5 dark:group-hover/support:bg-violet-500/10 transition-all duration-300">
                  <Headphones className="w-6 h-6 text-violet-600 dark:text-violet-200 group-hover/support:text-violet-500 dark:group-hover/support:text-violet-100 transition-colors duration-300" />
                </div>
              </div>

              {/* Bottom: Typography */}
              <div className="relative z-10 space-y-1">
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                  Support
                  <span className="opacity-0 -translate-x-2 group-hover/support:opacity-100 group-hover/support:translate-x-0 transition-all duration-300">
                    <ChevronRight className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                  </span>
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium group-hover/support:text-zinc-700 dark:group-hover/support:text-zinc-300 transition-colors">
                  24/7 Expert Chat
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
