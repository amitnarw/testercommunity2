"use client";

import Link from "next/link";
import { Sparkles, Rocket } from "lucide-react";
import AnimatedRoundedButton from "@/components/ui/animated-rounded-button";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="w-full relative overflow-hidden bg-primary text-primary-foreground select-none flex flex-col items-center justify-center py-16 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay pointer-events-none data-[loc='cta-noise']" />

      {/* Dark & Glowy Spots */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-black/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-black/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-white/20 blur-[100px] rounded-full mix-blend-overlay" />
        <div className="absolute bottom-[20%] left-[20%] w-[200px] h-[200px] bg-white/10 blur-[80px] rounded-full mix-blend-overlay" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-6 md:space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white/10 text-white font-medium mb-1 border border-white/20 backdrop-blur-md shadow-lg shadow-black/5 hover:bg-white/20 transition-colors cursor-default">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span className="text-xs md:text-sm tracking-wide uppercase font-bold">
              Join 1000+ Developers
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight font-heading leading-tight drop-shadow-sm">
            Ready to <span className="opacity-90">Propel</span>{" "}
            <br className="hidden md:block" />
            <span className="relative inline-block">
              Your App to Success?
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-white/30"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 12 100 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </h2>

          <p className="text-base md:text-xl text-blue-50/90 max-w-xl mx-auto leading-relaxed font-light">
            Join the community of innovators building better apps, faster. Get
            verified feedback and clear Google Play requirements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 md:mt-8">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <AnimatedRoundedButton
                backgroundColor="white"
                animatedBackgroundColor="black"
                normalTextColor="hsl(var(--primary))"
                hoverTextColor="white"
                className="w-full"
                paddingX="6"
                paddingY="3"
                borderRadius="9999px"
              >
                <div className="flex items-center justify-center gap-2.5 font-bold text-base">
                  <span>Get Started Free</span>
                  <Rocket className="w-4 h-4" />
                </div>
              </AnimatedRoundedButton>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full h-12 px-6 border border-white/30 text-base bg-transparent hover:bg-white/10 text-white hover:text-white sm:min-w-[160px] transition-all hover:border-white/60 backdrop-blur-sm"
              asChild
            >
              <Link href="/community-dashboard">Explore Community</Link>
            </Button>
          </div>

          <div className="pt-8 md:pt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 opacity-60 mix-blend-overlay hover:opacity-100 transition-opacity duration-500">
            <span className="text-xs font-bold uppercase tracking-widest w-full sm:w-auto">
              Compatible with
            </span>
            <div className="hidden sm:block h-3 w-px bg-white/40" />
            <span className="font-bold text-sm md:text-base tracking-tight">
              Google Play
            </span>
            <span className="font-bold text-sm md:text-base tracking-tight">
              Android
            </span>
            <span className="font-bold text-sm md:text-base tracking-tight">
              Firebase
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
