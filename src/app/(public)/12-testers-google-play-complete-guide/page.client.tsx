"use client";

import { HeroSection } from "./sections/HeroSection";
import { StatsSection } from "./sections/StatsSection";
import { RequirementsSection } from "./sections/RequirementsSection";
import { WhySection } from "./sections/WhySection";
import { GuideProcessSteps } from "./sections/GuideProcessSteps";
import { PricingComparisonSection } from "./sections/PricingComparisonSection";
import { ComparisonSection } from "./sections/ComparisonSection";
import { MistakesSection } from "./sections/MistakesSection";
import { FaqSection } from "./sections/FaqSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { CtaSection } from "./sections/CtaSection";

export default function GuidePageClient() {
  return (
    <div className="min-h-screen bg-background">
      <article>
        <HeroSection />
        <StatsSection />
        <RequirementsSection />
        <WhySection />
        <GuideProcessSteps />
        <PricingComparisonSection />
        <ComparisonSection />
        <MistakesSection />
        <FaqSection />
        <TestimonialsSection />
        <CtaSection />
      </article>
    </div>
  );
}
