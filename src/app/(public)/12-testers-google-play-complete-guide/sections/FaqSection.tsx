"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getPublicFaqs } from "@/lib/apiCalls";
import type { Faq } from "@/lib/types";

export function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicFaqs("google_play_guide")
      .then(setFaqs)
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

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

      {loading ? (
        <div className="text-center text-muted-foreground py-8">Loading FAQs...</div>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-2 mt-10">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.id}
              value={`item-${faq.id}`}
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
                  <span>{faq.title}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed pl-8">
                {faq.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

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
