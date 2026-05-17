"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, CheckCircle, Star } from "lucide-react";

export function CtaSection() {
  return (
    <section className="container mx-auto px-2 md:px-6 pb-10 md:pb-20 max-w-7xl mt-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative p-8 md:p-14 bg-gradient-to-b from-primary/15 via-primary/5 to-background rounded-3xl border border-primary/10 text-center overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to publish your app?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm md:text-base">
            Stop spending weeks trying to find testers. Get 12 people enrolled
            within 24 hours and launch your app with confidence.
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span>100+ testers</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>~99% success rate</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-amber-500" />
              <span>4.8/5 rating</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/register"
              className="group inline-flex items-center px-4 sm:px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-all gap-2 shadow-lg shadow-primary/20"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center px-8 py-4 bg-muted text-foreground rounded-full font-medium hover:bg-muted/80 transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
