"use client";

import { AutoTransitionLink } from "@/components/auto-transition-link";
import dynamic from "next/dynamic";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { motion } from "framer-motion";
import {
  Star,
  Zap,
  ArrowRight,
} from "lucide-react";
import AnimatedRoundedButton from "@/components/ui/animated-rounded-button";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { MagneticButton } from "@/components/magnetic-button";
import { ProfessionalPlanCard, EnterprisePlanCard } from "@/components/pricing-cards";
import { usePricingData, useRegionalPricing } from "@/hooks/useUser";
import {
  BrowserFrame,
  PhoneFrame,
  PaidDashboardPreview,
} from "@/components/samples-section";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const CommunityStats = dynamic(() =>
  import("@/components/community-hub/community-stats").then(
    (mod) => mod.CommunityStats,
  ),
);

const CommunityTestimonials = dynamic(() =>
  import("@/components/community-hub/community-testimonials").then(
    (mod) => mod.CommunityTestimonials,
  ),
);

const CommunityFaqSection = dynamic(() =>
  import("@/components/community-hub/community-faq-section").then(
    (mod) => mod.CommunityFaqSection,
  ),
);

function ProHeroSection() {
  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern z-0" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <HoverBorderGradient
            containerClassName="rounded-full m-auto mb-5 sm:mb-10"
            as="button"
            className="dark:bg-black text-[10px] sm:text-xs bg-white text-black dark:text-white flex items-center space-x-2"
          >
            <Zap className="w-4 h-4 mr-2 text-primary" />
            <span>Professional Testing, Fully Managed, Guaranteed Results</span>
          </HoverBorderGradient>

          <h1 className="text-[1.85rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] font-heading leading-[1.2] md:leading-[1.1] tracking-tight font-bold mb-5 sm:mb-8 text-center mx-auto max-w-[900px]">
            20+ Testers in{" "}
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              14 Days
            </span>
            <br />
            <span className="text-primary italic">Zero Effort</span> from You
          </h1>

          <p className="text-sm sm:text-base md:text-lg font-body max-w-xs sm:max-w-md md:max-w-lg lg:max-w-[700px] mx-auto mb-8 text-muted-foreground">
            Meet Google Play&apos;s 12-tester requirement with confidence. Our
            professional QA team manages everything, from tester assignment to
            detailed bug reports and compliance verification.
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
                    Start Pro Testing
                  </span>
                  <div className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/20 group-hover:bg-black dark:group-hover:bg-white transition-all duration-500 group-hover:scale-[2] ml-3 sm:ml-4">
                    <ArrowRight className="w-4 h-4 text-primary-foreground group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
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
              <AutoTransitionLink href={ROUTES.PUBLIC.PRICING}>
                See Pricing <ArrowRight className="w-4 h-4 ml-1" />
              </AutoTransitionLink>
            </Button>
            <span className="hidden sm:block text-muted-foreground/30">|</span>
            <Button variant="link" asChild className="text-muted-foreground">
              <AutoTransitionLink href={ROUTES.AUTHENTICATED.PRO_TESTING}>
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </AutoTransitionLink>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProSamplesSection() {
  const [isActive, setIsActive] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);

  return (
    <section className="relative py-10 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-secondary/30 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-2xl md:text-5xl font-bold font-heading tracking-tight leading-none mb-3 md:mb-4">
            See the{" "}
            <span className="text-primary italic mr-2">Dashboard</span> in Action
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl mx-auto"
          >
            Want to see what you&apos;re getting before committing? Explore the
            Pro Testing dashboard with live sample data — no signup required.
          </motion.p>
        </div>

        {/* Desktop: Browser Window Mockup */}
        <div className="hidden md:block max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group p-5 rounded-2xl bg-gradient-to-t from-primary/80 to-primary/0"
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
          >
            <div className="mb-6 transition-transform duration-300 group-hover:-translate-y-2">
              <p className="font-bold text-primary text-center mb-5">
                For Developers
              </p>
              <BrowserFrame isActive={isActive}>
                <PaidDashboardPreview />
              </BrowserFrame>
            </div>

            <Link
              href="/samples/pro-testing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="w-full shadow-primary/20 bg-transparent text-white border-none"
              >
                VIEW SAMPLE
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile: Phone Mockup */}
        <div className="md:hidden max-w-[180px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-2 rounded-2xl bg-gradient-to-t from-primary/80 to-primary/0 flex flex-col"
          >
            <div className="mb-2">
              <p className="text-[11px] font-bold text-primary text-center mb-2">
                For Developers
              </p>
              <PhoneFrame
                isActive={mobileActive}
                onClick={() => setMobileActive(!mobileActive)}
              >
                <PaidDashboardPreview compact />
              </PhoneFrame>
            </div>

            <div>
              <Link
                href="/samples/pro-testing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="text-[10px] py-1 w-full shadow-primary/20 bg-transparent text-white border-none"
                >
                  VIEW SAMPLE
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProPricingSection() {
  const { data: pricingPlans } = usePricingData();
  const { data: regionalPricing } = useRegionalPricing();

  const entryPlan = pricingPlans?.length
    ? pricingPlans.reduce((min, p) => (p.price < min.price ? p : min), pricingPlans[0])
    : null;

  return (
    <section className="py-16 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.08] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight">
            Simple,{" "}
            <span className="text-primary italic">Transparent</span> Pricing
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            No hidden fees. Pay only for what you need. All plans include
            detailed reports and Google Play compliance proof.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto items-stretch">
          {entryPlan && (
            <ProfessionalPlanCard
              plan={entryPlan}
              regionalPricing={regionalPricing}
              actionButton={
                <AutoTransitionLink href="/app/pro-testing/add-app" className="w-full">
                  <Button className="w-full py-5 rounded-full font-bold text-sm bg-white text-primary hover:bg-white/90 shadow-lg">
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    Submit Your App
                  </Button>
                </AutoTransitionLink>
              }
            />
          )}

          <EnterprisePlanCard
            actionButton={
              <AutoTransitionLink href="/contact-us" className="w-full">
                <Button
                  variant="outline"
                  className="w-full py-5 rounded-full font-semibold text-sm bg-gradient-to-r from-[#8364E8] to-[#D397FA] text-white border-0 hover:opacity-90"
                >
                  Contact Sales
                </Button>
              </AutoTransitionLink>
            }
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <AutoTransitionLink href={ROUTES.PUBLIC.PRICING}>
            <Button variant="link" className="text-muted-foreground">
              View All Pricing Plans <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </AutoTransitionLink>
        </motion.div>
      </div>
    </section>
  );
}

function ProScrollingRibbon() {
  const ribbonRef1 = useRef<HTMLDivElement>(null);
  const ribbonRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (ribbonRef1.current) {
            const speed = -0.35;
            const movement = lastScrollY * speed;
            ribbonRef1.current.style.transform = `translateX(${movement}px)`;
          }
          if (ribbonRef2.current) {
            const speed = 0.35;
            const movement = lastScrollY * speed - 3000;
            ribbonRef2.current.style.transform = `translateX(${movement}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const RibbonText = () => (
    <>
      <span className="mx-8">Launch Faster</span>
      <span className="text-primary-foreground/50 mx-8">•</span>
      <span className="mx-8">Meet Google Play Requirements</span>
      <span className="text-primary-foreground/50 mx-8">•</span>
      <span className="mx-8">Professional QA</span>
      <span className="text-primary-foreground/50 mx-8">•</span>
      <span className="mx-8">Guaranteed Results</span>
      <span className="text-primary-foreground/50 mx-8">•</span>
      <span className="mx-8">20+ Vetted Testers</span>
      <span className="text-primary-foreground/50 mx-8">•</span>
      <span className="mx-8">14-Day Cycle</span>
      <span className="text-primary-foreground/50 mx-8">•</span>
      <span className="mx-8">Detailed Bug Reports</span>
      <span className="text-primary-foreground/50 mx-8">•</span>
      <span className="mx-8">Ship with Confidence</span>
      <span className="text-primary-foreground/50 mx-8">•</span>
    </>
  );

  return (
    <section className="w-full overflow-hidden my-20 transform -skew-y-2">
      <div className="flex flex-col gap-2">
        <div className="flex whitespace-nowrap text-lg md:text-3xl font-bold uppercase tracking-wider text-primary-foreground select-none bg-primary">
          <div ref={ribbonRef1} className="flex my-2 sm:my-6">
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
          </div>
        </div>
        <div className="flex whitespace-nowrap text-lg md:text-3xl font-bold uppercase tracking-wider text-primary-foreground select-none bg-primary">
          <div ref={ribbonRef2} className="flex my-2 sm:my-6">
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProTestingCTASection() {
  return (
    <section className="w-full relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary text-primary-foreground select-none flex flex-col items-center justify-center min-h-screen">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-black/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-black/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-white/20 blur-[100px] rounded-full mix-blend-overlay" />
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
            <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span className="text-xs md:text-sm tracking-wide uppercase font-bold">
              Professional Testing Service
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight font-heading leading-tight drop-shadow-sm">
            Ready for{" "}
            <br className="hidden md:block" />
            <span className="relative inline-block">
              Pro Testing?
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
            Get 20+ vetted testers, detailed bug reports, and full Google Play
            compliance in just 14 days. All managed by our team.
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
                  <span>Get Started</span>
                </div>
              </AnimatedRoundedButton>
            </AutoTransitionLink>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full h-12 px-6 border border-white/30 text-base bg-transparent hover:bg-white/10 text-white hover:text-white sm:min-w-[160px] transition-all hover:border-white/60 backdrop-blur-sm"
              asChild
            >
              <AutoTransitionLink href={ROUTES.AUTHENTICATED.PRO_TESTING}>
                Go to Pro Testing
              </AutoTransitionLink>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ProTestingPage() {
  return (
    <>
      <ProHeroSection />
      <ProSamplesSection />
      <CommunityStats variant="pro" />
      <ProPricingSection />
      <CommunityTestimonials variant="pro" />
      <ProScrollingRibbon />
      <CommunityFaqSection faqType="pro" />
      <ProTestingCTASection />
      <ScrollToTopButton />
    </>
  );
}
