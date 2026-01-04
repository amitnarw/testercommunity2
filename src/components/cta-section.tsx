"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import AnimatedRoundedButton from "@/components/ui/animated-rounded-button";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -skew-y-2 transform origin-bottom-right scale-110" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">
              Join 1000+ Developers
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-heading">
            Ready to{" "}
            <span className="text-primary relative inline-block">
              Propel
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-primary/30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>{" "}
            Your App to Success?
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join the community of innovators who are building better apps,
            faster. Get verified feedback, clear Google Play requirements, and
            launch with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/auth/register">
              <AnimatedRoundedButton
                backgroundColor="hsl(var(--primary))"
                normalTextColor="white"
                hoverTextColor="white"
                className="min-w-[200px] shadow-xl shadow-primary/20"
                paddingX="8"
                paddingY="4"
              >
                <div className="flex items-center gap-2 font-bold text-lg">
                  <span>Get Started Free</span>
                  <Rocket className="w-5 h-5" />
                </div>
              </AnimatedRoundedButton>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full h-14 px-8 border-2 text-lg hover:bg-secondary/50 min-w-[200px]"
              asChild
            >
              <Link href="/community-dashboard">Explore Community</Link>
            </Button>
          </div>

          <div className="pt-8 flex items-center justify-center gap-8 text-muted-foreground opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-sm font-semibold">Compatible with</span>
            {/* Simple text representation for logos to keep it clean, or could be replaced with icons */}
            <span className="font-bold">Google Play</span>
            <span className="font-bold">Android</span>
            <span className="font-bold">Firebase</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
