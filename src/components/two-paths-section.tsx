"use client";

import Link from "next/link";
import { Check, X, Users, Briefcase, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/routes";
import { useState, useRef, useLayoutEffect } from "react";
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
    const panels = gsap.utils.toArray<HTMLDivElement>(".panel", slider.current!);
    if (panels.length < 2) return;

    const ctx = gsap.context(() => {
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: component.current,
          pin: true,
          scrub: 1,
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
    }, component);

    return () => ctx.revert();
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

  const ConItem = ({ text }: { text: string }) => (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-destructive/10">
        <X className="w-3 h-3 text-destructive" />
      </div>
      <span className="text-sm text-muted-foreground/80">{text}</span>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      data-loc="TwoPathsSection"
      className="relative py-10 md:py-32 overflow-hidden flex flex-col justify-center"
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

        {/* Mobile - Pinned Section */}
        <div ref={component} className="block md:hidden">
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
          <div ref={slider} className="flex w-fit gap-4">
            <div className="panel w-[90vw]">
              <div className={cardClasses(false)}>
                <div className="mb-8 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium text-foreground">
                      Free Testing Path
                    </h3>
                  </div>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight">Free</span>
                    <span className="ml-2 text-sm font-medium text-muted-foreground">/ forever</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Test apps, earn points, and get your app tested by the community.
                  </p>
                </div>
                <div className="flex-1 space-y-4 mb-8 relative z-10">
                  <div className="space-y-3">
                    {['Reciprocal "give-to-get" model', "Earn points for testing other apps", "Access a diverse pool of real users"].map((feature, i) => (
                      <FeatureItem key={i} text={feature} isPopular={false} />
                    ))}
                  </div>
                  <div className="border-t border-border/50 pt-4 mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-destructive mb-3">Limitations</p>
                    {["You must test other apps first to earn points", "No guaranteed timeline, depends on community availability", "Testers are volunteers, not vetted professionals", "No Google Play compliance support included"].map((con, i) => (
                      <div className="mb-3 last:mb-0" key={i}>
                        <ConItem text={con} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-auto relative z-10">
                  <Link href={ROUTES.AUTHENTICATED.FREE_TESTING} className="w-full block">
                    <Button className="w-full py-6 rounded-full font-semibold text-base transition-all duration-300" variant="outline">
                      Explore Free Testing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="panel w-[90vw]">
              <div className={cardClasses(true)}>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-black/10 rounded-full blur-3xl pointer-events-none" />
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
                    <span className="text-4xl font-bold tracking-tight">Paid</span>
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

        {/* Desktop Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-stretch"
        >
          {/* Path 1: Free (Standard Style) - Desktop Only */}
          <div className="h-full">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={cardClasses(false)}
            >
              <div className="mb-8 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium text-foreground">
                    The Free Path
                  </h3>
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">Free</span>
                  <span className="ml-2 text-sm font-medium text-muted-foreground">/ forever</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Test apps, earn points, and get your app tested by the community.
                </p>
              </div>
              <div className="flex-1 space-y-4 mb-8 relative z-10">
                <div className="space-y-3">
                  {['Reciprocal "give-to-get" model', "Earn points for testing other apps", "Access a diverse pool of real users"].map((feature, i) => (
                    <FeatureItem key={i} text={feature} isPopular={false} />
                  ))}
                </div>
                <div className="border-t border-border/50 pt-4 mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-destructive mb-3">Limitations</p>
                  {["You must test other apps first to earn points", "No guaranteed timeline, depends on community availability", "Testers are volunteers, not vetted professionals", "No Google Play compliance support included"].map((con, i) => (
                    <div className="mb-3 last:mb-0" key={i}>
                      <ConItem text={con} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-auto relative z-10">
                <Link href={ROUTES.AUTHENTICATED.FREE_TESTING} className="w-full block">
                  <Button className="w-full py-6 rounded-full font-semibold text-base transition-all duration-300" variant="outline">
                    Explore Free Testing
                  </Button>
                </Link>
              </div>
            </motion.div>
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
                  <span className="text-4xl font-bold tracking-tight">Paid</span>
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
