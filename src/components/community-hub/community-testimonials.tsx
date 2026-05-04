"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquareQuote, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicTestimonials } from "@/lib/apiCallsAdmin";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function CommunityTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const duration = 10000;

  useEffect(() => {
    getPublicTestimonials().then((data) => {
      if (data && data.length > 0) setTestimonials(data);
    });
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, duration);
    return () => clearInterval(interval);
  }, [activeIndex, testimonials.length]);

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const getTestimonial = (offset: number) => {
    if (testimonials.length === 0) return null;
    return testimonials[(activeIndex + offset) % testimonials.length];
  };

  const stories = [
    getTestimonial(0),
    getTestimonial(1),
    getTestimonial(2),
    getTestimonial(3),
  ].filter(Boolean);

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

  return (
    <section
      data-loc="CommunityTestimonials"
      className="py-16 md:py-32 bg-gray-50 dark:bg-zinc-950/50"
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight">
            Community{" "}
            <span className="text-primary italic">Success Stories</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            Hear from developers and testers who benefited from the community
            hub.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-5 max-w-5xl mx-auto">
          {/* Large Left Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl h-full overflow-hidden relative group min-h-[280px] md:min-h-[380px]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="p-5 md:p-6 flex flex-col justify-between h-full bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <MessageSquareQuote className="text-red-500 w-6 h-6 md:w-8 md:h-8 mb-3 md:mb-4" />
                  <p className="text-sm md:text-lg leading-relaxed text-muted-foreground mb-4 md:mb-6 font-medium">
                    "{stories[0].comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                  <Image
                    src={stories[0].avatar}
                    alt={stories[0].name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-8 h-8 md:w-10 md:h-10"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-xs md:text-sm">
                      {stories[0].name}
                    </span>
                    <span className="text-[10px] md:text-xs text-muted-foreground">
                      {stories[0].role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column Stack */}
          <div className="lg:col-span-7 flex flex-col gap-3 md:gap-5">
            {/* Top Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="hidden md:block"
            >
              <div className="rounded-2xl overflow-hidden relative group min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="p-5 md:p-6 flex flex-col justify-between h-full bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <div>
                    <MessageSquareQuote className="text-red-500 w-5 h-5 mb-2" />
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-medium">
                      "{stories[1].comment}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 pt-2 mt-auto">
                    <Image
                      src={stories[1].avatar}
                      alt={stories[1].name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover w-7 h-7 md:w-9 md:h-9"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-xs md:text-sm">
                        {stories[1].name}
                      </span>
                      <span className="text-[10px] md:text-xs text-muted-foreground">
                        {stories[1].role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Two Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="hidden md:block"
              >
                <div className="rounded-2xl overflow-hidden relative group min-h-[140px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <div className="p-4 md:p-5 flex flex-col justify-between h-full bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                    <div>
                      <MessageSquareQuote className="text-red-500 w-4 h-4 mb-2" />
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        "{stories[2].comment}"
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Image
                        src={stories[2].avatar}
                        alt={stories[2].name}
                        width={28}
                        height={28}
                        className="rounded-full object-cover w-6 h-6 md:w-8 md:h-8"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-[10px] md:text-xs">
                          {stories[2].name}
                        </span>
                        <span className="text-[9px] md:text-[10px] text-muted-foreground">
                          {stories[2].role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 - Dark */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="rounded-2xl overflow-hidden relative group min-h-[120px] md:min-h-[140px] bg-zinc-900 dark:bg-black text-white">
                  <div className="p-4 md:p-5 flex flex-col justify-between h-full rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                    <div>
                      <MessageSquareQuote className="text-red-500 w-4 h-4 mb-2" />
                      <p className="text-gray-300 text-xs leading-relaxed">
                        "{stories[3].comment}"
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Image
                        src={stories[3].avatar}
                        alt={stories[3].name}
                        width={28}
                        height={28}
                        className="rounded-full object-cover w-6 h-6 md:w-8 md:h-8"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-[10px] md:text-xs">
                          {stories[3].name}
                        </span>
                        <span className="text-gray-400 text-[9px] md:text-[10px]">
                          {stories[3].role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center justify-center gap-4 mt-8"
        >
          <Button
            variant="secondary"
            size="icon"
            onClick={handlePrev}
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <div className="flex-1 h-1.5 rounded-full bg-secondary max-w-[200px] overflow-hidden relative">
            <motion.div
              key={activeIndex}
              className="absolute inset-y-0 left-0 bg-primary"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleNext}
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 group">
            <Link href="/reviews">
              View All Stories
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
