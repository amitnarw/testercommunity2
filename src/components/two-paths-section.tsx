"use client";

import Link from "next/link";
import { CheckCircle2, Users, Briefcase, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import AnimatedRoundedButton from "./ui/animated-rounded-button";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function TwoPathsSection() {
  const { theme } = useTheme();
  // Ensure we have fallbacks if theme is undefined during hydration
  const safeTheme = theme || "dark";
  const hoverTextColor = safeTheme === "dark" ? "black" : "white";
  const hoverBgColor = safeTheme === "dark" ? "white" : "black";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for premium feel
      },
    },
  };

  return (
    <section
      data-loc="TwoPathsSection"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Decor - keeping strictly to existing look/feel but enhancing depth */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
              Two Paths to Get Your App Tested
            </h2>
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Whether you want to contribute to a community or need guaranteed
              professional results, we have a solution that fits your needs.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-stretch"
        >
          {/* Path 1: Community */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="rounded-[2.5rem] border-border/50 bg-secondary/60 dark:bg-secondary/40 backdrop-blur-sm h-full flex flex-col p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/20 group relative overflow-hidden">
              {/* Hover Gradient Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex-grow">
                <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-secondary mb-8 group-hover:scale-110 group-hover:bg-secondary/80 transition-all duration-300">
                  <Users className="w-10 h-10 text-foreground/80" />
                </div>

                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-3xl font-bold mb-2">
                    The Community Path
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    Test apps, earn points, and get your app tested by the
                    community.
                  </CardDescription>
                </CardHeader>

                <div className="mb-8 p-4 rounded-xl bg-secondary/30 inline-block w-full">
                  <span className="text-4xl font-bold tracking-tighter">
                    Free
                  </span>
                  <span className="text-muted-foreground ml-2 text-lg">
                    / forever
                  </span>
                </div>

                <ul className="space-y-4 mb-10">
                  {[
                    'Reciprocal "give-to-get" model',
                    "Earn points for testing other apps",
                    "Access a diverse pool of real users",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 group/item">
                      <CheckCircle2 className="w-5 h-5 text-primary/60 flex-shrink-0 mt-1 transition-colors group-hover/item:text-primary" />
                      <span className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <CardFooter className="p-0 mt-auto">
                <AnimatedRoundedButton
                  hoverTextColor="white"
                  border={true}
                  className="w-full bg-background/50 hover:bg-background transition-colors"
                >
                  <div className="flex items-center gap-2 font-medium w-full justify-center">
                    <Link
                      href="/community-dashboard"
                      className="text-foreground w-full h-full flex items-center justify-center absolute inset-0"
                    >
                      Explore Community Hub
                    </Link>
                    {/* Invisible text to maintain layout */}
                    <span className="opacity-0">Explore Community Hub</span>
                  </div>
                </AnimatedRoundedButton>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Path 2: Professional */}
          <motion.div
            variants={itemVariants}
            className="h-full relative transform md:-translate-y-4"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/30 to-primary/5 rounded-[2.6rem] blur-xl opacity-40 dark:opacity-30 pointer-events-none" />

            <Card className="rounded-[2.5rem] border-primary/20 bg-card shadow-[0_0_50px_-12px_hsl(var(--primary)/0.2)] h-full flex flex-col p-8 md:p-10 relative overflow-hidden z-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_60px_-12px_hsl(var(--primary)/0.3)]">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Sparkles className="w-32 h-32 text-primary rotate-12" />
              </div>

              <div className="absolute top-6 right-6">
                <Badge
                  className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 transition-colors pointer-events-none"
                  variant="outline"
                >
                  Recommended
                </Badge>
              </div>

              <div className="flex-grow">
                <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-primary/10 mb-8 text-primary shadow-inner shadow-primary/20">
                  <Briefcase className="w-10 h-10" />
                </div>

                <CardHeader className="p-0 mb-6 relative z-10">
                  <CardTitle className="text-3xl font-bold mb-2">
                    The Professional Path
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    Hire our professional testers for guaranteed, high-quality
                    results.
                  </CardDescription>
                </CardHeader>

                <div className="mb-8 p-4 rounded-xl bg-primary/5 border border-primary/10 inline-block w-full">
                  <span className="text-4xl font-bold tracking-tighter text-primary">
                    Paid
                  </span>
                  <span className="text-muted-foreground ml-2 text-lg">
                    / per project
                  </span>
                </div>

                <ul className="space-y-4 mb-10 relative z-10">
                  {[
                    "Guaranteed testing by vetted pros",
                    "Fast-track your launch",
                    "Managed process, hassle-free",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1 drop-shadow-sm" />
                      <span className="text-foreground font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <CardFooter className="p-0 mt-auto relative z-10">
                <AnimatedRoundedButton
                  backgroundColor="hsl(var(--primary))"
                  animatedBackgroundColor={hoverBgColor}
                  hoverTextColor={hoverTextColor}
                  normalTextColor="white"
                  borderRadius="9999px"
                  className="w-full shadow-lg shadow-primary/20"
                >
                  <div className="flex items-center gap-2 font-semibold w-full justify-center">
                    <Link
                      href="/pricing"
                      className="text-inherit w-full h-full flex items-center justify-center absolute inset-0"
                    >
                      View Point Packages
                    </Link>
                    {/* Invisible text to maintain layout */}
                    <span className="opacity-0">View Point Packages</span>
                  </div>
                </AnimatedRoundedButton>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
