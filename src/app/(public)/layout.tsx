import type { Metadata } from "next";
import PublicClientLayout from "./layout.client";
import { BreadcrumbJsonLd } from "@/components/schema";

// Home page specific metadata
export const metadata: Metadata = {
  title: "Android App Testing & Play Store Submission Help",
  description: "Real-user testing for Android apps — run your closed-track cycle end to end, generate the activity Google wants to see, and prepare your Play Store declaration.",
  keywords: "Android app testing, Play Store closed testing, real-device testing, app testing service, beta testing, user feedback, Play Store compliance",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Android App Testing & Play Store Submission Help",
    description: "Real-user testing for Android apps — run your closed-track cycle end to end, generate the activity Google wants to see, and prepare your Play Store declaration.",
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
    title: "Android App Testing & Play Store Submission Help",
    description: "Real-user testing for Android apps — run your closed-track cycle end to end, generate the activity Google wants to see, and prepare your Play Store declaration.",
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
