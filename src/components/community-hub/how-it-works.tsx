"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, CalendarCheck, Coins, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutoTransitionLink } from "@/components/auto-transition-link";

const steps = [
  {
    number: "01",
    title: "Publish Your App",
    description:
      "Publish your apps on the Handshake Testing hub for free. Each app gets a slot limit based on your level (starts at 12).",
    icon: Search,
  },
  {
    number: "02",
    title: "Barter 1:1 Requests",
    description:
      "Browse other developers' apps and send a handshake request. When they accept, you both agree: you test their app and they test yours ,  a true barter system.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Complete & Level Up",
    description:
      "After the testing period both sides submit their test reports. Level up by completing handshakes to unlock more testers (start at 12, up to 20).",
    icon: Coins,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export function HowItWorks() {
  return (
    <section
      data-loc="HowItWorks"
      id="how-it-works"
      className="py-16 md:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-secondary/20 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight">
            How{" "}
            <span className="text-emerald-600 italic">Handshake Testing</span> Works
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            A simple three-step process. Publish your app, and barter
            with other developers ,  test each other&apos;s apps and level up.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative p-6 lg:p-8 rounded-2xl bg-card border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl lg:text-5xl font-bold text-emerald-600/20 group-hover:text-emerald-600/30 transition-colors">
                  {step.number}
                </span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <step.icon className="w-5 h-5 lg:w-6 lg:h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 text-center"
        >
          <Button asChild size="lg" className="rounded-full px-8 group">
            <AutoTransitionLink href="/app/handshake-testing">
              Start Testing
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </AutoTransitionLink>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
