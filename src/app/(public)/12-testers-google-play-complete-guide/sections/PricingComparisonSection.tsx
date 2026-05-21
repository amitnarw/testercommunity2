"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { usePricingData, useRegionalPricing } from "@/hooks/useUser";
import { ROUTES } from "@/lib/routes";

const methods = [
  {
    name: "Friends & Family",
    time: "1-7 days",
    reliability: "Low",
    cost: "Free",
  },
  {
    name: "Reddit / Forums",
    time: "3-14 days",
    reliability: "Medium",
    cost: "Free",
  },
  {
    name: "Discord / Telegram",
    time: "2-7 days",
    reliability: "Medium",
    cost: "Free",
  },
  {
    name: "PrimeTestLab",
    time: "4-6 hours",
    reliability: "High",
    cost: "$14.99",
  },
  {
    name: "Testers Community",
    time: "24 hours",
    reliability: "High",
    cost: "$12.99",
  },
  {
    name: "AppBooster",
    time: "24 hours",
    reliability: "Medium",
    cost: "$19.99",
  },
];

export function PricingComparisonSection() {
  const { data: pricingPlans } = usePricingData();
  const { data: regionalPricing } = useRegionalPricing();

  const displayPrice = regionalPricing
    ? `${regionalPricing.currency_symbol}${Math.round(regionalPricing.amount / 100)}`
    : pricingPlans && pricingPlans.length > 0
      ? `$${(pricingPlans[0].price / 100).toFixed(2)}`
      : "$14.99";

  return (
    <section
      id="get-12-testers-fast"
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
          Compare Options
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
          How to Get 12 Testers Fast
        </h2>
        <p className="text-muted-foreground">
          Finding reliable testers is the hardest part. Here are your options,
          ranked by how fast and reliable they are.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto rounded-2xl border border-border"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left py-3 px-4 font-bold text-sm">
                Method
              </th>
              <th className="text-left py-3 px-4 font-bold text-sm">
                Time to Start
              </th>
              <th className="text-left py-3 px-4 font-bold text-sm">
                Reliability
              </th>
              <th className="text-left py-3 px-4 font-bold text-sm">Cost</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((method, i) => (
              <tr
                key={i}
                className="border-t border-border hover:bg-muted/20 transition-colors"
              >
                <td className="py-3 px-4 text-sm">{method.name}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {method.time}
                </td>
                <td className="py-3 px-4 text-sm">{method.reliability}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {method.cost}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-primary/30 bg-primary/5">
              <td className="py-4 px-4 font-bold text-primary text-sm">
                <Link
                  href={ROUTES.PUBLIC.PRICING}
                  className="hover:underline inline-flex items-center gap-1"
                >
                  inTesters
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </td>
              <td className="py-4 px-4 font-bold text-sm">4-24 hours</td>
              <td className="py-4 px-4 text-sm font-bold text-green-500">
                Very High
              </td>
              <td className="py-4 px-4 text-sm font-bold text-primary">
                From{" "}
                <Link href="/pricing" className="hover:underline">
                  {displayPrice}
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 p-6 md:p-8 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-background rounded-2xl border border-primary/10"
      >
        <h3 className="font-bold text-lg mb-5">
          Why developers pick inTesters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Get 12 testers in under 24 hours",
            "Real Android phones only, no emulators",
            "Testers stay active for the full 14 days",
            "Real feedback to improve your app",
            "Free community testing available too",
            "~99% success rate on first try",
          ].map((benefit, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-primary/10 flex flex-wrap gap-4">
          <Link
            href="/auth/register"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity gap-2"
          >
            Get Started Free
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href={ROUTES.PUBLIC.PRICING}
            className="inline-flex items-center px-6 py-3 bg-muted text-foreground rounded-full font-medium hover:bg-muted/80 transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
