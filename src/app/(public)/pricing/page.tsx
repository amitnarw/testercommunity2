"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion } from "@/components/ui/accordion";
import {
  CheckCircle,
  HelpCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { pricingFaqs } from "@/lib/data";
import { usePricingData } from "@/hooks/useUser";
import { PricingResponse } from "@/lib/types";
import SkeletonPricingSetup from "@/components/unauthenticated/pricing-skeleton";
import FaqItem from "@/components/faq-item";
import {
  ProfessionalPlanCard,
  EnterprisePlanCard,
} from "@/components/pricing-cards";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

import { useState, useEffect } from "react";

export default function PricingPage() {
  const { data: pricingData, isPending: pricingIsPending } = usePricingData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div data-loc="PricingPage" className="bg-background text-foreground">
        <div className="container mx-auto px-4 md:px-6 py-20">
          <section className="mt-20 max-w-4xl mx-auto">
            <SkeletonPricingSetup />
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
            Simple, Transparent{" "}
            <span className="text-primary italic">Pricing</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            One clear plan for professional testing, or talk to us for a custom
            enterprise solution. No hidden fees, ever.
          </p>
        </section>

        {/* Plan Cards */}
        <section className="mt-20 max-w-4xl mx-auto">
          {pricingIsPending ? (
            <SkeletonPricingSetup />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {pricingData?.map((plan) => (
                <ProfessionalPlanCard
                  key={plan.id}
                  plan={plan}
                  actionButton={
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center w-full"
                    >
                      <HoverBorderGradient
                        as="div"
                        containerClassName="w-full"
                        className="bg-white text-primary flex justify-center items-center space-x-2 w-full py-4 font-bold cursor-pointer"
                      >
                        <Zap className="w-4 h-4 mr-2 fill-current" />
                        <span className="font-semibold">Get Started</span>
                      </HoverBorderGradient>
                    </Link>
                  }
                />
              ))}
              <EnterprisePlanCard
                actionButton={
                  <Button
                    asChild
                    size="lg"
                    className="w-full relative z-10 rounded-full bg-gradient-to-r from-[#8364E8] to-[#D397FA] text-white hover:opacity-90 font-bold px-10 h-14 text-lg shadow-xl border-0"
                  >
                    <Link href="/help">
                      <Phone className="mr-2 w-4 h-4" /> Contact Sales
                    </Link>
                  </Button>
                }
              />
            </div>
          )}
        </section>

        {/* FAQ */}
        <section className="mt-28 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
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
                key={`faq-${i}`}
                index={i}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
