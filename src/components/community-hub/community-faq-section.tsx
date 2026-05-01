"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import FaqItem from "@/components/faq-item";
import { communityFaqs } from "@/lib/data";
import { motion } from "framer-motion";

export function CommunityFaqSection() {
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
            Everything you need to know about the Community Hub.
          </p>
        </motion.div>

        <div className="mt-12 max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-2"
          >
            {communityFaqs.map((faq, i) => (
              <FaqItem
                key={i}
                index={i}
                question={faq.question}
                answer={faq.answer}
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
        </div>
      </div>
    </section>
  );
}
