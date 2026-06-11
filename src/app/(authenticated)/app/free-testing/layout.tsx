import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Testing | inTesters",
  description: "Discover and test Android apps with inTesters free testing. Browse available apps, track your testing requests, and participate in ongoing tests to earn points.",
  keywords: "app testing, Android testing, free testing, beta testing, user testing, app feedback, inTesters",
  alternates: {
    canonical: "/app/free-testing",
  },
  openGraph: {
    title: "Free Testing | inTesters",
    description: "Discover and test Android apps with inTesters free testing. Browse available apps, track your testing requests, and participate in ongoing tests to earn points.",
    type: "website",
    locale: "en_US",
    url: "/app/free-testing",
    siteName: "inTesters",
    images: [
      {
        url: "/inTesters-logo-light.svg",
        width: 1200,
        height: 630,
        alt: "inTesters Free Testing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Testing | inTesters",
    description: "Discover and test Android apps with inTesters free testing. Browse available apps, track your testing requests, and participate in ongoing tests to earn points.",
    images: ["/inTesters-logo-light.svg"],
  },
};

export default function FreeTestingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}