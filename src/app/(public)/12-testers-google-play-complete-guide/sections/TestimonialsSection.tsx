"use client";

import dynamic from "next/dynamic";

const SuccessStories = dynamic(
  () => import("@/components/success-stories").then((m) => ({ default: m.SuccessStories })),
  { ssr: false },
);

export function TestimonialsSection() {
  return <SuccessStories />;
}
