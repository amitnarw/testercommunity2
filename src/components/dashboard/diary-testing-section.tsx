"use client";

import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/transition-link";
import { ROUTES } from "@/lib/routes";
import { usePricingData, useRegionalPricing } from "@/hooks/useUser";
import { PremiumAppCard } from "@/components/dashboard/premium-app-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { HubSubmittedAppResponse } from "@/lib/types";

export function DiaryTestingSection({
  proApps,
  proLoading,
  proCount,
  freeApps,
  freeLoading,
  freeCount,
}: {
  proApps: HubSubmittedAppResponse[] | undefined;
  proLoading: boolean;
  proCount: number;
  freeApps: HubSubmittedAppResponse[] | undefined;
  freeLoading: boolean;
  freeCount: number;
}) {
  return (
    <section className="mb-20">
      <div className="relative rounded-[2.5rem] flex flex-col md:flex-row gap-4 items-stretch justify-center overflow-hidden">
        {/* Left Card: Free Testing */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-card dark:via-card/50 dark:to-card rounded-[32px] p-8 md:p-10 pb-14 md:pb-10 flex-1 relative border border-slate-200/60 dark:border-border/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-slate-800 dark:text-foreground z-0">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-foreground leading-[1.1] tracking-tight mb-8">
            Free Testing
          </h2>

          {freeLoading ? (
            <LoadingCards />
          ) : freeApps && freeApps.length > 0 ? (
            <div className="space-y-3">
              {freeApps.slice(0, 3).map((app, i) => (
                <PremiumAppCard key={app.id} app={app} type="FREE" index={i} />
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm lg:text-base text-slate-500 dark:text-white/50 mb-8 max-w-md leading-relaxed">
                Test your app with the community at no cost. But will be always
                Free Forever!!!
              </p>

              <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-foreground">Limitations</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {[
                  "Test others first (20+ hrs)",
                  "Variable results",
                  "No bug reports",
                  "No device coverage",
                  "Self-managed",
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-400 stroke-[3]" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-white/60 font-medium leading-snug">
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Mobile */}
              <div className="mt-8 md:hidden">
                <Button
                  asChild
                  className="w-full rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-white/90 font-semibold h-12"
                >
                  <TransitionLink href="/app/free-testing/submit">
                    Submit Free App
                  </TransitionLink>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Right Card: Pro Testing */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-card dark:via-card/50 dark:to-card rounded-[32px] p-8 md:p-10 pt-14 md:pt-10 flex-1 relative border border-slate-200/60 dark:border-border/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-slate-800 dark:text-foreground z-0 flex flex-col items-center justify-start text-center">
          {proLoading ? (
            <div className="w-full text-left">
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-foreground leading-[1.1] tracking-tight mb-8 text-center">
                Pro Testing
              </h2>
              <LoadingCards />
            </div>
          ) : proApps && proApps.length > 0 ? (
            <div className="w-full text-left pl-0 sm:pl-5">
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-foreground leading-[1.1] tracking-tight mb-4">
                Pro Testing
              </h2>
              <div className="space-y-3">
                {proApps.slice(0, 3).map((app, i) => (
                  <PremiumAppCard
                    key={app.id}
                    app={app}
                    type="PAID"
                    index={i}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-foreground leading-[1.1] tracking-tight mb-8">
                Pro Testing
              </h2>

              <ProPricingDisplay />

              <Button
                asChild
                className="w-full max-w-[280px] rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base lg:text-lg h-14 mb-6 transition-all hover:scale-105 shadow-lg shadow-primary/20"
              >
                <TransitionLink
                  href={ROUTES.AUTHENTICATED.BILLING}
                  className="flex items-center justify-center gap-2"
                >
                  Get Access <ArrowRight className="w-5 h-5" />
                </TransitionLink>
              </Button>

              <p className="text-sm text-slate-500 dark:text-white/50 max-w-xs leading-relaxed">
                Get matched with 20+ vetted testers and meet Google Play&apos;s
                12-tester requirement in days.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ProPricingDisplay() {
  const { data: pricingPlans } = usePricingData();
  const { data: regionalPricing } = useRegionalPricing();

  const cheapestPlan = pricingPlans?.length
    ? pricingPlans.reduce(
        (min, p) => (p.price < min.price ? p : min),
        pricingPlans[0],
      )
    : null;

  const displaySymbol = regionalPricing?.currency_symbol || "$";
  const displayPrice = regionalPricing
    ? Math.round(regionalPricing.amount / 100)
    : cheapestPlan
      ? cheapestPlan.price
      : 34;

  return (
    <div className="mb-8 flex items-baseline justify-center gap-2">
      <span className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-foreground tracking-tighter">
        {displaySymbol}
        {displayPrice}.00
      </span>
      <span className="text-xl lg:text-3xl font-bold text-slate-400 dark:text-muted-foreground/30">
        {regionalPricing?.currency_code || "USD"}
      </span>
    </div>
  );
}

function LoadingCards() {
  return (
    <div className="space-y-2 w-full">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 rounded-2xl bg-slate-200/50 dark:bg-white/[0.04] w-full" />
      ))}
    </div>
  );
}
