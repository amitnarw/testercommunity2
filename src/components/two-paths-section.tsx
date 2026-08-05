"use client";

import Link from "next/link";
import { Zap, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { ProfessionalPlanCard } from "./pricing-cards";
import { HandshakePlanCard } from "./handshake/plan-card";
import { ROUTES } from "@/lib/routes";
import { useQuery } from "@tanstack/react-query";
import { getHandshakePlan, getAllPricingPlans } from "@/lib/apiCalls";
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

  const { data: handshakePlan } = useQuery<PricingResponse | null>({
    queryKey: ["handshakePlan"],
    queryFn: () => getHandshakePlan(),
    retry: false,
  });

  const { data: proPlans } = useQuery<PricingResponse[]>({
    queryKey: ["pricingPlansTwoPaths"],
    queryFn: () => getAllPricingPlans(),
    retry: false,
  });

  const proPlan =
    proPlans?.find((p) => p.id !== "handshake" && p.isPopular) ??
    proPlans?.find((p) => p.id !== "handshake") ??
    null;

  const hasHandshake = !!handshakePlan;
  const hasPro = !!proPlan;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();
      mm.add("(max-width: 767px)", () => {
        const panels = gsap.utils.toArray<HTMLDivElement>(".panel", slider.current!);
        if (panels.length < 2) return;

        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: component.current,
            start: "top top",
            pin: true,
            scrub: 0.1,
            snap: 1 / (panels.length - 1),
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
  }, []);

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

  if (!hasHandshake && !hasPro) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      data-loc="TwoPathsSection"
      className="relative py-10 md:py-32 bg-background"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
            Two Paths to Get{" "}
            <span className="text-primary italic">Your App</span> Tested
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
            Whether you want to contribute to a community or need guaranteed
            professional results, we have a solution that fits your needs.
          </p>
        </div>
      </div>

      {/* Mobile - Pinned Section */}
      <div ref={component} className="block md:hidden bg-background relative z-20 w-full py-10 overflow-hidden">
          <div className="flex justify-center mb-8">
            <div className="bg-secondary/50 p-1.5 rounded-full flex items-center relative gap-1 border border-border/50 backdrop-blur-sm">
              {hasHandshake && (
                <button
                  onClick={() => {
                    setActiveTab("community");
                    const st = ScrollTrigger.getAll().find(s => s.trigger === component.current);
                    if (st) window.scrollTo({ top: st.start, behavior: "smooth" });
                  }}
                  className={cn(
                    "px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative z-10",
                    activeTab === "community"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Handshake
                </button>
              )}
              {hasPro && (
                <button
                  onClick={() => {
                    setActiveTab("professional");
                    const st = ScrollTrigger.getAll().find(s => s.trigger === component.current);
                    if (st) window.scrollTo({ top: st.end - 50, behavior: "smooth" });
                  }}
                  className={cn(
                    "px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative z-10",
                    activeTab === "professional"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Pro
                </button>
              )}
            </div>
          </div>
          <div ref={slider} className="flex w-fit will-change-transform">
            {hasHandshake && (
              <div className="panel w-screen flex justify-center px-4 will-change-transform">
                <div className="w-full max-w-[90vw] transform-gpu">
                  <HandshakePlanCard />
                </div>
              </div>
            )}
            {hasPro && (
              <div className="panel w-screen flex justify-center px-4 will-change-transform">
                <div className="w-full max-w-[90vw] transform-gpu">
                  <ProCard />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          {/* Desktop Grid */}
          <div
            className={cn(
              "hidden md:grid gap-5 max-w-4xl mx-auto items-stretch",
              hasHandshake && hasPro ? "md:grid-cols-2" : "md:grid-cols-1 max-w-md",
            )}
          >
            {hasHandshake && (
              <div className="h-full">
                <HandshakePlanCard />
              </div>
            )}

            {hasPro && (
              <div className="h-full">
                <ProCard />
              </div>
            )}
          </div>
        </div>
    </section>
  );
}
