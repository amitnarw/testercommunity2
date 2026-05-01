"use client";

import { motion } from "framer-motion";
import { CheckCircle, Coins, Star, Users, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutoTransitionLink } from "@/components/auto-transition-link";

const benefits = [
  {
    icon: Coins,
    title: "Earn Points",
    description: "Get rewarded for every valid test you complete",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Priority Access",
    description: "Be first in line when new apps are posted",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Star,
    title: "Build Reputation",
    description: "Earn badges and climb the leaderboard",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Users,
    title: "Join Community",
    description: "Connect with 500+ testers worldwide",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: CheckCircle,
    title: "Real Feedback",
    description: "Meaningful insights from real users",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ShieldCheck,
    title: "Risk Free",
    description: "No money required, just your time",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export function MemberBenefits() {
  return (
    <section
      data-loc="MemberBenefits"
      className="py-16 md:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight">
            Everything You Need to{" "}
            <span className="text-primary italic">Get Started</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Join thousands of testers and developers in the most rewarding app
            testing community.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-5 md:p-6 rounded-2xl bg-card border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                  benefit.bg,
                )}
              >
                <benefit.icon className={cn("w-6 h-6", benefit.color)} />
              </div>
              <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 md:mt-16 max-w-2xl mx-auto"
        >
          <div className="relative p-8 md:p-10 rounded-3xl overflow-hidden">
            {/* Glow effects */}
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-[80px] -rotate-12 pointer-events-none" />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>Free to Join</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold font-heading mb-3">
                Ready to Start Earning Points?
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                No credit card required. Simply sign up, test apps, and earn
                points to get your own app tested.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto rounded-full px-8 shadow-lg shadow-primary/30 group"
                >
                  <AutoTransitionLink href="/auth/register">
                    <span className="font-bold">Get Started Free</span>
                  </AutoTransitionLink>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full px-8"
                >
                  <AutoTransitionLink href="/community-dashboard">
                    Preview Community Hub
                  </AutoTransitionLink>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>500+ Active Testers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>45,000+ Points Earned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>250+ Apps Tested</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
