"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FaqSection } from "@/components/faq-section";

export function HomeFaqSection() {
  return (
    <section data-loc="HomePage-FAQSection" id="faq" className="py-12 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-heading">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Have questions? We have answers. For more detailed information,
            check out our full FAQ page.
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <FaqSection />
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/faq">
                View All FAQs <ChevronRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
