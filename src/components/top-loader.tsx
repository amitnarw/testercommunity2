"use client";

import NextTopLoader from "nextjs-toploader";

export function TopLoader() {
  return (
    <NextTopLoader
      color="hsl(217 91% 60%)"
      height={3}
      showSpinner={false}
      shadow={false}
      easing="ease"
      speed={300}
      crawlSpeed={200}
      zIndex={9999}
    />
  );
}
