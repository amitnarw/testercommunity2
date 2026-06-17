"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import FaqItem from "@/components/faq-item";
import { motion } from "framer-motion";
import { getPublicFaqs } from "@/lib/apiCalls";
import type { Faq } from "@/lib/types";

export function CommunityFaqSection({ faqType = "community" }: { faqType?: "community" | "pro" }) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const category = faqType === "pro" ? "professional" : "community";
    getPublicFaqs(category)
      .then(setFaqs)
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, [faqType]);

  return (
    <section data-loc="CommunityFaqSection" id="faq" className="py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            {faqType === "pro" ? "Everything you need to know about Pro Testing." : "Everything you need to know about Free Testing."}
          </p>
        </motion.div>

        <div className="mt-12 max-w-3xl mx-auto">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading FAQs...</div>
          ) : (
            <>
              <Accordion
                type="single"
                collapsible
                className="w-full space-y-2"
              >
                {faqs.map((faq, i) => (
                  <FaqItem
                    key={faq.id}
                    index={i}
                    question={faq.title}
                    answer={faq.description}
                  />
                ))}
              </Accordion>
              <div className="mt-8 text-center">
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 group">
                  <Link href="/faq">
                    View All FAQs
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
