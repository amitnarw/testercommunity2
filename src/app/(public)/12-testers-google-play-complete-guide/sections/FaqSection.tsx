"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How many testers do I need for Google Play?",
    a: "You need at least 12 people to opt into your closed test. They must use your app on real Android devices for 14 days before you can apply for production access.",
  },
  {
    q: "Can I get 12 testers in 24 hours?",
    a: "Yes. A service like inTesters can get you 12 qualified testers within 24 hours. The testers are real people with real phones who will stay active for the full 14 days.",
  },
  {
    q: "Does Google really need 12 testers for 14 days?",
    a: "Yes. The rule says at least 12 testers using your app for 14 days in a row. If you drop below 12 for even one day, the 14-day clock resets completely.",
  },
  {
    q: "What if a tester uninstalls my app?",
    a: "If your active count drops below 12, Google resets the clock. That's why you should start with 15-20 testers, not exactly 12.",
  },
  {
    q: "Does this apply to all developers?",
    a: "Only personal developer accounts created after November 13, 2023. Business and organization accounts usually don't need to do this.",
  },
  {
    q: "How long does the whole process take?",
    a: "The testing period is 14 days minimum. With inTesters, you can have testers enrolled in 24 hours. So the total time is about 15-16 days.",
  },
  {
    q: "Can I reuse the same testers for multiple apps?",
    a: "Yes. The same people can test several of your apps. But each app needs its own 14-day testing period.",
  },
  {
    q: "Whats the fastest way to get 12 testers?",
    a: "A professional testing service is the fastest and most reliable option. inTesters gives you real, committed testers who will complete the full 14 days.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-4xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        <span className="text-xs font-bold text-primary uppercase tracking-widest">
          FAQ
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground">
          Quick answers to the most common questions about Google Play testing.
        </p>
      </motion.div>

      <Accordion type="single" collapsible className="w-full space-y-2 mt-10">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className={`rounded-2xl px-4 sm:px-6 data-[state=open]:border-primary/30 transition-all duration-300 border shadow-sm ${
              i % 2 === 0
                ? "bg-gray-100/40 dark:bg-gray-800/30 border-border/50"
                : "bg-card border-border/50"
            }`}
          >
            <AccordionTrigger className="text-sm sm:text-base font-medium py-4 sm:py-5 hover:no-underline hover:text-primary transition-colors text-start gap-3">
              <span className="flex items-start gap-3">
                <span className="text-xs font-bold text-primary/50 shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{faq.q}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed pl-8">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 text-center"
      >
        <Link
          href="/faq"
          className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
        >
          View all FAQs
          <span className="text-lg leading-none">&rarr;</span>
        </Link>
      </motion.div>
    </section>
  );
}
