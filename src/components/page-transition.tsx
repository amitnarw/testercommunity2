"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [transitionsEnabled, setTransitionsEnabled] = useState(true);

  useEffect(() => {
    const pref = localStorage.getItem("enable-page-transitions");

    if (pref === "false") {
      setTransitionsEnabled(false);
    } else {
      setTransitionsEnabled(true);
    }
  }, [pathname]);

  // If disabled, just render children
  if (!transitionsEnabled) {
    return <>{children}</>;
  }

  // We rely on TransitionOverlay to handle the visual transition for all types.
  // PageTransition just wraps the content.
  return <div className="page">{children}</div>;
}
