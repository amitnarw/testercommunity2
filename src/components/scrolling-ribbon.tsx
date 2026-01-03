"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const RibbonText = () => (
  <>
    <span className="mx-8">Join the Tribe</span>
    <span className="text-primary-foreground/50 mx-8">•</span>
    <span className="mx-8">Find Bugs</span>
    <span className="text-primary-foreground/50 mx-8">•</span>
    <span className="mx-8">Get Paid</span>
    <span className="text-primary-foreground/50 mx-8">•</span>
    <span className="mx-8">Level Up Your Skills</span>
    <span className="text-primary-foreground/50 mx-8">•</span>
    <span className="mx-8">Ship Faster</span>
    <span className="text-primary-foreground/50 mx-8">•</span>
    <span className="mx-8">Build Better Apps</span>
    <span className="text-primary-foreground/50 mx-8">•</span>
  </>
);

export function ScrollingRibbon() {
  const ribbonRef1 = useRef<HTMLDivElement>(null);
  const ribbonRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (ribbonRef1.current) {
            const speed = -0.35;
            const movement = lastScrollY * speed;
            ribbonRef1.current.style.transform = `translateX(${movement}px)`;
          }
          if (ribbonRef2.current) {
            const speed = 0.35;
            const movement = lastScrollY * speed - 3000;
            ribbonRef2.current.style.transform = `translateX(${movement}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      data-loc="ScrollingRibbon"
      className="w-full overflow-hidden py-4 transform -skew-y-2"
    >
      <div className="flex flex-col gap-2">
        <div className="flex whitespace-nowrap text-lg md:text-3xl font-bold uppercase tracking-wider text-primary-foreground select-none bg-primary">
          <div ref={ribbonRef1} className="flex my-2 sm:my-6">
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
          </div>
        </div>
        <div className="flex whitespace-nowrap text-lg md:text-3xl font-bold uppercase tracking-wider text-primary-foreground select-none bg-primary">
          <div ref={ribbonRef2} className="flex my-2 sm:my-6">
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
            <RibbonText />
          </div>
        </div>
      </div>
    </section>
  );
}
