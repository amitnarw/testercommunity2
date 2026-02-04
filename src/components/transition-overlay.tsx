"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransitionContext } from "@/context/transition-context";

// Helper components for intricate animations
const Curve = ({ height, color }: { height: number; color: string }) => {
  // SVG Curve path logic
  const initialPath = `M0 0 L100 0 L100 ${height} Q100 ${height} 50 ${height} 0 ${height} L0 0`;
  const targetPath = `M0 0 L100 0 L100 ${height} Q100 ${height + 100} 50 ${height + 100} 0 ${height} L0 0`;

  return (
    <svg
      className="absolute top-0 w-full h-[120%] -z-10"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path d={initialPath} fill={color} />
    </svg>
  );
  // Actually, animating SVG paths in framer-motion requires motion.path or d prop.
  // Simplifying Curve to a CSS border-radius for robustness first.
};

export default function TransitionOverlay() {
  const { isTransitioning, targetLabel, transitionType, transitionColor } =
    useTransitionContext();
  const [duration, setDuration] = useState(0.4);
  const [counter, setCounter] = useState(0);
  const [columns, setColumns] = useState(5);
  const [isMobile, setIsMobile] = useState(false);

  // Helper to resolve colors
  const getColorClasses = () => {
    switch (transitionColor) {
      case "primary":
        return {
          bg: "bg-primary",
          text: "text-primary-foreground",
          border: "border-primary-foreground/20",
        };
      case "background":
        return {
          bg: "bg-background",
          text: "text-foreground",
          border: "border-border/50",
        };
      case "black":
        return {
          bg: "bg-black",
          text: "text-white",
          border: "border-white/20",
        };
      case "white":
        return {
          bg: "bg-white",
          text: "text-black",
          border: "border-black/20",
        };
      default: // fallback to primary
        return {
          bg: "bg-primary",
          text: "text-primary-foreground",
          border: "border-primary-foreground/20",
        };
    }
  };

  const colors = getColorClasses();

  useEffect(() => {
    // Detect mobile for grid optimization
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setColumns(3);
    } else {
      setColumns(5);
    }

    if (isTransitioning) {
      const d = localStorage.getItem("transition-duration");
      let dur = 0.4;
      if (d) dur = parseInt(d) / 1000;
      setDuration(dur);

      if (transitionType === "counter") {
        setCounter(0);
        const interval = setInterval(
          () => {
            setCounter((prev) => {
              if (prev >= 100) {
                clearInterval(interval);
                return 100;
              }
              return prev + Math.floor(Math.random() * 15) + 5;
            });
          },
          (dur * 1000) / 10,
        );
        return () => clearInterval(interval);
      }
    } else {
      setCounter(0);
    }
  }, [isTransitioning, transitionType]);

  const anim = (variants: any, custom: any = null) => {
    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      custom,
      variants,
    };
  };

  // --- VARIANTS ---

  // 1. Stairs (Classic)
  const stairsVariants = {
    initial: { top: "100vh", height: "100vh" },
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
      top: "-100vh",
      transition: {
        duration: 0.4,
        delay: 0.05 * i,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  };

  // 3. Curve (Fluid)
  // We simulate a fluid wave using a really tall div that slides up with a border radius.
  const curveVariants = {
    initial: { top: "100vh", borderRadius: "100%" },
    enter: {
      top: "-10vh", // Go a bit higher to cover fully
      borderRadius: "0%",
      transition: {
        duration: duration + 0.2, // slower for fluid feel
        ease: [0.76, 0, 0.24, 1], // Custom bezier for fluid
      },
    },
    exit: {
      top: "-120vh", // Slide out completely
      borderRadius: "50%", // Curve back out?
      transition: {
        duration: duration + 0.2,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  // 4. Curtain (Split)
  // Two panels: Left and Right.
  const curtainLeftVariants = {
    initial: { x: "-100%" },
    enter: {
      x: "0%",
      transition: { duration: duration, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      x: "-100%",
      transition: { duration: duration, ease: [0.22, 1, 0.36, 1] },
    },
  };
  const curtainRightVariants = {
    initial: { x: "100%" },
    enter: {
      x: "0%",
      transition: { duration: duration, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      x: "100%",
      transition: { duration: duration, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const slideVariants = {
    initial: { x: "-100%" },
    enter: {
      x: "0%",
      transition: { duration: duration, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      x: "100%",
      transition: { duration: duration, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const zoomVariants = {
    initial: { scale: 0, opacity: 0 },
    enter: {
      scale: 1,
      opacity: 1,
      transition: { duration: duration, ease: "circOut" },
    },
    exit: {
      scale: 2,
      opacity: 0,
      transition: { duration: duration, ease: "circIn" },
    },
  };

  // --- RENDER LOGIC ---

  const renderContent = () => {
    switch (transitionType) {
      case "curve":
        return (
          <motion.div
            className={`fixed left-0 w-full h-[120vh] ${colors.bg} z-[9999] shadow-2xl`}
            style={{ left: 0, right: 0 }}
            {...anim(curveVariants)}
          />
        );
      case "curtain":
        return (
          <div className="fixed inset-0 z-[9999] pointer-events-none flex">
            <motion.div
              className={`w-1/2 h-full ${colors.bg} border-r ${colors.border}`}
              {...anim(curtainLeftVariants)}
            />
            <motion.div
              className={`w-1/2 h-full ${colors.bg} border-l ${colors.border}`}
              {...anim(curtainRightVariants)}
            />
          </div>
        );
      case "slide":
        return (
          <motion.div
            className={`fixed inset-0 z-[9999] ${colors.bg}`}
            {...anim(slideVariants)}
          />
        );
      case "zoom":
        // Zoom Wipe: Circle expanding from center? Or full screen scale.
        // Let's do a circular clip path reveal roughly?
        // Or just standard scale. User asked "new will zoom in from behind".
        // Overlay scales in, covers, then scales out larger?
        return (
          <motion.div
            className={`fixed inset-0 z-[9999] ${colors.bg}`}
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{
              clipPath: "circle(150% at 50% 50%)",
              transition: { duration: duration, ease: "easeInOut" },
            }}
            exit={{
              clipPath: "circle(0% at 50% 50%)",
              transition: { duration: duration, ease: "easeInOut" },
            }}
          />
        );
      case "counter":
        return (
          <div
            className={`fixed inset-0 z-[9999] ${colors.bg} flex items-center justify-center pb-32`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-9xl font-black tracking-tighter"
            >
              <span className={colors.text}>{Math.min(counter, 100)}%</span>
            </motion.div>
          </div>
        );

      case "stairs":
      default:
        return (
          <div className="flex h-screen w-screen fixed inset-0 z-[9999] pointer-events-none">
            {[...Array(columns)].map((_, i) => (
              <motion.div
                key={i}
                className={`relative h-full w-full ${colors.bg} border-r ${colors.border}`}
                {...anim(stairsVariants, columns - i)}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div data-loc="TransitionOverlay">
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key={`${transitionType}-${transitionColor}`}
            className="fixed inset-0 z-[9999] pointer-events-none"
          >
            {renderContent()}

            <motion.section
              className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <p
                className={`${colors.text} text-2xl md:text-4xl font-bold tracking-widest uppercase drop-shadow-lg text-center px-4`}
              >
                {targetLabel || ""}
              </p>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
