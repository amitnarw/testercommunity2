"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Star,
  HelpCircle,
  Phone,
  Package,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  pointsPackages,
  pricingFaqs,
  professionalPathFeatures,
} from "@/lib/data";
import { usePricingData } from "@/hooks/useUser";
import { PricingResponse } from "@/lib/types";
import SkeletonPricingSetup from "@/components/unauthenticated/pricing-skeleton";

const PointsPackageCard = ({
  plan,
  isPopular,
}: {
  plan: PricingResponse;
  isPopular: boolean;
}) => {
  return (
    <Card
      className={cn(
        "flex flex-col rounded-3xl h-full transition-all duration-300 group",
        isPopular
          ? "border-2 border-primary shadow-2xl shadow-primary/20 bg-card"
          : "border-border/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-secondary/50"
      )}
    >
      <CardHeader className="pt-10 text-center">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        {/* <CardDescription className="pt-1">{plan.description}</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center space-y-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold">
            ₹{plan.price.toLocaleString("en-IN")}
          </span>
          <span className="text-muted-foreground">/ one-time</span>
        </div>
        <div className="text-center bg-primary/10 text-primary font-bold py-2 px-4 rounded-full">
          {plan?.package} {plan?.package > 1 ? "Packages" : "Package"} Included
        </div>
      </CardContent>
      <CardFooter className="p-6">
        <Button className="w-full text-lg py-6 font-bold group-hover:bg-primary/90">
          Get Started{" "}
          <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function PricingPage() {
  const {
    data: pricingData,
    isPending: pricingIsPending,
    isError: pricingIsError,
    error: pricingError,
  } = usePricingData();

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6 py-20">
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold">
            Professional Testing{" "}
            <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              Packages
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            For free community testing, earn points by testing other apps. For
            guaranteed professional results, purchase a package below.
          </p>
        </section>

        {pricingIsPending ? (
          <SkeletonPricingSetup />
        ) : (
          <>
            <section className="mt-20 max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">
                  What's Included in Every Package?
                </h2>
                <p className="text-muted-foreground mt-2">
                  Every professional testing package comes with our full suite
                  of features to ensure a successful launch.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pricingData?.[0]?.features?.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50"
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-20 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {pricingData?.map((plan) => (
                  <div key={plan.name}>
                    <PointsPackageCard
                      plan={plan}
                      isPopular={plan.name === "Accelerator"}
                    />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <section className="mt-20 max-w-5xl mx-auto">
          <Card className="flex flex-col md:flex-row items-center gap-6 rounded-2xl h-full bg-secondary/50 border-dashed border-2 p-8 justify-between text-center md:text-left">
            <div>
              <CardTitle className="text-2xl">
                Enterprise & Custom Plans
              </CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                Need a bulk package purchase, custom integrations, or dedicated
                account management? We can build a plan tailored to your
                specific requirements.
              </CardDescription>
            </div>
            <Button
              asChild
              className="text-lg py-6 font-bold mt-4 md:mt-0 flex-shrink-0"
              variant="outline"
            >
              <Link href="/help">
                <Phone className="mr-2" /> Contact Sales
              </Link>
            </Button>
          </Card>
        </section>

        <section className="mt-28 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Packages & Pricing Explained
            </h2>
            <p className="mt-4 text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {pricingFaqs.map((faq, i) => (
              <AccordionItem
                key={`faq-${i}`}
                value={`item-${i}`}
                className="border-b"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline text-base py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}
