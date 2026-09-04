"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Clock,
  Zap,
  ShieldCheck,
  FileText,
  Smartphone,
  CheckCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { HorizontalPinPricing } from "@/components/horizontal-pin-pricing";

const proFeatures = [
  {
    icon: Zap,
    text: "Zero effort, submit & forget",
    highlight: true,
  },
  {
    icon: Users,
    text: "20+ vetted professional testers",
    highlight: true,
  },
  {
    icon: FileText,
    text: "Detailed bug reports & analytics",
    highlight: false,
  },
  {
    icon: Smartphone,
    text: "Device & OS coverage stats",
    highlight: false,
  },
  {
    icon: ShieldCheck,
    text: "Google Play compliance verification",
    highlight: false,
  },
  {
    icon: Clock,
    text: "Guaranteed 14-day testing cycle",
    highlight: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export function WhatProUnlocks() {
  return (
    <section
      data-loc="WhatProUnlocks"
      className="py-16 md:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.08] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Upgrade Your Testing</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight">
            What You&apos;re{" "}
            <span className="text-orange-500 italic">Missing</span> with Handshake
            Testing
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Handshake Testing works, but it demands your time and effort. Here&apos;s what Pro
            Testing gives you that barter testing can&apos;t.
          </p>
        </motion.div>

        {/* Social Proof Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border/50 shadow-md">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white",
                    i === 0 && "bg-blue-500",
                    i === 1 && "bg-green-500",
                    i === 2 && "bg-purple-500",
                    i === 3 && "bg-orange-500",
                  )}
                >
                  {["A", "R", "S", "K"][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">87% of developers</span>{" "}
              who started with Handshake eventually upgraded to Pro
            </p>
          </div>
        </motion.div>

        {/* Time Cost Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="max-w-3xl mx-auto mb-10 md:mb-14"
        >
          <div className="flex items-center justify-center gap-6 md:gap-10 px-6 py-4 rounded-2xl bg-card border border-border/50 shadow-md">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold tracking-tight">20+</p>
              <p className="text-xs text-muted-foreground mt-0.5">hours of your time</p>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold tracking-tight">14</p>
              <p className="text-xs text-muted-foreground mt-0.5">day testing cycle</p>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-primary">0</p>
              <p className="text-xs text-muted-foreground mt-0.5">hrs with Pro</p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <HorizontalPinPricing variant="what-pro" />
        </motion.div>
      </div>
    </section>
  );
}
