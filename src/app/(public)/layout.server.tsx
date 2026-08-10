import type { Metadata } from "next";

// Home page specific metadata
export const metadata: Metadata = {
  title: "Professional Android App Testing & Google Play Testing",
  description: "Get your Android app tested by real users in just 14 days. Try our subscription-based Handshake Testing (barter model), or upgrade to Pro for guaranteed, professional results. Built for Google's 12-Tester Requirement.",
  keywords: "Android app testing, launch Android app, app testing community, Google Play requirements, 12 tester requirement, beta testing, user testing, app feedback",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Professional Android App Testing & Google Play Testing",
    description: "Get your Android app tested by real users in just 14 days. Try our subscription-based Handshake Testing (barter model), or upgrade to Pro for guaranteed, professional results. Built for Google's 12-Tester Requirement.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "inTesters",
    images: [
      {
        url: "/dark-mac.png",
        width: 1200,
        height: 630,
        alt: "inTesters Platform - App Testing Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Android App Testing & Google Play Testing",
    description: "Get your Android app tested by real users in just 14 days. Try our subscription-based Handshake Testing (barter model), or upgrade to Pro for guaranteed, professional results. Built for Google's 12-Tester Requirement.",
    images: ["/dark-mac.png"],
  },
};