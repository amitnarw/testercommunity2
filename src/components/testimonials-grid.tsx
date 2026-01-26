"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/ui/magic-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";
import { Testimonial } from "@/lib/types";

interface TestimonialsGridProps {
  testimonials: Testimonial[];
}

export function TestimonialsGrid({ testimonials }: TestimonialsGridProps) {
  // We'll take the first 6 testimonials to display in the bento grid
  const displayTestimonials = testimonials.slice(0, 6);

  return (
    <div className="relative z-10 py-10 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {displayTestimonials.map((testimonial, i) => (
          <div
            key={i}
            className={cn(
              "row-span-1",
              i === 0 || i === 3 ? "lg:col-span-2" : "col-span-1",
            )}
          >
            <MagicCard
              className="flex-col items-start justify-between min-h-[250px] lg:min-h-[300px] p-6 lg:p-10 bg-white/50 dark:bg-black/40 backdrop-blur-xl border-white/20 dark:border-white/10 hover:border-primary/50 transition-colors duration-500"
              gradientColor="rgba(59, 130, 246, 0.15)" // Primary blueish tint
            >
              <div className="absolute top-6 right-6 lg:top-10 lg:right-10 opacity-20 dark:opacity-10">
                <Quote size={80} className="text-primary rotate-12" />
              </div>

              <div className="relative z-20 flex flex-col h-full justify-between">
                <div>
                  <div className="flex gap-1 mb-4 lg:mb-6">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className="fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                      />
                    ))}
                  </div>

                  <p
                    className={cn(
                      "font-medium leading-relaxed tracking-wide text-gray-700 dark:text-gray-200",
                      i === 0 || i === 3
                        ? "text-lg lg:text-2xl"
                        : "text-base lg:text-lg",
                    )}
                  >
                    "{testimonial.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-6 lg:mt-8 pt-6 border-t border-neutral-200 dark:border-white/10">
                  <div className="relative p-0.5 rounded-full bg-gradient-to-br from-primary via-purple-500 to-amber-500">
                    <Avatar className="h-10 w-10 lg:h-12 lg:w-12 border-2 border-background">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {testimonial.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm lg:text-base font-bold dark:text-white text-gray-900">
                      {testimonial.name}
                    </span>
                    <span className="text-xs lg:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Corner Accents for "Tech/Futuristic" feel */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/20 rounded-tl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/20 rounded-br-xl" />
            </MagicCard>
          </div>
        ))}
      </div>

      {/* Background Decorative Blobs */}
      <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-primary/10 blur-[128px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-purple-500/10 blur-[128px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
