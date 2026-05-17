import type { Metadata } from "next";
import PublicClientLayout from "./layout.client";
import { BreadcrumbJsonLd } from "@/components/schema";

// Home page specific metadata
export const metadata: Metadata = {
  title: "Launch Your Android App in 14 Days | inTesters",
  description: "Get your Android app tested by real users in just 14 days. Meet Google's 12-tester requirement fast with inTesters. Earn points for testing apps in our Community Hub, or upgrade to Pro for guaranteed, professional results. Built for Google's 12-Tester Requirement.",
  keywords: "Android app testing, launch Android app, app testing community, Google Play 12 testers requirement, 12 tester requirement, Google Play closed testing, beta testing, user testing, app feedback, get 12 testers fast, 12 testers in 14 days, Google Play production access",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Launch Your Android App in 14 Days | inTesters",
    description: "Get your Android app tested by real users in just 14 days. Meet Google's 12-tester requirement with inTesters.",
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
    description: "Get your Android app tested by real users in just 14 days. Meet Google's 12-tester requirement with inTesters.",
    images: ["/dark-mac.png"],
  },
};

// Server component that renders the client layout
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
        ]}
      />
      <PublicClientLayout>{children}</PublicClientLayout>
    </>
  );
}
