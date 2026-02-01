"use client";

import Link from "next/link";
import { Check, Users, Briefcase, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function TwoPathsSection() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"community" | "professional">(
    "community",
  );

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

  // Common card components based on PricingCard design
  const cardClasses = (isPopular: boolean) =>
    cn(
      "relative flex flex-col p-6 sm:p-8 rounded-3xl h-full transition-all duration-300",
      isPopular
        ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30"
        : "border text-card-foreground hover:shadow-xl",
    );

  const FeatureItem = ({
    text,
    isPopular,
  }: {
    text: string;
    isPopular: boolean;
  }) => (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
          isPopular ? "bg-white/20" : "bg-primary/10",
        )}
      >
        <Check
          className={cn("w-3 h-3", isPopular ? "text-white" : "text-primary")}
        />
      </div>
      <span
        className={cn(
          "text-sm",
          isPopular ? "text-primary-foreground/90" : "text-muted-foreground",
        )}
      >
        {text}
      </span>
    </div>
  );

  return (
    <section
      data-loc="TwoPathsSection"
      className="relative py-10 md:py-32 overflow-hidden flex flex-col justify-center"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-20"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
              Two Paths to Get{" "}
              <span className="text-primary italic">Your App</span> Tested
            </h2>
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
              Whether you want to contribute to a community or need guaranteed
              professional results, we have a solution that fits your needs.
            </p>
          </motion.div>
        </motion.div>

        {/* Mobile Tabs */}
        <div className="flex justify-center mb-8 md:hidden">
          <div className="bg-secondary/50 p-1.5 rounded-full flex items-center relative gap-1 border border-border/50 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("community")}
              className={cn(
                "px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative z-10",
                activeTab === "community"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Free
            </button>
            <button
              onClick={() => setActiveTab("professional")}
              className={cn(
                "px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative z-10",
                activeTab === "professional"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Paid
            </button>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-stretch"
        >
          {/* Mobile Animated Cards - Only visible on mobile */}
          <div className="block md:hidden">
            <AnimatePresence mode="wait">
              {activeTab === "community" ? (
                <motion.div
                  key="community-mobile"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={cardClasses(false)}
                  >
                    <div className="mb-8 relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-medium text-foreground">
                          The Community Path
                        </h3>
                      </div>

                      <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-bold tracking-tight">
                          Free
                        </span>
                        <span className="ml-2 text-sm font-medium text-muted-foreground">
                          / forever
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        Test apps, earn points, and get your app tested by the
                        community.
                      </p>
                    </div>

                    <div className="flex-1 space-y-4 mb-8 relative z-10">
                      {[
                        'Reciprocal "give-to-get" model',
                        "Earn points for testing other apps",
                        "Access a diverse pool of real users",
                      ].map((feature, i) => (
                        <FeatureItem key={i} text={feature} isPopular={false} />
                      ))}
                    </div>

                    <div className="mt-auto relative z-10">
                      <Link
                        href="/community-dashboard"
                        className="w-full block"
                      >
                        <Button
                          className="w-full py-6 rounded-full font-semibold text-base transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                          variant="outline"
                        >
                          Explore Community Hub
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="professional-mobile"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.05 }}
                    className={cardClasses(true)}
                  >
                    <>
                      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-black/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute top-6 right-6 opacity-20 rotate-12">
                        <Star className="w-24 h-24 fill-current text-white" />
                      </div>
                      <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                        <Badge className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg border-0">
                          Recommended
                        </Badge>
                      </div>
                    </>

                    <div className="mb-8 relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-white/20 rounded-xl">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-medium text-white">
                          The Professional Path
                        </h3>
                      </div>

                      <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-bold tracking-tight">
                          Paid
                        </span>
                        <span className="ml-2 text-sm font-medium text-primary-foreground/80">
                          / per project
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-primary-foreground/90">
                        Hire our professional testers for guaranteed,
                        high-quality results.
                      </p>
                    </div>

                    <div className="flex-1 space-y-4 mb-8 relative z-10">
                      {[
                        "Guaranteed testing by vetted pros",
                        "Fast-track your launch",
                        "Managed process, hassle-free",
                      ].map((feature, i) => (
                        <FeatureItem key={i} text={feature} isPopular={true} />
                      ))}
                    </div>

                    <div className="mt-auto relative z-10">
                      <Link href="/pricing" className="w-full block">
                        <HoverBorderGradient
                          containerClassName="w-full"
                          className="bg-white text-primary flex items-center justify-center space-x-2 w-full py-4 font-bold"
                        >
                          <Zap className="w-4 h-4 mr-2 fill-current" />
                          <span className="font-semibold">
                            View Point Packages
                          </span>
                        </HoverBorderGradient>
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Path 1: Community (Standard Style) - Desktop Only */}
          <div className="h-full hidden md:block">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={cardClasses(false)}
            >
              <div className="mb-8 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium text-foreground">
                    The Community Path
                  </h3>
                </div>

                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">
                    Free
                  </span>
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    / forever
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Test apps, earn points, and get your app tested by the
                  community.
                </p>
              </div>

              <div className="flex-1 space-y-4 mb-8 relative z-10">
                {[
                  'Reciprocal "give-to-get" model',
                  "Earn points for testing other apps",
                  "Access a diverse pool of real users",
                ].map((feature, i) => (
                  <FeatureItem key={i} text={feature} isPopular={false} />
                ))}
              </div>

              <div className="mt-auto relative z-10">
                <Link href="/community-dashboard" className="w-full block">
                  <Button
                    className="w-full py-6 rounded-full font-semibold text-base transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                    variant="outline"
                  >
                    Explore Community Hub
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Path 2: Professional (Popular Style) - Desktop Only */}
          <div className="h-full hidden md:block">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.05 }}
              className={cardClasses(true)}
            >
              <>
                <div className="absolute top-6 right-6 opacity-20 rotate-12">
                  <Star className="w-24 h-24 fill-current text-white" />
                </div>
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <Badge className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg border-0">
                    Recommended
                  </Badge>
                </div>
              </>

              <div className="mb-8 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-white/20 rounded-xl">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-white">
                    The Professional Path
                  </h3>
                </div>

                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">
                    Paid
                  </span>
                  <span className="ml-2 text-sm font-medium text-primary-foreground/80">
                    / per project
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-primary-foreground/90">
                  Hire our professional testers for guaranteed, high-quality
                  results.
                </p>
              </div>

              <div className="flex-1 space-y-4 mb-8 relative z-10">
                {[
                  "Guaranteed testing by vetted pros",
                  "Fast-track your launch",
                  "Managed process, hassle-free",
                ].map((feature, i) => (
                  <FeatureItem key={i} text={feature} isPopular={true} />
                ))}
              </div>

              <div className="mt-auto relative z-10">
                <Link href="/pricing" className="w-full block">
                  <HoverBorderGradient
                    containerClassName="w-full"
                    className="bg-white text-primary flex items-center justify-center space-x-2 w-full py-4 font-bold"
                  >
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    <span className="font-semibold">View Point Packages</span>
                  </HoverBorderGradient>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
