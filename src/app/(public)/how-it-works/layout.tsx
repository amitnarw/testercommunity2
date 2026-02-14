import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | inTesters",
  description: "Learn how inTesters works. Choose between the free community testing path or professional testing packages to get your Android app tested by real users.",
  keywords: "how inTesters works, app testing process, community testing, professional testing, Android app testing, beta testing, user testing",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How It Works | inTesters",
    description: "Learn how inTesters works. Choose between the free community testing path or professional testing packages to get your Android app tested by real users.",
    type: "website",
    locale: "en_US",
    url: "/how-it-works",
    siteName: "inTesters",
    images: [
      {
        url: "/dark-mac.png",
        width: 1200,
        height: 630,
        alt: "inTesters Platform - How It Works",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works | inTesters",
    description: "Learn how inTesters works. Choose between the free community testing path or professional testing packages to get your Android app tested by real users.",
    images: ["/dark-mac.png"],
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}