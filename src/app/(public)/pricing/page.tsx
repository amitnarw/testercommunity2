"use client";

import { Accordion } from "@/components/ui/accordion";
import {
  HelpCircle,
} from "lucide-react";
import { getPublicFaqs } from "@/lib/apiCalls";
import FaqItem from "@/components/faq-item";
import { HorizontalPinPricing } from "@/components/horizontal-pin-pricing";

import { useState, useEffect } from "react";
import type { Faq } from "@/lib/types";

export default function PricingPage() {
  const [pricingFaqs, setPricingFaqs] = useState<Faq[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getPublicFaqs("pricing").then(setPricingFaqs).catch(() => setPricingFaqs([]));
  }, []);

  if (!mounted) {
    return (
      <div data-loc="PricingPage" className="bg-background text-foreground">
        <div className="container mx-auto px-4 md:px-6 py-20">
          <section className="mt-20 max-w-4xl mx-auto">
            <div className="h-12 w-3/4 mx-auto bg-muted rounded-lg animate-pulse" />
            <div className="h-96 mt-8 bg-muted rounded-3xl animate-pulse" />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div data-loc="PricingPage" className="bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6 py-20">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold">
            Simple, Honest{" "}
            <span className="text-primary italic">Pricing</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Pay for what you test, nothing you don't. No hidden fees, ever.
          </p>
        </section>

        {/* Plan Cards */}
        <section className="mt-20 max-w-7xl w-full mx-auto">
          <HorizontalPinPricing variant="pricing" className="w-full" showAllPlans />
        </section>

        {/* FAQ */}
        <section className="mt-28 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pricing Explained
            </h2>
            <p className="mt-4 text-muted-foreground">
              Got questions? We&apos;ve got answers.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {pricingFaqs.map((faq, i) => (
              <FaqItem
                key={faq.id}
                index={i}
                question={faq.title}
                answer={faq.description}
              />
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
