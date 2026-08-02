"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { ProfessionalPlanCard } from "./pricing-cards";
import { HandshakePlanCard } from "./handshake/plan-card";
import { EnterprisePlanCard } from "./pricing-cards";
import { PricingResponse } from "@/lib/types";
import { ROUTES } from "@/lib/routes";
import { useQuery } from "@tanstack/react-query";
import { getAllPricingPlans, getHandshakePlan } from "@/lib/apiCalls";

type PricingVariant = "home" | "pricing" | "billing" | "what-pro" | "seo";
type PricingMode = "billing" | "redirect";

const VARIANT_STYLES: Record<PricingVariant, { cols: string; maxW: string }> = {
  home: { cols: "grid-cols-1 md:grid-cols-2", maxW: "max-w-5xl" },
  pricing: { cols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", maxW: "max-w-6xl" },
  billing: { cols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", maxW: "max-w-6xl" },
  "what-pro": { cols: "grid-cols-1 md:grid-cols-2", maxW: "max-w-5xl" },
  seo: { cols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", maxW: "max-w-6xl" },
};

export function PricingCardsGrid({
  variant = "pricing",
  className = "",
  mode = "redirect",
  onSubscribe,
  onHandshakeSubscribeError,
  onCheckoutRequired,
}: {
  variant?: PricingVariant;
  className?: string;
  mode?: PricingMode;
  onSubscribe?: (planId: string) => void;
  onHandshakeSubscribeError?: (error: any) => void;
  onCheckoutRequired?: () => void;
}) {
  const pathname = usePathname();

  const { data: handshakePlan } = useQuery<PricingResponse | null>({
    queryKey: ["handshakePlan"],
    queryFn: () => getHandshakePlan(),
    retry: false,
  });

  const { data: proPlans } = useQuery<PricingResponse[]>({
    queryKey: ["pricingPlansGrid"],
    queryFn: () => getAllPricingPlans(),
    retry: false,
  });

  const proPlan = proPlans?.find((p) => p.isPopular) ?? proPlans?.[0] ?? null;
  const enterprisePlan = proPlans?.find((p) => p.billingType === "CUSTOM") ?? null;

  const includeEnterprise = variant !== "what-pro";
  const allPlans = [handshakePlan, proPlan, ...(includeEnterprise ? [enterprisePlan] : [])].filter(
    (p): p is PricingResponse => !!p && p.isActive,
  );

  const sortedPlans = [...allPlans].sort(
    (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0),
  );

  if (sortedPlans.length === 0) return null;

  const style = VARIANT_STYLES[variant] ?? VARIANT_STYLES.pricing;

  const resolveRedirectHref = (adminHref?: string | null) => {
    if (adminHref && adminHref.trim().length > 0) return adminHref;
    if (pathname === "/pricing") return ROUTES.AUTHENTICATED.BILLING;
    return ROUTES.PUBLIC.PRICING;
  };

  return (
    <div
      className={`grid ${style.cols} gap-4 items-stretch mx-auto ${style.maxW} ${className}`}
    >
      {sortedPlans.map((plan) => {
        if (plan.id === "handshake") {
          if (mode === "billing") {
            return (
              <HandshakePlanCard
                key="handshake"
                mode="billing"
                onSubscribeError={onHandshakeSubscribeError}
                onCheckoutRequired={onCheckoutRequired}
              />
            );
          }
          return (
            <HandshakePlanCard
              key="handshake"
              mode="redirect"
              redirectHref={resolveRedirectHref(handshakePlan?.ctaHref)}
              redirectLabel={handshakePlan?.ctaLabel}
            />
          );
        }

        if (plan.billingType === "CUSTOM") {
          return (
            <EnterprisePlanCard
              key={plan.id}
              ctaLabel={plan.ctaLabel}
              ctaHref={plan.ctaHref}
            />
          );
        }

        if (mode === "billing" && onSubscribe) {
          return (
            <ProfessionalPlanCard
              key={plan.id}
              plan={plan}
              actionButton={
                <div className="w-full">
                  <HoverBorderGradient
                    as="button"
                    onClick={() => onSubscribe(plan.id)}
                    containerClassName="w-full"
                    className="bg-white text-primary flex items-center justify-center space-x-2 w-full py-4 font-bold cursor-pointer"
                  >
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    <span className="font-semibold">{plan.ctaLabel ?? "Get Started"}</span>
                  </HoverBorderGradient>
                </div>
              }
            />
          );
        }

        return (
          <ProfessionalPlanCard
            key={plan.id}
            plan={plan}
            ctaLabel={plan.ctaLabel ?? "Get Started"}
            ctaHref={resolveRedirectHref(plan.ctaHref)}
            actionButton={
              <div className="w-full">
                <Link href={resolveRedirectHref(plan.ctaHref)} className="w-full block">
                  <HoverBorderGradient
                    containerClassName="w-full"
                    className="bg-white text-primary flex items-center justify-center space-x-2 w-full py-4 font-bold cursor-pointer"
                  >
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    <span className="font-semibold">Get Started</span>
                  </HoverBorderGradient>
                </Link>
              </div>
            }
          />
        );
      })}
    </div>
  );
}
