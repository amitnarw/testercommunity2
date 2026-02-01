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
import { SamplesSection } from "@/components/samples-section";
import { HomeFaqSection } from "@/components/home-faq-section";
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
                Launch Your{" "}
                <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  Android App
                </span>{" "}
                <br className="hidden md:block" />
                in <span className="text-primary italic">14 Days</span> Flat
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

        {/* Interactive Samples Preview Section */}
        <SamplesSection />

        {/* Testimonials Section */}
        <SuccessStories />

        {/* Scrolling Ribbon Section */}
        <ScrollingRibbon />

        <TwoPathsSection />

        <div className="lg:w-[80%] lg:mx-auto">
          {/* FAQ Section */}
          <HomeFaqSection />
        </div>
        {/* CTA Section */}
        <CTASection />
      </main>
      <ScrollToTopButton />
    </div>
  );
}
