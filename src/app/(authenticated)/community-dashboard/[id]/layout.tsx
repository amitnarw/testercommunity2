import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App Testing Details | inTesters",
  description: "View detailed information about this app testing opportunity. Join the community to test apps and earn points for your feedback.",
  keywords: "app testing details, Android app testing, beta testing, user testing, app feedback, inTesters",
  alternates: {
    canonical: "/community-dashboard/[id]",
  },
  openGraph: {
    title: "App Testing Details | inTesters",
    description: "View detailed information about this app testing opportunity. Join the community to test apps and earn points for your feedback.",
    type: "website",
    locale: "en_US",
    url: "/community-dashboard/[id]",
    siteName: "inTesters",
    images: [
      {
        url: "/inTesters-logo.svg",
        width: 1200,
        height: 630,
        alt: "App Testing Details - inTesters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "App Testing Details | inTesters",
    description: "View detailed information about this app testing opportunity. Join the community to test apps and earn points for your feedback.",
    images: ["/inTesters-logo.svg"],
  },
};

export default function AppTestingDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}