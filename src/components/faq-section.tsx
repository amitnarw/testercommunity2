"use client";

import { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import FaqItem from "./faq-item";
import { getPublicFaqs } from "@/lib/apiCalls";
import type { Faq } from "@/lib/types";

export function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicFaqs("homepage")
      .then(setFaqs)
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center text-muted-foreground py-8">Loading FAQs...</div>;
  }

  return (
    <Accordion
      data-loc="FaqSection"
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
  );
}
