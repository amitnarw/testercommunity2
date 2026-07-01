import type { Metadata } from "next";
import {
  BreadcrumbJsonLd,
  SoftwareApplicationJsonLd,
  FAQPageJsonLd,
} from "@/components/schema";
import GuidePageClient from "./page.client";
import { serverGetPublicFaqs } from "@/lib/serverApi";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Google Play 12 Testers Requirement: Complete Guide (2026) | inTesters",
  description:
    "Complete guide to Google Play's 12-tester closed testing requirement. Learn how to get 12 testers fast, pass the 14-day requirement, and publish your Android app in 2026.",
  keywords:
    "Google Play 12 testers requirement, Google Play closed testing 14 days, how to get 12 testers fast, 12 testers in 24 hours, Google Play production access, Android app testing, Google Play tester requirement 2026, closed testing Google Play",
  alternates: {
    canonical: "/12-testers-google-play-complete-guide",
  },
  openGraph: {
    title:
      "Google Play 12 Testers Requirement: Complete Guide (2026)",
    description:
      "Complete guide to Google Play's 12-tester closed testing requirement. Learn how to get 12 testers fast and pass the 14-day requirement.",
    type: "article",
    url: "/12-testers-google-play-complete-guide",
    siteName: "inTesters",
    images: [
      {
        url: "/dark-mac.png",
        width: 1200,
        height: 630,
        alt: "Google Play 12 Testers Requirement Guide - inTesters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Google Play 12 Testers Requirement: Complete Guide (2026)",
    description:
      "Complete guide to Google Play's 12-tester closed testing requirement. Learn how to get 12 testers fast.",
    images: ["/dark-mac.png"],
  },
};

export default async function GooglePlay12TestersGuide() {
  const faqItems = await serverGetPublicFaqs("google_play_guide");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          {
            name: "12 Testers Guide",
            url: "/12-testers-google-play-complete-guide",
          },
        ]}
      />
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd
        items={faqItems.map((faq) => ({
          question: faq.title,
          answer: faq.description,
        }))}
      />
      <GuidePageClient />
    </>
  );
}
