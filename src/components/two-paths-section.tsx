"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { ProfessionalPlanCard } from "./pricing-cards";
import { ROUTES } from "@/lib/routes";
import { useQuery } from "@tanstack/react-query";
import { getAllPricingPlans } from "@/lib/apiCalls";
import { PricingResponse } from "@/lib/types";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function TwoPathsSection() {
  const [activeTab, setActiveTab] = useState<"community" | "professional">(
    "community",
  );

  const sectionRef = useRef<HTMLElement>(null);
  const component = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const lastTabRef = useRef<"community" | "professional">("community");

  const { data: proPlans } = useQuery<PricingResponse[]>({
    queryKey: ["pricingPlansTwoPaths"],
    queryFn: () => getAllPricingPlans(),
    retry: false,
  });

  const proPlan =
    proPlans?.find((p) => p.id !== "handshake" && p.isPopular) ??
    proPlans?.find((p) => p.id !== "handshake") ??
    null;

  const hasPro = !!proPlan;

  useLayoutEffect(() => {
    if (!hasPro) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(max-width: 767px)", () => {
        const panels = gsap.utils.toArray<HTMLDivElement>(".panel", slider.current!);
        if (panels.length < 1) return;

        gsap.to(panels, {
          xPercent: -100 * Math.max(0, panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: component.current,
            start: "top top",
            pin: true,
            scrub: 0.1,
            snap: 1 / Math.max(1, panels.length),
            end: () => "+=" + slider.current?.offsetWidth,
            onUpdate: (self) => {
              const next = self.progress > 0.5 ? "professional" : "community";
              if (next !== lastTabRef.current) {
                lastTabRef.current = next;
                setActiveTab(next);
              }
            },
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [hasPro]);

  useEffect(() => {
    // Fix GSAP trigger recalculation for dynamic imports
    const ro = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    if (typeof document !== "undefined") {
      ro.observe(document.documentElement);
    }
    return () => ro.disconnect();
  }, []);

  const ProCard = () =>
    proPlan ? (
      <ProfessionalPlanCard
        plan={proPlan}
        ctaLabel={proPlan.ctaLabel}
        ctaHref={proPlan.ctaHref}
        actionButton={
          <div className="w-full">
            <Link href={ROUTES.PUBLIC.PRICING} className="w-full block">
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
    ) : null;

  if (!hasPro) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      data-loc="TwoPathsSection"
      className="relative py-10 md:py-32 bg-background"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
            Two Paths to Get{" "}
            <span className="text-primary italic">Your App</span> Tested
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
            Handshake Testing is free for everyone. Choose Professional Testing
            for guaranteed paid results.
          </p>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-4xl">
        <div className="grid gap-5 items-stretch">
          <ProCard />
        </div>
      </div>
    </section>
  );
}
