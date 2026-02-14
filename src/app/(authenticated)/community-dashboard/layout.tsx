import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Dashboard | inTesters",
  description: "Discover and test Android apps in the inTesters community. Browse available apps, track your testing requests, and participate in ongoing tests to earn points.",
  keywords: "app testing, Android testing, community testing, beta testing, user testing, app feedback, inTesters",
  alternates: {
    canonical: "/community-dashboard",
  },
  openGraph: {
    title: "Community Dashboard | inTesters",
    description: "Discover and test Android apps in the inTesters community. Browse available apps, track your testing requests, and participate in ongoing tests to earn points.",
    type: "website",
    locale: "en_US",
    url: "/community-dashboard",
    siteName: "inTesters",
    images: [
      {
        url: "/inTesters-logo.svg",
        width: 1200,
        height: 630,
        alt: "inTesters Community Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Dashboard | inTesters",
    description: "Discover and test Android apps in the inTesters community. Browse available apps, track your testing requests, and participate in ongoing tests to earn points.",
    images: ["/inTesters-logo.svg"],
  },
};

export default function CommunityDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}