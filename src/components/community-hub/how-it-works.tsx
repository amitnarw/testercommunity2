"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, CalendarCheck, Coins, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutoTransitionLink } from "@/components/auto-transition-link";

const steps = [
  {
    number: "01",
    title: "Find Apps to Test",
    description:
      "Browse available apps in the community hub. Filter by category, testing duration, or number of testers to find the perfect match.",
    icon: Search,
  },
  {
    number: "02",
    title: "Complete Daily Check-ins",
    description:
      "Once accepted, test the app daily for the required period. Submit screenshot proof to verify your activity.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Earn Points & Submit",
    description:
      "Earn 80 points per tester + 10 points per day. Use your accumulated points to submit your own app for testing.",
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
            How the{" "}
            <span className="text-primary italic">Community Path</span> Works
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            A simple three-step process. Test apps to earn points, then use those
            points to get your own app tested — completely free.
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
                <span className="text-4xl lg:text-5xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors">
                  {step.number}
                </span>
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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
            <AutoTransitionLink href="/community-dashboard">
              Start Testing
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </AutoTransitionLink>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
