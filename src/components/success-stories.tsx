"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquareQuote, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/lib/data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function SuccessStories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const duration = 10000;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, duration);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const getTestimonial = (offset: number) => {
    return testimonials[(activeIndex + offset) % testimonials.length];
  };

  const stories = [
    getTestimonial(0),
    getTestimonial(1),
    getTestimonial(2),
    getTestimonial(3),
  ];

  // Animation variants remain the same
  const variantsUp = {
    enter: { y: "100%" },
    center: { y: 0 },
    exit: { y: "-100%" },
  };

  const variantsLeft = {
    enter: { x: "100%" },
    center: { x: 0 },
    exit: { x: "-100%" },
  };

  const variantsDown = {
    enter: { y: "-100%" },
    center: { y: 0 },
    exit: { y: "100%" },
  };

  const variantsRight = {
    enter: { x: "-100%" },
    center: { x: 0 },
    exit: { x: "100%" },
  };

  const transition = { duration: 0.8, ease: "easeInOut" };

  // New Segmented "Stories" Progress Bar
  const StoriesPagination = () => (
    <div className="flex items-center justify-center gap-4 mt-2 md:mt-5 w-full max-w-sm mx-auto px-4">
      {/* Prev Button */}
      <Button
        variant="secondary"
        size="icon"
        onClick={handlePrev}
        className="rounded-full shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
      </Button>

      {/* Single Progress Bar */}
      <div className="flex-1 h-1.5 md:h-2 rounded-full bg-secondary dark:bg-secondary overflow-hidden relative">
        <motion.div
          key={activeIndex}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      </div>

      {/* Next Button */}
      <Button
        variant="secondary"
        size="icon"
        onClick={handleNext}
        className="rounded-full shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );

  return (
    <section className="pb-12 sm:pb-40 pt-8 sm:pt-20 bg-gray-50 dark:bg-zinc-950/50 flex flex-col justify-center">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-5xl font-bold font-heading tracking-tight leading-none mb-3 md:mb-4">
            Trusted by a{" "}
            <span className="text-primary italic mr-2">Community</span> of
            Innovators
          </h2>
          <p className="text-muted-foreground text-xs md:text-base">
            Find out how our happy clients are raving about us.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-5 max-w-5xl mx-auto">
          {/* Left Column (Large Card) - Animation: UP */}
          <div className="lg:col-span-5 h-full">
            <div className="rounded-xl md:rounded-2xl h-full overflow-hidden grid place-items-stretch relative group">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={stories[0].name}
                  variants={variantsUp}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="col-start-1 row-start-1 flex flex-col justify-between p-3 md:p-6 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow rounded-xl md:rounded-2xl min-h-[250px] md:min-h-[380px]"
                >
                  <div>
                    <MessageSquareQuote className="text-red-500 w-4 h-4 md:w-8 md:h-8 mb-1 md:mb-4" />

                    <p className="text-sm md:text-xl leading-relaxed text-muted-foreground mb-1 md:mb-6 font-medium line-clamp-3 md:line-clamp-none">
                      "{stories[0].comment}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-2 md:pt-4 mt-auto">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Image
                        src={stories[0].avatar}
                        alt={stories[0].name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-6 h-6 md:w-10 md:h-10"
                      />
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-foreground text-[10px] md:text-sm">
                          {stories[0].name}
                        </span>
                        <span className="text-[10px] md:text-xs text-muted-foreground">
                          {stories[0].role}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 flex flex-col gap-3 md:gap-5 h-full">
            {/* Top Wide Card - Animation: LEFT */}
            <div className="hidden md:grid rounded-xl md:rounded-2xl flex-1 overflow-hidden place-items-stretch relative group">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={stories[1].name}
                  variants={variantsLeft}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="col-start-1 row-start-1 p-4 md:p-6 flex flex-col justify-between bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow rounded-xl md:rounded-2xl min-h-[220px] md:min-h-[170px]"
                >
                  <div>
                    <MessageSquareQuote className="text-red-500 w-5 h-5 md:w-6 md:h-6 mb-3" />

                    <p className="text-muted-foreground mb-4 leading-relaxed text-xs md:text-base font-medium">
                      "{stories[1].comment}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Image
                        src={stories[1].avatar}
                        alt={stories[1].name}
                        width={36}
                        height={36}
                        className="rounded-full object-cover w-7 h-7 md:w-9 md:h-9"
                      />
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-foreground text-xs md:text-sm">
                          {stories[1].name}
                        </span>
                        <span className="text-[10px] md:text-xs text-muted-foreground">
                          {stories[1].role}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Two Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 flex-1">
              {/* Light Card - Animation: DOWN */}
              <div className="hidden md:grid rounded-xl md:rounded-2xl overflow-hidden place-items-stretch relative h-full group">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={stories[2].name}
                    variants={variantsDown}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={transition}
                    className="col-start-1 row-start-1 p-4 md:p-5 flex flex-col justify-between bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow rounded-xl md:rounded-2xl min-h-[200px] md:min-h-[160px]"
                  >
                    <div>
                      <MessageSquareQuote className="text-red-500 w-5 h-5 md:w-6 md:h-6 mb-3" />
                      <p className="text-muted-foreground leading-relaxed text-[10px] md:text-xs">
                        "{stories[2].comment}"
                      </p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 mt-3 md:mt-4">
                      <Image
                        src={stories[2].avatar}
                        alt={stories[2].name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover w-6 h-6 md:w-8 md:h-8"
                      />
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-foreground text-[10px] md:text-xs">
                          {stories[2].name}
                        </span>
                        <span className="text-[9px] md:text-[10px] text-muted-foreground">
                          {stories[2].role}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dark Card - Animation: RIGHT */}
              <div className="rounded-xl md:rounded-2xl overflow-hidden grid place-items-stretch relative h-full group">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={stories[3].name}
                    variants={variantsRight}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={transition}
                    className="col-start-1 row-start-1 p-3 md:p-5 flex flex-col justify-between bg-zinc-900 dark:bg-black text-white shadow-sm hover:shadow-md transition-shadow rounded-xl md:rounded-2xl min-h-[120px] md:min-h-[160px]"
                  >
                    <div>
                      <MessageSquareQuote className="text-red-500 w-4 h-4 md:w-6 md:h-6 mb-1 md:mb-3" />
                      <p className="text-gray-300 leading-relaxed text-[9px] md:text-xs line-clamp-2 md:line-clamp-none">
                        "{stories[3].comment}"
                      </p>
                    </div>
                    <div className="flex items-center gap-1 md:gap-3 mt-1 md:mt-4">
                      <Image
                        src={stories[3].avatar}
                        alt={stories[3].name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover w-5 h-5 md:w-8 md:h-8"
                      />
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-white text-[9px] md:text-xs">
                          {stories[3].name}
                        </span>
                        <span className="text-[8px] md:text-[10px] text-gray-400">
                          {stories[3].role}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <StoriesPagination />

        {/* View All Reviews Button */}
        <div className="mt-5 md:mt-8 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 group font-medium text-base"
          >
            <Link href="/reviews">
              View All Success Stories
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
