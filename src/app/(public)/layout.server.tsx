import type { Metadata } from "next";

// Home page specific metadata
export const metadata: Metadata = {
  title: "Launch Your Android App in 14 Days | inTesters",
  description: "Get your Android app tested by real users in just 14 days. Earn points for testing apps in our Community Hub, or upgrade to Pro for guaranteed, professional results. Built for Google's 12-Tester Requirement.",
  keywords: "Android app testing, launch Android app, app testing community, Google Play requirements, 12 tester requirement, beta testing, user testing, app feedback",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Launch Your Android App in 14 Days | inTesters",
    description: "Get your Android app tested by real users in just 14 days. Earn points for testing apps in our Community Hub, or upgrade to Pro for guaranteed, professional results. Built for Google's 12-Tester Requirement.",
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
    title: "Launch Your Android App in 14 Days | inTesters",
    description: "Get your Android app tested by real users in just 14 days. Earn points for testing apps in our Community Hub, or upgrade to Pro for guaranteed, professional results. Built for Google's 12-Tester Requirement.",
    images: ["/dark-mac.png"],
  },
};