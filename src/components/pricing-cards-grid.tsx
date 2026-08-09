"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { ProfessionalPlanCard } from "./pricing-cards";
import { HandshakePlanCard } from "./handshake/plan-card";
import { PricingResponse } from "@/lib/types";
import { ROUTES } from "@/lib/routes";
import { useQuery } from "@tanstack/react-query";
import { getAllPricingPlans } from "@/lib/apiCalls";

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

  const { data: allPlans } = useQuery<PricingResponse[]>({
    queryKey: ["pricingPlansGrid"],
    queryFn: () => getAllPricingPlans(),
    retry: false,
  });

  const includeEnterprise = variant !== "what-pro";

  const sortedPlans = React.useMemo(() => {
    const arr = Array.isArray(allPlans) ? allPlans : [];
    return [...arr]
      .filter((p) => p.isActive && (includeEnterprise ? true : p.billingType !== "CUSTOM"))
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  }, [allPlans, includeEnterprise]);

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
              redirectHref={resolveRedirectHref(plan.ctaHref)}
              redirectLabel={plan.ctaLabel}
            />
          );
        }

        const action = plan.buttonAction ?? "BUY";
        const ctaLabel = plan.ctaLabel ?? (action === "REDIRECT" ? "Learn More" : "Get Started");

        if (action === "NONE") {
          return (
            <ProfessionalPlanCard
              key={plan.id}
              plan={plan}
            />
          );
        }

        if (action === "REDIRECT") {
          return (
            <ProfessionalPlanCard
              key={plan.id}
              plan={plan}
              ctaLabel={ctaLabel}
              ctaHref={resolveRedirectHref(plan.ctaHref)}
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
                    <span className="font-semibold">{ctaLabel}</span>
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
            ctaLabel={ctaLabel}
            ctaHref={resolveRedirectHref(plan.ctaHref)}
          />
        );
      })}
    </div>
  );
}
