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
  X,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutoTransitionLink } from "@/components/auto-transition-link";
import { ROUTES } from "@/lib/routes";
import { usePricingData, useRegionalPricing } from "@/hooks/useUser";

const freeLimitations = [
  {
    icon: Clock,
    text: "20+ hours of your time testing others first",
  },
  {
    icon: Users,
    text: "Variable results, depends on community availability",
  },
  {
    icon: FileText,
    text: "No structured bug reports or coverage stats",
  },
  {
    icon: Smartphone,
    text: "No guaranteed device & OS coverage",
  },
  {
    icon: ShieldCheck,
    text: "Self-managed, you handle everything",
  },
];

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

const enterpriseFeatures = [
  "Everything in Pro Testing",
  "Volume discounts on packages",
  "Dedicated account manager",
  "Custom integrations & SLA",
  "Priority support",
  "Custom reporting",
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
  const { data: pricingPlans } = usePricingData();
  const { data: regionalPricing } = useRegionalPricing();

  const cheapestPlan = pricingPlans?.length
    ? pricingPlans.reduce((min, p) => (p.price < min.price ? p : min), pricingPlans[0])
    : null;

  const displaySymbol = regionalPricing?.currency_symbol || "₹";
  const displayPrice = regionalPricing
    ? Math.round(regionalPricing.amount / 100)
    : cheapestPlan
      ? cheapestPlan.price
      : null;

  const priceLabel = displayPrice !== null
    ? `${displaySymbol}${displayPrice.toLocaleString()}`
    : "Loading...";
  const perTesterLabel = displayPrice !== null && cheapestPlan
    ? `${displaySymbol}${Math.round(displayPrice / (cheapestPlan.package * 20)).toLocaleString()}`
    : null;

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
            <span className="text-orange-500 italic">Missing</span> on the Free
            Plan
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Free testing works, but it costs you time. Here&apos;s what Pro
            Testing gives you that the free plan can&apos;t.
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
              who started free eventually upgraded to Pro
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

        {/* Comparison Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto items-stretch"
        >
          {/* FREE PLAN */}
          <motion.div variants={itemVariants}>
            <div className="relative h-full flex flex-col p-6 md:p-8 rounded-3xl border bg-card text-card-foreground">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-secondary rounded-xl">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold">Free Testing</h3>
                </div>
                <div className="flex items-baseline mt-3">
                  <span className="text-3xl font-bold tracking-tight">{displaySymbol}0</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    / forever
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your time is the currency
                </p>
              </div>

              <div className="flex-1 space-y-3 mb-6">
                {freeLimitations.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-red-500/10">
                      <X className="w-3 h-3 text-red-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <AutoTransitionLink href={ROUTES.AUTHENTICATED.COMMUNITY_DASHBOARD} className="w-full">
                <Button
                  variant="outline"
                  className="w-full py-5 rounded-full font-semibold text-sm"
                >
                  Continue Free
                </Button>
              </AutoTransitionLink>
            </div>
          </motion.div>

          {/* PRO PLAN — HIGHLIGHTED */}
          <motion.div variants={itemVariants}>
            <div className="relative h-full flex flex-col p-6 md:p-8 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 md:scale-105 md:-my-2 mt-2 sm:mt-0">
              {/* Recommended Badge */}
              <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                <Badge className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg border-0">
                  Most Popular
                </Badge>
              </div>

              {/* Decorative */}
              <div className="absolute top-6 right-6 opacity-15 rotate-12">
                <Star className="w-20 h-20 fill-current text-white" />
              </div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none" />

              <div className="mb-6 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-white/20 rounded-xl">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Pro Testing</h3>
                </div>
                <div className="flex items-baseline mt-3">
                  <span className="text-3xl font-bold tracking-tight">
                    From {priceLabel}
                  </span>
                  <span className="ml-2 text-sm text-primary-foreground/80">
                    / per cycle
                  </span>
                </div>
                {perTesterLabel && (
                  <p className="mt-2 text-xs text-primary-foreground/70">
                    Less than {perTesterLabel}/tester, your time is worth more
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-3 mb-6 relative z-10">
                {proFeatures.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-white/20">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        item.highlight
                          ? "text-white font-medium"
                          : "text-primary-foreground/90",
                      )}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <AutoTransitionLink href={ROUTES.PUBLIC.PRICING} className="w-full relative z-10">
                <Button className="w-full py-5 rounded-full font-bold text-sm bg-white text-primary hover:bg-white/90 shadow-lg">
                  <Zap className="w-4 h-4 mr-2 fill-current" />
                  Upgrade to Pro
                </Button>
              </AutoTransitionLink>
            </div>
          </motion.div>

          {/* ENTERPRISE */}
          <motion.div variants={itemVariants}>
            <div className="relative h-full flex flex-col p-6 md:p-8 rounded-3xl border bg-card text-card-foreground">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-secondary rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold">Enterprise</h3>
                </div>
                <div className="flex items-baseline mt-3">
                  <span className="text-3xl font-bold tracking-tight">
                    Custom
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  For agencies & high-volume teams
                </p>
              </div>

              <div className="flex-1 space-y-3 mb-6">
                {enterpriseFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-primary/10">
                      <CheckCircle className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <AutoTransitionLink href="/contact-us" className="w-full">
                <Button
                  variant="outline"
                  className="w-full py-5 rounded-full font-semibold text-sm"
                >
                  Contact Sales
                </Button>
              </AutoTransitionLink>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
