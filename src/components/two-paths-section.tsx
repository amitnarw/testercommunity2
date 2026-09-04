"use client";

import { HorizontalPinPricing } from "./horizontal-pin-pricing";

export function TwoPathsSection() {
  return (
    <section
      data-loc="TwoPathsSection"
      className="relative py-10 md:py-32 bg-background"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.2] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-2">
            Two Paths to Get{" "}
            <span className="text-primary italic">Your App</span> Tested
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
            Handshake Testing is free for everyone. Choose Professional Testing
            for guaranteed paid results.
          </p>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <HorizontalPinPricing variant="home" />
      </div>
    </section>
  );
}
