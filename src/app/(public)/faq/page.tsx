import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LifeBuoy, ArrowRight } from "lucide-react";
import Link from "next/link";
import FaqItem from "@/components/faq-item";
import { FAQPageJsonLd } from "@/components/schema";
import { serverGetPublicFaqs } from "@/lib/serverApi";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ | inTesters",
  description: "Frequently asked questions about inTesters app testing platform. Learn about community testing, professional testing packages, pricing, and how to meet Google Play's 12-tester requirement.",
  keywords: "inTesters FAQ, app testing questions, Google Play 12 testers, community testing, professional testing, Android app testing help",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ | inTesters",
    description: "Frequently asked questions about inTesters app testing platform. Learn about community testing, professional testing packages, and the 12-tester requirement.",
    url: "/faq",
    siteName: "inTesters",
  },
};

export default async function FaqPage() {
  const [generalFaqs, googlePlayFaqs, communityFaqs, proFaqs] = await Promise.all([
    serverGetPublicFaqs("general"),
    serverGetPublicFaqs("google_play_guide"),
    serverGetPublicFaqs("community"),
    serverGetPublicFaqs("professional"),
  ]);

  const allFaqItems = [
    ...generalFaqs,
    ...googlePlayFaqs,
    ...communityFaqs,
    ...proFaqs,
  ];

  return (
    <>
      <FAQPageJsonLd
        items={allFaqItems.map((faq) => ({
          question: faq.title,
          answer: faq.description,
        }))}
      />
      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about inTesters. If you have more
            questions, feel free to reach out to our support team.
          </p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">General</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {generalFaqs.map((faq, i) => (
              <FaqItem
                key={faq.id}
                index={i}
                question={faq.title}
                answer={faq.description}
              />
            ))}
          </Accordion>

          <h2 className="text-2xl font-bold mb-6 mt-12">Community Path</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {communityFaqs.map((faq, i) => (
              <FaqItem
                key={faq.id}
                index={i}
                question={faq.title}
                answer={faq.description}
              />
            ))}
          </Accordion>

          <h2 className="text-2xl font-bold mb-6 mt-12">
            Google Play 12-Tester Requirement
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {googlePlayFaqs.map((faq, i) => (
              <FaqItem
                key={faq.id}
                index={i}
                question={faq.title}
                answer={faq.description}
              />
            ))}
          </Accordion>

          <h2 className="text-2xl font-bold mb-6 mt-12">Professional Path</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {proFaqs.map((faq, i) => (
              <FaqItem
                key={faq.id}
                index={i}
                question={faq.title}
                answer={faq.description}
              />
            ))}
          </Accordion>
        </div>

        <div className="mt-20 text-center bg-secondary/50 p-10 rounded-2xl">
          <LifeBuoy className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold">Still have questions?</h3>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Can&apos;t find the answer you&apos;re looking for? Don&apos;t
            worry, our support team is here to help you with any questions you
            might have.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/help">
                Contact Support <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
