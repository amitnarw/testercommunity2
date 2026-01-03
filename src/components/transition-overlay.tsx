"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransitionContext } from "@/context/transition-context";
import { expand } from "@/lib/animations";

export default function TransitionOverlay() {
  const { isTransitioning, targetLabel } = useTransitionContext();
  const nbOfColumns = 5;

  // ... (rest of the code)

  // ... (inside JSX)
  <p className="text-white text-4xl font-bold tracking-widest uppercase">
    {isTransitioning ? targetLabel || "" : ""}
  </p>;

  // We reuse the 'expand' animation but we need to adapt it for the entry(cover) phase.
  // In the original PageTransition, 'exit' was the covering phase (height 100vh).

  // We want the overlay to APPEAR when isTransitioning is true.
  // So 'initial' should be hidden, 'animate' should be covered.

  const anim = (variants: any, custom: number | null = null) => {
    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      custom,
      variants,
    };
  };

  // Creating specific variants for the overlay to match the 'exit' of the original PageTransition
  // The original PageTransition 'exit' was: height: "100vh", top: 0 (implied)

  const overlayVariants = {
    initial: {
      top: "100vh",
      height: "100vh",
    },
    enter: (i: number) => ({
      top: "0",
      height: "100vh",
      transition: {
        duration: 0.4,
        delay: 0.05 * i,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
    exit: (i: number) => ({
      // When checking out (if we ever unmount it while transitioning, which shouldn't happen usually until route change)
      // We can just keep it or let it slide out?
      // Actually, the PageTransition on the new page will handle the reveal.
      // So this overlay might just disappear or stay until unmount?
      // Next.js layout won't unmount if it's in root layout.
      // We want it to disappear when isTransitioning becomes false.

      // If isTransitioning becomes false (new page loaded), we want it to vanish INSTANTLY
      // because the new PageTransition is already there covering the screen.
      opacity: 0,
      transition: { duration: 0 },
    }),
  };

  return (
    <div data-loc="TransitionOverlay" className="stairs">
      <div
        className="transition-container"
        style={{ pointerEvents: "none", zIndex: 9999 }}
      >
        <AnimatePresence mode="wait">
          {isTransitioning && (
            <>
              {[...Array(nbOfColumns)].map((_, i) => {
                return (
                  <motion.div
                    key={i}
                    {...anim(overlayVariants, nbOfColumns - i)}
                  />
                );
              })}
              <motion.section
                className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <p className="text-white text-4xl font-bold tracking-widest uppercase">
                  {isTransitioning ? targetLabel || "" : ""}
                </p>
              </motion.section>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
