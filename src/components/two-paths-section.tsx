"use client";

import Link from "next/link";
import { Check, Briefcase, Star, Zap, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { AutoTransitionLink } from "./auto-transition-link";
import { ProfessionalPlanCard } from "./pricing-cards";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/routes";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  // Common card components based on PricingCard design
  const cardClasses = (isPopular: boolean) =>
    cn(
      "relative flex flex-col p-6 sm:p-8 rounded-3xl h-full transition-all duration-300",
      isPopular
        ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30"
        : "border text-card-foreground hover:shadow-xl",
    );

  const FeatureItem = ({
    text,
    isPopular,
  }: {
    text: string;
    isPopular: boolean;
  }) => (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
          isPopular ? "bg-white/20" : "bg-primary/10",
        )}
      >
        <Check
          className={cn("w-3 h-3", isPopular ? "text-white" : "text-primary")}
        />
      </div>
      <span
        className={cn(
          "text-sm",
          isPopular ? "text-primary-foreground/90" : "text-muted-foreground",
        )}
      >
        {text}
      </span>
    </div>
  );


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
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-20"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
              Two Paths to Get{" "}
              <span className="text-primary italic">Your App</span> Tested
            </h2>
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
              Whether you want to contribute to a community or need guaranteed
              professional results, we have a solution that fits your needs.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile - Pinned Section */}
      <div ref={component} className="block md:hidden bg-background relative z-20 w-full py-10 overflow-hidden">
          <div className="flex justify-center mb-8">
            <div className="bg-secondary/50 p-1.5 rounded-full flex items-center relative gap-1 border border-border/50 backdrop-blur-sm">
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
                Free
              </button>
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
                Paid
              </button>
            </div>
          </div>
          <div ref={slider} className="flex w-fit will-change-transform">
            <div className="panel w-screen flex justify-center px-4 will-change-transform">
              <div className="w-full max-w-[90vw] transform-gpu">
                <ProfessionalPlanCard
                  comingSoon
                  accent="emerald"
                  accentIcon={<Handshake className="w-24 h-24 text-white" />}
                  description="Monthly barter subscription ,  publish your app and test others in return."
                  plan={{
                    id: "handshake",
                    name: "Handshake",
                    price: 99,
                    package: 1,
                    features: [
                      "Publish and join handshake tests",
                      "Gamified levels with more test slots",
                      "No per-tester points required",
                      "Barter-based, you test theirs, they test yours",
                    ],
                    billingType: "SUBSCRIPTION",
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                  actionButton={
                    <div className="w-full">
                      <AutoTransitionLink href={ROUTES.AUTHENTICATED.HANDSHAKE_TESTING} className="flex items-center justify-center w-full">
                        <HoverBorderGradient
                          as="div"
                          containerClassName="w-full"
                          className="bg-white text-emerald-600 flex justify-center items-center space-x-2 w-full py-4 font-bold cursor-pointer"
                        >
                          <Handshake className="w-4 h-4 mr-2" />
                          <span className="font-semibold">Explore Handshake Testing</span>
                        </HoverBorderGradient>
                      </AutoTransitionLink>
                    </div>
                  }
                />
              </div>
            </div>
            <div className="panel w-screen flex justify-center px-4 will-change-transform">
              <div className={cn(cardClasses(true), "w-full max-w-[90vw] transform-gpu")}>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-black/10 rounded-full blur-3xl pointer-events-none transform-gpu" />
                <div className="absolute top-6 right-6 opacity-20 rotate-12">
                  <Star className="w-24 h-24 fill-current text-white" />
                </div>
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <Badge className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg border-0">
                    Recommended
                  </Badge>
                </div>
                <div className="mb-8 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-white/20 rounded-xl">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-white">
                      The Professional Path
                    </h3>
                  </div>
                  <div className="mt-4 flex items-baseline">
<span className="text-4xl font-bold tracking-tight">₹999</span>
                    <span className="ml-2 text-sm font-medium text-primary-foreground/80">/ per project</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-primary-foreground/90">
                    Hire our professional testers for guaranteed, high-quality results.
                  </p>
                </div>
                <div className="flex-1 space-y-4 mb-8 relative z-10">
                  {["15-20 Days Testing Cycle", "15-25 Vetted Testers", "Google Play Production Answers", "Managed by inTesters Team", "Detailed Bug Reports", "Device & OS Coverage Stats", "Google Play Compliance Check"].map((feature, i) => (
                    <FeatureItem key={i} text={feature} isPopular={true} />
                  ))}
                </div>
                <div className="mt-auto relative z-10">
                  <Link href={ROUTES.PUBLIC.PRICING} className="w-full block">
                    <HoverBorderGradient containerClassName="w-full" className="bg-white text-primary flex items-center justify-center space-x-2 w-full py-4 font-bold">
                      <Zap className="w-4 h-4 mr-2 fill-current" />
                      <span className="font-semibold">View Packages</span>
                    </HoverBorderGradient>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          {/* Desktop Grid */}
          <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-stretch"
        >
          {/* Path 1: Handshake - Desktop Only */}
          <div className="h-full">
            <ProfessionalPlanCard
              comingSoon
              accent="emerald"
              accentIcon={<Handshake className="w-24 h-24 text-white" />}
              description="Monthly barter subscription ,  publish your app and test others in return."
              plan={{
                id: "handshake",
                name: "Handshake",
                price: 99,
                package: 1,
                features: [
                  "Publish and join handshake tests",
                  "Gamified levels with more test slots",
                  "No per-tester points required",
                  "Barter-based, you test theirs, they test yours",
                ],
                billingType: "SUBSCRIPTION",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
              actionButton={
                <div className="w-full">
                  <AutoTransitionLink href={ROUTES.AUTHENTICATED.HANDSHAKE_TESTING} className="flex items-center justify-center w-full">
                    <HoverBorderGradient
                      as="div"
                      containerClassName="w-full"
                      className="bg-white text-emerald-600 flex justify-center items-center space-x-2 w-full py-4 font-bold cursor-pointer"
                    >
                      <Handshake className="w-4 h-4 mr-2" />
                      <span className="font-semibold">Explore Handshake Testing</span>
                    </HoverBorderGradient>
                  </AutoTransitionLink>
                </div>
              }
            />
          </div>

          {/* Path 2: Professional (Popular Style) - Desktop Only */}
          <div className="h-full">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.05 }}
              className={cardClasses(true)}
            >
              <>
                <div className="absolute top-6 right-6 opacity-20 rotate-12">
                  <Star className="w-24 h-24 fill-current text-white" />
                </div>
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <Badge className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg border-0">
                    Recommended
                  </Badge>
                </div>
              </>
              <div className="mb-8 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-white/20 rounded-xl">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-white">
                    The Professional Path
                  </h3>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">₹999</span>
                  <span className="ml-2 text-sm font-medium text-primary-foreground/80">/ per project</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-primary-foreground/90">
                  Hire our professional testers for guaranteed, high-quality results.
                </p>
              </div>
              <div className="flex-1 space-y-4 mb-8 relative z-10">
                {["15-20 Days Testing Cycle", "15-25 Vetted Testers", "Google Play Production Answers", "Managed by inTesters Team", "Detailed Bug Reports", "Device & OS Coverage Stats", "Google Play Compliance Check"].map((feature, i) => (
                  <FeatureItem key={i} text={feature} isPopular={true} />
                ))}
              </div>
              <div className="mt-auto relative z-10">
                <Link href={ROUTES.PUBLIC.PRICING} className="w-full block">
                  <HoverBorderGradient containerClassName="w-full" className="bg-white text-primary flex items-center justify-center space-x-2 w-full py-4 font-bold">
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    <span className="font-semibold">View Packages</span>
                  </HoverBorderGradient>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
