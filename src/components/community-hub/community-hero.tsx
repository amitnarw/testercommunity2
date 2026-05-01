"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { MagneticButton } from "@/components/magnetic-button";
import { AutoTransitionLink } from "@/components/auto-transition-link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronRight,
  Coins,
  ArrowRight,
} from "lucide-react";

export function CommunityHero() {
  return (
    <section
      data-loc="CommunityHub-HeroSection"
      className="relative w-full py-12 sm:py-16 md:py-20 lg:py-28"
    >
      <div className="absolute inset-0 bg-dot-pattern z-0" />
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <HoverBorderGradient
            containerClassName="rounded-full m-auto mb-5 sm:mb-10"
            as="button"
            className="dark:bg-black text-[10px] sm:text-xs bg-white text-black dark:text-white flex items-center space-x-2"
          >
            <Coins className="w-4 h-4 mr-2 text-primary" />
            <span>Built for the Community, By the Community</span>
          </HoverBorderGradient>

          <h1 className="text-[1.85rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] font-heading leading-[1.2] md:leading-[1.1] tracking-tight font-bold mb-5 sm:mb-8 text-center mx-auto max-w-[900px]">
            Guaranteed{" "}
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              12 Testers
            </span>{" "}
            within 12 Hours for <span className="text-primary italic">Free</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg font-body max-w-xs sm:max-w-md md:max-w-lg lg:max-w-[700px] mx-auto mb-8 text-muted-foreground">
            Join a reciprocal community where you test apps to earn points, then
            use those points to get your own app tested — completely free.
          </p>

          <div className="mt-5 inline-block p-4">
            <MagneticButton>
              <Button
                asChild
                size="lg"
                variant="default"
                className="group text-sm sm:text-base px-4 sm:px-6 sm:pr-3 py-6 sm:py-7 rounded-full shadow-lg shadow-primary/30"
              >
                <AutoTransitionLink href="/auth/register">
                  <span className="relative z-10 font-bold">
                    Start Earning Points
                  </span>
                  <div className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/20 group-hover:bg-black dark:group-hover:bg-white transition-all duration-500 group-hover:scale-[2] ml-3 sm:ml-4">
                    <ChevronRight className="w-4 h-4 text-primary-foreground group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                  </div>
                </AutoTransitionLink>
              </Button>
            </MagneticButton>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="link" asChild className="text-muted-foreground">
              <AutoTransitionLink href="#how-it-works">
                See How It Works <ArrowRight className="w-4 h-4 ml-1" />
              </AutoTransitionLink>
            </Button>
            <span className="hidden sm:block text-muted-foreground/30">|</span>
            <Button variant="link" asChild className="text-muted-foreground">
              <AutoTransitionLink href="/community-dashboard">
                Browse Community Hub <ArrowRight className="w-4 h-4 ml-1" />
              </AutoTransitionLink>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
