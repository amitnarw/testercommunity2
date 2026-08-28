"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PricingResponse, RegionalPricingResponse, PlanAccent } from "@/lib/types";
import Link from "next/link";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const ACCENT_CLASSES: Record<
  PlanAccent,
  { bg: string; shadow: string; badge: string; muted: string; mutedStrong: string }
> = {
  primary: {
    bg: "bg-primary text-primary-foreground shadow-primary/30",
    shadow: "shadow-primary/30",
    badge: "bg-white text-primary hover:bg-white/90",
    muted: "text-primary-foreground/80",
    mutedStrong: "text-primary-foreground/90",
  },
  emerald: {
    bg: "bg-emerald-600 text-white shadow-emerald-600/30",
    shadow: "shadow-emerald-600/30",
    badge: "bg-white text-emerald-600 hover:bg-white/90",
    muted: "text-white/80",
    mutedStrong: "text-white/90",
  },
  blue: {
    bg: "bg-blue-600 text-white shadow-blue-600/30",
    shadow: "shadow-blue-600/30",
    badge: "bg-white text-blue-600 hover:bg-white/90",
    muted: "text-white/80",
    mutedStrong: "text-white/90",
  },
  amber: {
    bg: "bg-amber-600 text-white shadow-amber-600/30",
    shadow: "shadow-amber-600/30",
    badge: "bg-white text-amber-600 hover:bg-white/90",
    muted: "text-white/80",
    mutedStrong: "text-white/90",
  },
  purple: {
    bg: "bg-purple-600 text-white shadow-purple-600/30",
    shadow: "shadow-purple-600/30",
    badge: "bg-white text-purple-600 hover:bg-white/90",
    muted: "text-white/80",
    mutedStrong: "text-white/90",
  },
};

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;

export const ProfessionalPlanCard = ({
  plan,
  actionButton,
  regionalPricing,
  accent = "primary",
  accentIcon,
  description,
  customPriceLabel,
  ctaLabel,
  ctaHref,
}: {
  plan: PricingResponse;
  actionButton?: React.ReactNode;
  regionalPricing?: RegionalPricingResponse;
  accent?: "primary" | "emerald" | "blue" | "amber" | "purple";
  accentIcon?: React.ReactNode;
  description?: string;
  customPriceLabel?: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}) => {
  const effectiveAccent = plan.accent ?? accent;
  const palette = ACCENT_CLASSES[effectiveAccent] ?? ACCENT_CLASSES.primary;

  const hasGradient =
    plan.gradientFrom &&
    plan.gradientTo &&
    HEX_RE.test(plan.gradientFrom) &&
    HEX_RE.test(plan.gradientTo);

  const gradientStyle: React.CSSProperties | undefined = hasGradient
    ? {
        background: `linear-gradient(135deg, ${plan.gradientFrom} 0%, ${plan.gradientTo} 100%)`,
        boxShadow: `0 25px 50px -12px ${plan.gradientFrom}40`,
      }
    : undefined;

  const displayPrice = regionalPricing
    ? regionalPricing.amount / 100
    : plan.price;
  const displaySymbol = regionalPricing?.currency_symbol || "₹";
  const displayCurrency = regionalPricing?.currency_code || "INR";

  const isSubscription = plan.billingType === "SUBSCRIPTION";
  const hasNoCta = plan.billingType === "NONE";
  const customSuffix = (plan.customPriceSuffix ?? "").trim();
  const priceSuffix = hasNoCta
    ? ""
    : customSuffix.length > 0
      ? ` ${customSuffix}`
      : isSubscription
        ? "/month"
        : `/ one-time (${displayCurrency})`;

  const hasCta = ctaLabel && ctaHref && ctaLabel.trim().length > 0 && ctaHref.trim().length > 0;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.03 }}
      className={`relative flex flex-col p-8 sm:p-10 rounded-3xl h-full transition-all duration-300 shadow-2xl ${
        gradientStyle ? "" : palette.bg
      }`}
      style={gradientStyle}
    >
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-black/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-6 right-6 opacity-20 rotate-12">
        {accentIcon ?? <Star className="w-24 h-24 fill-current text-white" />}
      </div>

      {plan.isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
          <Badge className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg border-0">
            Recommended
          </Badge>
        </div>
      )}

      <div className="relative z-10 flex-col flex h-full">
        <div>
          <Badge className={`${palette.badge} border-0 mb-3 px-4 py-1.5 uppercase tracking-widest text-xs font-bold w-fit shadow-md`}>
            {plan.badgeText || plan.name}
          </Badge>
          <div className="mt-4 flex items-baseline">
            {customPriceLabel || plan.customPriceLabel ? (
              <span className="text-5xl font-bold tracking-tight">
                {customPriceLabel || plan.customPriceLabel}
              </span>
            ) : (
              <>
                <span className="text-5xl font-bold tracking-tight">
                  {displaySymbol}
                  {displayPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className={`ml-2 text-sm font-medium ${palette.muted}`}>
                  {priceSuffix}
                </span>
              </>
            )}
          </div>
          <p className={`mt-4 text-sm leading-relaxed ${palette.mutedStrong}`}>
            {description ||
              plan.description ||
              `Includes ${plan.package} full testing ${
                plan.package > 1 ? "cycles" : "cycle"
              }`}
          </p>
        </div>

        <div className="flex-1 space-y-4 my-8 relative z-10">
          {plan.features?.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-white/20">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className={`text-sm ${palette.mutedStrong}`}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto relative z-10">
          <div className="flex justify-center w-full">
            {hasNoCta ? null : hasCta ? (
              <div className="w-full">
                <Link href={ctaHref} className="w-full block">
                  <HoverBorderGradient
                    containerClassName="w-full"
                    className="bg-white text-primary flex items-center justify-center space-x-2 w-full py-4 font-bold cursor-pointer"
                  >
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    <span className="font-semibold">{ctaLabel}</span>
                  </HoverBorderGradient>
                </Link>
              </div>
            ) : actionButton ? (
              actionButton
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
