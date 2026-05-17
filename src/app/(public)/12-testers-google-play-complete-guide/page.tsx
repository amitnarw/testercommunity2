import type { Metadata } from "next";
import {
  BreadcrumbJsonLd,
  SoftwareApplicationJsonLd,
  FAQPageJsonLd,
} from "@/components/schema";
import GuidePageClient from "./page.client";

const faqItems = [
  {
    question: "How many testers do I need for Google Play?",
    answer:
      "You need at least 12 people to opt into your closed test. They must use your app on real Android devices for 14 days before you can apply for production access.",
  },
  {
    question: "Can I get 12 testers in 24 hours?",
    answer:
      "Yes. A service like inTesters can get you 12 qualified testers within 24 hours. The testers are real people with real phones who will stay active for the full 14 days.",
  },
  {
    question: "Does Google really need 12 testers for 14 days?",
    answer:
      "Yes. The rule says at least 12 testers using your app for 14 days in a row. If you drop below 12 for even one day, the 14-day clock resets completely.",
  },
  {
    question: "What if a tester uninstalls my app?",
    answer:
      "If your active count drops below 12, Google resets the clock. That's why you should start with 15-20 testers, not exactly 12.",
  },
  {
    question: "Does this apply to all developers?",
    answer:
      "Only personal developer accounts created after November 13, 2023. Business and organization accounts usually don't need to do this.",
  },
  {
    question: "How long does the whole process take?",
    answer:
      "The testing period is 14 days minimum. With inTesters, you can have testers enrolled in 24 hours. So the total time is about 15-16 days.",
  },
  {
    question: "Can I reuse the same testers for multiple apps?",
    answer:
      "Yes. The same people can test several of your apps. But each app needs its own 14-day testing period.",
  },
  {
    question: "Whats the fastest way to get 12 testers?",
    answer:
      "A professional testing service is the fastest and most reliable option. inTesters gives you real, committed testers who will complete the full 14 days.",
  },
];

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

export default function GooglePlay12TestersGuide() {
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
      <SoftwareApplicationJsonLd
        name="inTesters - Google Play 12 Testers Service"
        description="Professional testing service to help Android developers meet Google Play's 12-tester closed testing requirement."
        operatingSystem="Android"
        applicationCategory="DeveloperApplication"
        url="https://intesters.com"
      />
      <FAQPageJsonLd items={faqItems} />
      <GuidePageClient />
    </>
  );
}
