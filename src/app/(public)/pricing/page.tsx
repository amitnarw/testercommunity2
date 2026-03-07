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
import {
  CheckCircle,
  HelpCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { pricingFaqs } from "@/lib/data";
import { usePricingData } from "@/hooks/useUser";
import { PricingResponse } from "@/lib/types";
import SkeletonPricingSetup from "@/components/unauthenticated/pricing-skeleton";
import FaqItem from "@/components/faq-item";

// --- Professional Plan Card ---
const ProfessionalCard = ({ plan }: { plan: PricingResponse }) => {
  return (
    <Card className="relative flex flex-col rounded-3xl h-full border-2 border-primary shadow-2xl shadow-primary/20 bg-card transition-all duration-300 group hover:-translate-y-2 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
      <CardHeader className="pt-10 text-center">
        <Badge className="mx-auto mb-3 w-fit bg-primary/10 text-primary border-0 hover:bg-primary/10">
          Most Picked
        </Badge>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center space-y-6 px-8">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold">
            ₹{plan.price.toLocaleString("en-IN")}
          </span>
          <span className="text-muted-foreground">/ one-time</span>
        </div>
        <div className="text-center bg-primary/10 text-primary font-bold py-2 px-5 rounded-full text-sm">
          Includes 1 Full Testing Cycle
        </div>
        <div className="w-full space-y-3 pt-2">
          {plan.features?.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-4">
        <Button className="w-full text-base py-6 font-bold group-hover:bg-primary/90">
          Get Started{" "}
          <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// --- Enterprise Card ---
const EnterpriseCard = () => {
  return (
    <Card className="relative flex flex-col rounded-3xl h-full bg-gradient-to-br from-[#8364E8] to-[#D397FA] text-white border-0 shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 group">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="pt-10 text-center relative z-10">
        <div className="mx-auto mb-3 w-fit bg-white/20 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
          Custom
        </div>
        <CardTitle className="text-2xl text-white">Enterprise</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col items-center justify-center space-y-6 px-8 relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-white">Custom</span>
        </div>
        <div className="text-center bg-white/20 text-white font-bold py-2 px-5 rounded-full text-sm backdrop-blur-sm">
          Unlimited Testing Cycles
        </div>
        <div className="w-full space-y-3 pt-2">
          {[
            "Everything in Professional",
            "Volume Discounts",
            "Dedicated Account Manager",
            "Custom Integrations",
            "Priority Support & SLA",
            "Custom Reporting",
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-white/80 flex-shrink-0" />
              <span className="text-sm text-white/90">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-4 relative z-10">
        <Button
          asChild
          className="w-full text-base py-6 font-bold bg-white text-purple-700 hover:bg-white/90 rounded-xl"
        >
          <Link href="/help">
            <Phone className="mr-2 w-4 h-4" /> Contact Sales
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

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
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              Pricing
            </span>
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
                <ProfessionalCard key={plan.id} plan={plan} />
              ))}
              <EnterpriseCard />
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
          <div className="w-full space-y-2">
            {pricingFaqs.map((faq, i) => (
              <FaqItem
                key={`faq-${i}`}
                index={i}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
