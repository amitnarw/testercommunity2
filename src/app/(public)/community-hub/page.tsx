"use client";

import { AutoTransitionLink } from "@/components/auto-transition-link";
import dynamic from "next/dynamic";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import AnimatedRoundedButton from "@/components/ui/animated-rounded-button";
import { Button } from "@/components/ui/button";

const CommunityHero = dynamic(() =>
  import("@/components/community-hub/community-hero").then(
    (mod) => mod.CommunityHero,
  ),
);

const HowItWorks = dynamic(() =>
  import("@/components/community-hub/how-it-works").then(
    (mod) => mod.HowItWorks,
  ),
);

const CommunityStats = dynamic(() =>
  import("@/components/community-hub/community-stats").then(
    (mod) => mod.CommunityStats,
  ),
);

const PointsFormula = dynamic(() =>
  import("@/components/community-hub/points-formula").then(
    (mod) => mod.PointsFormula,
  ),
);

const MemberBenefits = dynamic(() =>
  import("@/components/community-hub/member-benefits").then(
    (mod) => mod.MemberBenefits,
  ),
);

const CommunityTestimonials = dynamic(() =>
  import("@/components/community-hub/community-testimonials").then(
    (mod) => mod.CommunityTestimonials,
  ),
);

const ScrollingRibbon = dynamic(() =>
  import("@/components/scrolling-ribbon").then((mod) => mod.ScrollingRibbon),
);

const CommunityFaqSection = dynamic(() =>
  import("@/components/community-hub/community-faq-section").then(
    (mod) => mod.CommunityFaqSection,
  ),
);

function CommunityCTASection() {
  return (
    <section className="w-full relative overflow-hidden bg-primary text-primary-foreground select-none flex flex-col items-center justify-center min-h-screen">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay pointer-events-none" />

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
            <Users className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span className="text-xs md:text-sm tracking-wide uppercase font-bold">
              Join 500+ Community Testers
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight font-heading leading-tight drop-shadow-sm">
            Ready to Join the{" "}
            <br className="hidden md:block" />
            <span className="relative inline-block">
              Community?
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
            Start earning points today by testing apps. Use those points to get
            your own app tested — completely free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 md:mt-8">
            <AutoTransitionLink href="/auth/register" className="w-full sm:w-auto">
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
                  <span>Start Earning Points</span>
                </div>
              </AnimatedRoundedButton>
            </AutoTransitionLink>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full h-12 px-6 border border-white/30 text-base bg-transparent hover:bg-white/10 text-white hover:text-white sm:min-w-[160px] transition-all hover:border-white/60 backdrop-blur-sm"
              asChild
            >
              <AutoTransitionLink href="/community-dashboard">
                Explore Community Hub
              </AutoTransitionLink>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function CommunityHubPage() {
  return (
    <>
      <CommunityHero />
      <CommunityStats />
      <HowItWorks />
      <PointsFormula />
      <MemberBenefits />
      <CommunityTestimonials />
      <ScrollingRibbon />
      <CommunityFaqSection />
      <CommunityCTASection />
      <ScrollToTopButton />
    </>
  );
}
