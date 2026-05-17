import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "Page Not Found (404) | inTesters",
  description: "The page you were looking for doesn't exist. Return to inTesters to continue testing your Android apps.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return <NotFoundContent />;
}
