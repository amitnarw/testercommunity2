"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface TransitionContextType {
  triggerTransition: (href: string) => void;
  isTransitioning: boolean;
  targetLabel: string;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetLabel, setTargetLabel] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Reset transition state when path changes (navigation complete)
    setIsTransitioning(false);
    setTargetLabel("");
  }, [pathname]);

  const getPageName = (href: string) => {
    if (href === "/" || href === "") return "Home";
    // Remove query params
    const path = href.split("?")[0];
    // Get last segment or relevant segment
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return "Home";

    const lastSegment = segments[segments.length - 1];
    // Capitalize and replace dashes
    return (
      lastSegment.charAt(0).toUpperCase() +
      lastSegment.slice(1).replace(/-/g, " ")
    );
  };

  const triggerTransition = (href: string) => {
    if (pathname === href) return;

    // Check user preference
    const enabled = localStorage.getItem("enable-page-transitions") !== "false"; // Default to true if null

    if (!enabled) {
      router.push(href);
      return;
    }

    setTargetLabel(getPageName(href));
    setIsTransitioning(true);
    // Wait for the exit animation (e.g., 400ms to match the animation duration)
    // Faster: 400ms buffer (300ms animation + 100ms overlap)
    setTimeout(() => {
      router.push(href);
    }, 400);
  };

  return (
    <TransitionContext.Provider
      value={{ triggerTransition, isTransitioning, targetLabel }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionContext() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error(
      "useTransitionContext must be used within a TransitionProvider"
    );
  }
  return context;
}

export function useTransitionRouter() {
  const context = useContext(TransitionContext);
  const router = useRouter();

  if (context === undefined) {
    return router;
  }

  return {
    ...router,
    push: context.triggerTransition,
  };
}
