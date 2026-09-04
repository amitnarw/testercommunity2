"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentProps,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PricingCardsGrid } from "./pricing-cards-grid";
import { getAllPricingPlans } from "@/lib/apiCalls";

gsap.registerPlugin(ScrollTrigger);

type Variant = NonNullable<ComponentProps<typeof PricingCardsGrid>["variant"]>;

export function HorizontalPinPricing({
  variant,
  className,
  mode,
  onSubscribe,
  showAllPlans,
}: {
  variant: Variant;
  className?: string;
  mode?: ComponentProps<typeof PricingCardsGrid>["mode"];
  onSubscribe?: ComponentProps<typeof PricingCardsGrid>["onSubscribe"];
  showAllPlans?: ComponentProps<typeof PricingCardsGrid>["showAllPlans"];
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { data: allPlans } = useQuery({
    queryKey: ["pricingPlansGrid"],
    queryFn: () => getAllPricingPlans(),
    staleTime: Infinity,
    retry: false,
  });

  const cardCount = useMemo(() => {
    if (!Array.isArray(allPlans)) return 0;
    return allPlans
      .filter((p) => p.isActive)
      .filter((p) => (showAllPlans ? true : p.id !== "handshake"))
      .length;
  }, [allPlans, showAllPlans]);

  const enableHorizontal = cardCount >= 2;

  useLayoutEffect(() => {
    if (!enableHorizontal) return;
    if (!sliderRef.current || !triggerRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(max-width: 767px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(
          ":scope > div > *",
          sliderRef.current!,
        );
        if (panels.length < 2) return;

        gsap.to(panels, {
          xPercent: -100 * Math.max(0, panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current!,
            start: "top top",
            pin: true,
            scrub: 0.1,
            end: () => "+=" + sliderRef.current!.offsetWidth,
            invalidateOnRefresh: true,
          },
        });
      });
    }, triggerRef);

    return () => ctx.revert();
  }, [enableHorizontal]);

  useEffect(() => {
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    if (typeof document !== "undefined") {
      ro.observe(document.documentElement);
    }
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={triggerRef} className={className}>
      <div
        ref={sliderRef}
        className={enableHorizontal ? "horizontal-pin-slider" : undefined}
      >
        <PricingCardsGrid
        variant={variant}
        mode={mode}
        onSubscribe={onSubscribe}
        showAllPlans={showAllPlans}
      />
      </div>
    </div>
  );
}
