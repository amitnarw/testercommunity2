"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface TransitionContextType {
  triggerTransition: (href: string) => void;
  isTransitioning: boolean;
  targetLabel: string;
  transitionType: string;
  setTransitionType: (type: string) => void;
  transitionColor: string;
  setTransitionColor: (color: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined,
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
    const durationStr = localStorage.getItem("transition-duration");
    const durationMs = durationStr ? parseInt(durationStr) : 400; // Default 400ms

    if (!enabled) {
      router.push(href);
      return;
    }

    setTargetLabel(getPageName(href));
    setIsTransitioning(true);

    // Buffer time to ensure animation starts/completes cleanly
    // If the duration is very short, ensuring at least a frame.
    setTimeout(() => {
      router.push(href);
    }, durationMs);
  };

  const [transitionType, setTransitionTypeState] = useState("stairs");
  const [transitionColor, setTransitionColorState] = useState("primary");

  useEffect(() => {
    const storedType = localStorage.getItem("transition-type");
    const validTypes = [
      "stairs",
      "curve",
      "curtain",
      "counter",
      "slide",
      "zoom",
    ];
    if (storedType && validTypes.includes(storedType)) {
      setTransitionTypeState(storedType);
    } else {
      setTransitionTypeState("stairs");
      localStorage.setItem("transition-type", "stairs");
    }

    const storedColor = localStorage.getItem("transition-color");
    if (storedColor) setTransitionColorState(storedColor);
  }, []);

  const setTransitionType = (type: string) => {
    setTransitionTypeState(type);
    localStorage.setItem("transition-type", type);
  };

  const setTransitionColor = (color: string) => {
    setTransitionColorState(color);
    localStorage.setItem("transition-color", color);
  };

  return (
    <TransitionContext.Provider
      value={{
        triggerTransition,
        isTransitioning,
        targetLabel,
        transitionType,
        setTransitionType,
        transitionColor,
        setTransitionColor,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionContext() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error(
      "useTransitionContext must be used within a TransitionProvider",
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
