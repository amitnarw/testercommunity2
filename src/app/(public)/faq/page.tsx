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
import { pricingFaqs, communityFaqs, generalFaqs } from "@/lib/data";
import FaqItem from "@/components/faq-item";
import { FAQPageJsonLd } from "@/components/schema";

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

const googlePlayFaqs = [
  {
    question: "How many testers do I need for Google Play in 2026?",
    answer:
      "Google Play requires a minimum of 12 opted-in testers for personal developer accounts. Testers must actively use your app on real Android devices for 14 consecutive days before you can apply for production access.",
  },
  {
    question: "Can I get 12 testers in 24 hours?",
    answer:
      "Yes. With a dedicated testing platform like inTesters, you can get 12 pre-qualified testers enrolled and active on your app within 24 hours. Our community of real testers is ready to help you meet the requirement quickly.",
  },
  {
    question: "Does Google require 12 testers for 14 days?",
    answer:
      "Yes. The requirement is at least 12 opted-in testers actively using your app for 14 consecutive days. If testers drop below 12, the clock resets and you must start over.",
  },
  {
    question: "What happens if a tester uninstalls my app during the 14 days?",
    answer:
      "If a tester uninstalls your app and your active tester count drops below 12, Google resets the 14-day clock entirely. This is why it's recommended to recruit 15-20 testers to build in a buffer against dropouts.",
  },
  {
    question: "Is the 12-tester requirement mandatory for all developers?",
    answer:
      "It applies to personal Google Play Console accounts created after November 13, 2023. Organization/business accounts are typically exempt from this requirement.",
  },
  {
    question: "How long does Google Play closed testing take?",
    answer:
      "The minimum testing period is 14 consecutive days. With inTesters, you can have testers enrolled and active within 24 hours, so the total timeline is approximately 15-16 days from start to production access.",
  },
  {
    question: "Can I use the same testers for multiple apps?",
    answer:
      "Yes. The same group of testers can test multiple apps on your developer account. Each app requires its own 14-day testing period, however.",
  },
  {
    question: "What is the fastest way to get 12 testers for Google Play?",
    answer:
      "The fastest and most reliable way is to use a professional testing service like inTesters. We connect you with real, active testers who are committed to completing the full 14-day testing period. Testers can be enrolled within 24 hours.",
  },
];

const proFaqs = [
  {
    question: "What is the 'Professional Path'?",
    answer:
      "On this path, you buy a testing package to have your app tested by our team of vetted, professional QA testers. We manage the entire process to ensure you get high-quality, structured feedback and meet the 14-day testing requirement without any hassle.",
  },
  {
    question: "When should I choose the Professional Path?",
    answer:
      "Choose the Pro path when you have a critical deadline, need guaranteed test completion, or simply don't have time for community testing. It's the fastest and most reliable way to get your app ready for launch.",
  },
  {
    question: "How do packages work?",
    answer:
      "You purchase a package from our pricing page. Each package allows you to submit one app for a full professional testing cycle. Once you submit your app, one package is consumed.",
  },
];

const allFaqItems = [
  ...generalFaqs,
  ...googlePlayFaqs,
  ...communityFaqs,
  ...proFaqs,
];

export default function FaqPage() {
  return (
    <>
      <FAQPageJsonLd
        items={allFaqItems.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
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
                key={i}
                index={i}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </Accordion>

          <h2 className="text-2xl font-bold mb-6 mt-12">Community Path</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {communityFaqs.map((faq, i) => (
              <FaqItem
                key={i}
                index={i}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </Accordion>

          <h2 className="text-2xl font-bold mb-6 mt-12">
            Google Play 12-Tester Requirement
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {googlePlayFaqs.map((faq, i) => (
              <FaqItem
                key={i}
                index={i}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </Accordion>

          <h2 className="text-2xl font-bold mb-6 mt-12">Professional Path</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {proFaqs.map((faq, i) => (
              <FaqItem
                key={i}
                index={i}
                question={faq.question}
                answer={faq.answer}
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
