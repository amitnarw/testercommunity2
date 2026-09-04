"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { ProfessionalPlanCard } from "./pricing-cards";
import { PricingResponse } from "@/lib/types";
import { ROUTES } from "@/lib/routes";
import { useQuery } from "@tanstack/react-query";
import { getAllPricingPlans } from "@/lib/apiCalls";
import { authClient } from "@/lib/auth-client";

type PricingVariant = "home" | "pricing" | "billing" | "what-pro" | "seo";
type PricingMode = "billing" | "redirect";

type VariantStyle = { maxW: string };

const VARIANT_STYLES: Record<PricingVariant, VariantStyle> = {
  home: { maxW: "max-w-5xl" },
  pricing: { maxW: "max-w-6xl" },
  billing: { maxW: "max-w-6xl" },
  "what-pro": { maxW: "max-w-5xl" },
  seo: { maxW: "max-w-6xl" },
};

function responsiveMaxW(count: number, fallback: string): string {
  if (count <= 2) return "max-w-5xl";
  return fallback;
}

type Cta = { kind: "razorpay"; planId: string } | { kind: "link"; href: string };

function resolvePlanCta(
  plan: PricingResponse,
  pathname: string,
  isLoggedIn: boolean,
): Cta {
  // Enterprise (CUSTOM) ,  always uses admin-configured href if set
  if (
    plan.billingType === "CUSTOM" &&
    plan.ctaHref &&
    plan.ctaHref.trim().length > 0
  ) {
    return { kind: "link", href: plan.ctaHref };
  }

  // REDIRECT plans ,  admin href if set
  if (
    plan.buttonAction === "REDIRECT" &&
    plan.ctaHref &&
    plan.ctaHref.trim().length > 0
  ) {
    return { kind: "link", href: plan.ctaHref };
  }

  const isPaid =
    plan.billingType === "ONE_TIME" || plan.billingType === "SUBSCRIPTION";

  // /billing ,  Razorpay for paid, link for free
  if (pathname === "/billing") {
    if (isPaid) return { kind: "razorpay", planId: plan.id };
    return {
      kind: "link",
      href: isLoggedIn
        ? ROUTES.AUTHENTICATED.HANDSHAKE_TESTING
        : ROUTES.AUTH.LOGIN,
    };
  }

  // Other pages ,  link only, no Razorpay
  if (isPaid) {
    return {
      kind: "link",
      href: isLoggedIn ? ROUTES.AUTHENTICATED.BILLING : ROUTES.PUBLIC.PRICING,
    };
  }
  return {
    kind: "link",
    href: isLoggedIn
      ? ROUTES.AUTHENTICATED.HANDSHAKE_TESTING
      : ROUTES.AUTH.LOGIN,
  };
}

export function PricingCardsGrid({
  variant = "pricing",
  className = "",
  mode = "redirect",
  onSubscribe,
  showAllPlans = false,
}: {
  variant?: PricingVariant;
  className?: string;
  mode?: PricingMode;
  onSubscribe?: (planId: string) => void;
  showAllPlans?: boolean;
}) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  const { data: allPlans } = useQuery<PricingResponse[]>({
    queryKey: ["pricingPlansGrid"],
    queryFn: () => getAllPricingPlans(),
    retry: false,
  });

  const sortedPlans = React.useMemo(() => {
    const arr = Array.isArray(allPlans) ? allPlans : [];
    return [...arr]
      .filter((p) => p.isActive)
      .filter((p) => (showAllPlans ? true : p.id !== "handshake"))
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  }, [allPlans, showAllPlans]);

  if (sortedPlans.length === 0) return null;

  const style = VARIANT_STYLES[variant] ?? VARIANT_STYLES.pricing;
  const maxW = responsiveMaxW(sortedPlans.length, style.maxW);

  return (
    <div
      className={`pricing-grid grid gap-4 items-stretch mx-auto ${maxW} ${className}`}
      style={{ "--pricing-count": sortedPlans.length } as React.CSSProperties}
    >
      {sortedPlans.map((plan) => {
        const cta = resolvePlanCta(plan, pathname ?? "", isLoggedIn);
        const action = plan.buttonAction ?? "BUY";
        const ctaLabel =
          plan.ctaLabel ?? (action === "REDIRECT" ? "Learn More" : "Get Started");

        if (cta.kind === "razorpay") {
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
          return null;
        }

        return (
          <ProfessionalPlanCard
            key={plan.id}
            plan={plan}
            ctaLabel={ctaLabel}
            ctaHref={cta.href}
          />
        );
      })}
    </div>
  );
}
