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

export default function FaqPage() {
  return (
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
        <Accordion type="single" collapsible className="w-full">
          {communityFaqs.map((faq, i) => (
            <AccordionItem
              key={`community-${i}`}
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

        <h2 className="text-2xl font-bold mb-6 mt-12">Professional Path</h2>
        <Accordion type="single" collapsible className="w-full">
          {proFaqs.map((faq, i) => (
            <AccordionItem
              key={`pro-${i}`}
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
      </div>

      <div className="mt-20 text-center bg-secondary/50 p-10 rounded-2xl">
        <LifeBuoy className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold">Still have questions?</h3>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Can't find the answer you're looking for? Don't worry, our support
          team is here to help you with any questions you might have.
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
  );
}
