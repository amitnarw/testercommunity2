"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { opacity, expand } from "@/lib/animations";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [transitionsEnabled, setTransitionsEnabled] = React.useState(true);

  React.useEffect(() => {
    // Check preference on mount and whenever the component updates (or just rely on mount if pref changes rarely/requires reload)
    // Since settings change might not re-render this layout immediately, user might need to reload or navigate.
    // But for navigation subsequent to change, checking here is good.
    const pref = localStorage.getItem("enable-page-transitions");
    if (pref === "false") {
      setTransitionsEnabled(false);
    } else {
      setTransitionsEnabled(true);
    }
  }, [pathname]); // Re-check on path change to ensure it's up to date

  const anim = (variants: any, custom: number | null = null) => {
    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      custom,
      variants,
    };
  };

  const nbOfColumns = 5;

  // If transitions are disabled, just render children without the animation wrapper logic
  if (!transitionsEnabled) {
    return <>{children}</>;
  }

  return (
    <div key={pathname} className="page stairs">
      <motion.div {...anim(opacity)} className="transition-background" />
      <div className="transition-container">
        {[...Array(nbOfColumns)].map((_, i) => {
          return <motion.div key={i} {...anim(expand, nbOfColumns - i)} />;
        })}
      </div>
      {children}
    </div>
  );
}
