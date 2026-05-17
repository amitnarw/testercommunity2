"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, DollarSign, Users, Shield, Zap } from "lucide-react";
import { useRegionalPricing } from "@/hooks/useUser";

const diyItems = [
  { icon: X, text: "Takes 1-4 weeks to find testers", color: "text-red-500" },
  {
    icon: X,
    text: "High chance of dropouts that reset your 14 days",
    color: "text-red-500",
  },
  {
    icon: X,
    text: "Friends and family forget to test",
    color: "text-red-500",
  },
  {
    icon: X,
    text: "~40-50% success rate on first try",
    color: "text-red-500",
  },
  { icon: Check, text: "Free (costs your time)", color: "text-green-500" },
];

const proItems = [
  {
    icon: Check,
    text: "Testers start within 24 hours",
    color: "text-green-500",
  },
  {
    icon: Check,
    text: "Committed to full 14-day period",
    color: "text-green-500",
  },
  {
    icon: Check,
    text: "Real phones, real engagement",
    color: "text-green-500",
  },
  {
    icon: Check,
    text: "~99% success rate on first try",
    color: "text-green-500",
  },
  { icon: DollarSign, text: "Starts at competitive rates", color: "text-yellow-500" },
];

export function ComparisonSection() {
  const { data: regionalPricing } = useRegionalPricing();
  const displayPrice = regionalPricing
    ? `${regionalPricing.currency_symbol}${Math.round(regionalPricing.amount / 100)}`
    : "$14.99";

  return (
    <section
      id="diy-vs-service"
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
          DIY vs Pro
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
          Do It Yourself or Use a Service?
        </h2>
        <p className="text-muted-foreground">
          Most developers try to find testers on their own first. Here&apos;s an
          honest look at both options.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-10">
        {/* DIY Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-card rounded-2xl border border-border"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-red-500/10 rounded-xl">
              <Users className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-lg">Doing It Yourself</h3>
          </div>
          <ul className="space-y-3">
            {diyItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <item.icon
                  className={`w-4 h-4 shrink-0 mt-0.5 ${item.color}`}
                />
                <span className="text-sm text-muted-foreground">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Pro Card - Elevated */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -4 }}
          className="p-6 bg-gradient-to-br from-primary/[0.07] via-primary/[0.02] to-background rounded-2xl border border-primary/20 relative shadow-xl shadow-primary/5"
        >
          <div className="absolute -top-3 left-6">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-primary/20">
              Most Popular
            </span>
          </div>

          <div className="flex items-center gap-3 mb-5 mt-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg">
              Using{" "}
              <Link href="/" className="text-primary hover:underline">
                inTesters
              </Link>
            </h3>
          </div>
          <ul className="space-y-3">
            {proItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <item.icon
                  className={`w-4 h-4 shrink-0 mt-0.5 ${item.color}`}
                />
                <span className="text-sm text-muted-foreground">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-primary/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Starting at
              </span>
              <span className="text-2xl font-bold text-primary">
                {displayPrice}
              </span>
            </div>
            <Link
              href="/auth/register"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4" />
              Get Started Free
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-muted-foreground text-center text-sm"
      >
        A single failed attempt costs you 14 days. For most developers, a
        testing service saves more time than it costs.
      </motion.p>
    </section>
  );
}
