"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  Quote,
  Star,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { testimonials } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CTASection } from "@/components/cta-section";

export default function SuccessStoriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern z-0 opacity-50"></div>

        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>

            <HoverBorderGradient
              containerClassName="rounded-full m-auto mb-6"
              as="div"
              className="dark:bg-black text-[10px] sm:text-xs bg-white text-black dark:text-white flex items-center space-x-2"
            >
              <BadgeCheck className="w-4 h-4 mr-2 text-primary" />
              <span>Verified Success Stories</span>
            </HoverBorderGradient>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading leading-tight tracking-tight font-bold mb-6 text-center mx-auto">
              Trusted by the{" "}
              <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                Community
              </span>
            </h1>

            <p className="text-lg md:text-xl font-body max-w-2xl mx-auto text-muted-foreground mb-10 leading-relaxed">
              Read what developers, testers, and product managers are saying
              about their experience with our platform. Real people, real
              results.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12 bg-gray-50 dark:bg-zinc-950/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: (index % 3) * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={cn(
                  "break-inside-avoid rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 flex flex-col relative group overflow-hidden transition-all duration-300",
                  "bg-background hover:shadow-xl hover:border-primary/20",
                  index % 4 === 0 &&
                    "bg-gradient-to-br from-background to-blue-50/50 dark:from-background dark:to-blue-900/10",
                  index % 4 === 2 &&
                    "bg-gradient-to-br from-background to-amber-50/50 dark:from-background dark:to-amber-900/10",
                )}
              >
                {/* Decoration */}
                <div className="absolute top-4 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote className="w-16 h-16 text-primary rotate-12" />
                </div>

                {/* Optional Review Image */}
                {testimonial.image && (
                  <div className="w-full h-48 mb-6 relative rounded-2xl overflow-hidden group-hover:shadow-md transition-all">
                    <Image
                      src={testimonial.image}
                      alt="Review context"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm"
                    />
                  ))}
                </div>

                <p
                  className={cn(
                    "text-muted-foreground leading-relaxed mb-6 font-medium relative z-10",
                    testimonial.comment.length < 100
                      ? "text-lg md:text-xl"
                      : "text-sm md:text-base",
                  )}
                >
                  "{testimonial.comment}"
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {testimonial.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-secondary text-secondary-foreground border border-border/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border/50 mt-auto">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-background shadow-md">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-bold text-sm text-foreground truncate">
                      {testimonial.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground truncate">
                        {testimonial.role}
                      </span>
                      {testimonial.dataAiHint && (
                        <span
                          className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-green-500 animate-pulse"
                          title="Verified User"
                        />
                      )}
                    </div>
                  </div>

                  {testimonial.appLink && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Link
                        href={testimonial.appLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Social Proof / Stats Section (Optional but good for layout) */}
      <section className="py-20 border-y bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-12">
            Join thousands of happy users
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
                10k+
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                Active Testers
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
                50k+
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                Bugs Reported
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
                98%
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                Satisfaction Rate
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
                24h
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                Avg. Turnaround
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
