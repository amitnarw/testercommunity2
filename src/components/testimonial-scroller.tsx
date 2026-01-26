"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Star } from "lucide-react";
import { Testimonial } from "@/lib/types";

export const TestimonialScroller = ({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden bg-transparent py-4 md:py-12",
        className,
      )}
    >
      {/* Gradient Masks for smooth fade out */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 md:w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 md:w-32 bg-gradient-to-l from-background to-transparent" />

      {/* First Row - Moving Left */}
      <div className="relative w-full overflow-hidden">
        <Marquee pauseOnHover className="[--duration:40s]">
          {testimonials.map((testimonial, idx) => (
            <ReviewCard key={`row1-${idx}`} {...testimonial} />
          ))}
        </Marquee>
      </div>

      {/* Second Row - Moving Right (Reverse) */}
      <div className="relative w-full mt-6 overflow-hidden">
        <Marquee reverse pauseOnHover className="[--duration:40s]">
          {testimonials.map((testimonial, idx) => (
            <ReviewCard key={`row2-${idx}`} {...testimonial} />
          ))}
        </Marquee>
      </div>
    </div>
  );
};

const Marquee = ({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  [key: string]: any;
}) => {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
};

const ReviewCard = ({
  avatar,
  name,
  role,
  comment,
}: {
  avatar: string;
  name: string;
  role: string;
  comment: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-[350px] cursor-pointer overflow-hidden rounded-2xl p-6 transition-all duration-300",
        // Light mode
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] hover:-translate-y-1 hover:shadow-xl",
        // Dark mode
        "dark:bg-white/5 dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/50">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-bold dark:text-white text-gray-900">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-muted-foreground">{role}</p>
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
            />
          ))}
        </div>
      </div>
      <blockquote className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        "{comment}"
      </blockquote>

      {/* Decorative gradient sheen */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </figure>
  );
};
