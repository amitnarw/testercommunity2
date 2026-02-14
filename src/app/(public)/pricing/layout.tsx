import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | inTesters",
  description: "View inTesters pricing and testing packages. Choose between free community testing or professional testing packages for guaranteed results.",
  keywords: "inTesters pricing, app testing packages, professional testing, community testing, Android app testing, beta testing, user testing",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing | inTesters",
    description: "View inTesters pricing and testing packages. Choose between free community testing or professional testing packages for guaranteed results.",
    type: "website",
    locale: "en_US",
    url: "/pricing",
    siteName: "inTesters",
    images: [
      {
        url: "/dark-mac.png",
        width: 1200,
        height: 630,
        alt: "inTesters Pricing - App Testing Packages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | inTesters",
    description: "View inTesters pricing and testing packages. Choose between free community testing or professional testing packages for guaranteed results.",
    images: ["/dark-mac.png"],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}