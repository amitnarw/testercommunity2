"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { ScrollingRibbon } from "@/components/scrolling-ribbon";
import React from "react";
import { SuccessStories } from "@/components/success-stories";
import { GlobalImpactSection } from "@/components/global-impact-section";
import { FaqSection } from "@/components/faq-section";
import { TwoPathsSection } from "@/components/two-paths-section";
import { MagneticButton } from "@/components/magnetic-button";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { CTASection } from "@/components/cta-section";
import { motion } from "framer-motion";
import {
  Users,
  Zap,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Tester Hub",
    headline: "The Power of Community",
    description:
      "Earn credits by testing others' apps. A completely free, collaborative way to meet Google's 12-tester requirement.",
    link: "/community-dashboard",
    icon: Users,
    label: "Free / Community",
    color: "blue",
    size: "large",
    bgClass: "from-blue-500/10 to-transparent",
    hoverBg: "group-hover:from-blue-500/20 group-hover:to-blue-500/10",
    accentColor: "text-blue-500",
    borderColor: "border-blue-500/10 group-hover:border-blue-500/30",
  },
  {
    title: "Pro Managed",
    headline: "Guaranteed Compliance",
    description:
      "Skip the grind. Professional testers provide 14 days of deep engagement and verified audit logs.",
    link: "/auth/register",
    icon: Zap,
    label: "Pro Tier",
    color: "amber",
    featured: true,
    bgClass: "from-amber-500/10 to-transparent",
    hoverBg: "group-hover:from-amber-500/20 group-hover:to-amber-500/10",
    accentColor: "text-amber-500",
    borderColor: "border-amber-500/20 group-hover:border-amber-500/40",
  },
  {
    title: "Real Feedback",
    headline: "Human-First Insights",
    description:
      "Get authentic bug reports and UX suggestions that automated bots simply can't provide.",
    link: "/community-dashboard",
    icon: MessageSquare,
    label: "Core Value",
    color: "purple",
    bgClass: "from-purple-500/10 to-transparent",
    hoverBg: "group-hover:from-purple-500/20 group-hover:to-purple-500/10",
    accentColor: "text-purple-500",
    borderColor: "border-purple-500/10 group-hover:border-purple-500/30",
  },
  {
    title: "Instant Logs",
    headline: "Audit Ready",
    description:
      "Export full testing history to simplify your Google Play review. One click and you're ready for production.",
    link: "/auth/register",
    icon: ShieldCheck,
    label: "Outcome",
    color: "emerald",
    bgClass: "from-emerald-500/10 to-transparent",
    hoverBg: "group-hover:from-emerald-500/20 group-hover:to-emerald-500/10",
    accentColor: "text-emerald-500",
    borderColor: "border-emerald-500/10 group-hover:border-emerald-500/30",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section
          data-loc="HomePage-HeroSection"
          className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24"
        >
          <div className="absolute inset-0 bg-dot-pattern z-0"></div>
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <HoverBorderGradient
                containerClassName="rounded-full m-auto mb-5 sm:mb-10"
                as="button"
                className="dark:bg-black text-[10px] sm:text-xs bg-white text-black dark:text-white flex items-center space-x-2"
              >
                <BadgeCheck className="w-4 h-4 mr-2 text-primary" />
                <span>Built for Google's 12-Tester Requirement.</span>
              </HoverBorderGradient>
              <h1 className="text-[1.85rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] font-heading leading-[1.2] md:leading-[1.1] tracking-tight font-bold mb-5 sm:mb-8 text-center mx-auto max-w-[900px]">
                Launch Your Android App <br className="hidden md:block" />
                <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  in 14 Days Flat
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-body max-w-xs sm:max-w-md md:max-w-lg lg:max-w-[700px] mx-auto mb-8 text-muted-foreground">
                Earn points to test your app for free in our Community Hub, or
                upgrade to Pro for guaranteed, professional results.
              </p>
              <div className="mt-5 inline-block p-4">
                <MagneticButton>
                  <Button
                    asChild
                    size="lg"
                    variant="default"
                    className="group text-sm sm:text-base px-4 sm:px-6 sm:pr-3 py-6 sm:py-7 rounded-full shadow-lg shadow-primary/30"
                  >
                    <Link href="/auth/register">
                      <span className="relative z-10 font-bold">
                        Get Started for Free
                      </span>
                      <div className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/20 group-hover:bg-black dark:group-hover:bg-white transition-all duration-500 group-hover:scale-[2] ml-3 sm:ml-4">
                        <ChevronRight className="w-4 h-4 text-primary-foreground group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                      </div>
                    </Link>
                  </Button>
                </MagneticButton>
              </div>

              <div className="w-full max-w-[700px] overflow-hidden m-auto mt-12 sm:mt-20 md:mt-40">
                <Image
                  src={"/dark-mac.png"}
                  alt="App Testing Platform"
                  width={"900"}
                  height={"600"}
                  decoding="async"
                  data-nimg="1"
                  className="w-full h-auto hidden dark:block"
                ></Image>
                <Image
                  src={"/light-mac.png"}
                  alt="App Testing Platform"
                  width={"900"}
                  height={"600"}
                  decoding="async"
                  data-nimg="1"
                  className="w-full h-auto dark:hidden block"
                ></Image>
              </div>
            </div>
          </div>
        </section>

        {/* Global Impact Section */}
        <GlobalImpactSection />

        <div className="lg:w-[90%] lg:mx-auto">
          {/* Bento Features Section */}
          <section
            data-loc="HomePage-FeaturesSection"
            className="py-10 md:py-28 bg-background relative overflow-hidden"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12">
                <div className="max-w-xl">
                  <h2 className="text-2xl md:text-5xl font-bold font-heading tracking-tight leading-none mb-3 md:mb-4">
                    The <span className="text-primary italic mr-2">Right</span>{" "}
                    Way <br className="hidden md:block" /> to Launch.
                  </h2>
                  <p className="text-muted-foreground text-xs md:text-base max-w-lg">
                    Whether you're bootstrapping with our community or scaling
                    with professionals, we provide the activity and feedback
                    Google demands.
                  </p>
                </div>
                <div className="hidden md:block">
                  <Link
                    href="/auth/register"
                    className="group flex items-center gap-2 text-sm font-bold"
                  >
                    Explore All Plans{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 md:gap-4">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl md:rounded-3xl border bg-card p-4 md:p-8 flex flex-col justify-between transition-all duration-300",
                      "hover:-translate-y-1 hover:shadow-xl",
                      feature.borderColor,
                      feature.size === "large"
                        ? "col-span-12 md:col-span-6 lg:col-span-7"
                        : "col-span-6 md:col-span-3 lg:col-span-5",
                      i === 1 && "lg:col-span-5",
                      i === 2 && "lg:col-span-4",
                      i === 3 && "lg:col-span-3",
                    )}
                  >
                    {/* Dynamic Background Gradient */}
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br transition-all duration-500 opacity-70 group-hover:opacity-100",
                        feature.bgClass,
                        feature.hoverBg,
                      )}
                    />

                    {/* Noise Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4 md:mb-8">
                        <div
                          className={cn(
                            "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shadow-sm border transition-all duration-300",
                            feature.color === "blue" &&
                              "bg-blue-500/20 text-blue-500 border-blue-500/30",
                            feature.color === "amber" &&
                              "bg-amber-500/20 text-amber-500 border-amber-500/30",
                            feature.color === "purple" &&
                              "bg-purple-500/20 text-purple-500 border-purple-500/30",
                            feature.color === "emerald" &&
                              "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
                          )}
                        >
                          <feature.icon className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                          {feature.label}
                        </span>
                      </div>

                      <div className="space-y-1 md:space-y-2 mb-3 md:mb-6">
                        <h3
                          className={cn(
                            "text-sm md:text-xl font-bold tracking-tight transition-colors duration-300",
                            feature.accentColor,
                          )}
                        >
                          {feature.title}
                        </h3>
                        <p className="text-xs md:text-lg font-medium text-foreground/90 leading-tight">
                          {feature.headline}
                        </p>
                      </div>

                      <p className="text-[10px] md:text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">
                        {feature.description}
                      </p>
                    </div>

                    <div className="relative z-10 mt-auto pt-3 md:pt-6 flex items-center justify-between border-t border-border/50 md:border-0 border-dashed">
                      <Link
                        href={feature.link}
                        className="text-[10px] md:text-xs font-bold flex items-center gap-1 group/btn"
                      >
                        Action{" "}
                        <ArrowUpRight className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    {/* Subtle Hover Gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Testimonials Section */}
        <SuccessStories />

        {/* Scrolling Ribbon Section */}
        <ScrollingRibbon />

        <TwoPathsSection />

        <div className="lg:w-[80%] lg:mx-auto">
          {/* FAQ Section */}
          <section
            data-loc="HomePage-FAQSection"
            id="faq"
            className="py-20 md:py-28 bg-background"
          >
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold font-heading">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Have questions? We have answers. For more detailed
                  information, check out our full FAQ page.
                </p>
              </div>

              <div className="mt-12 max-w-3xl mx-auto">
                <FaqSection />
                <div className="mt-8 text-center">
                  <Button asChild variant="outline">
                    <Link href="/faq">
                      View All FAQs <ChevronRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* CTA Section */}
        <CTASection />
      </main>
      <ScrollToTopButton />
    </div>
  );
}
