import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App Testing Details | inTesters",
  description: "View detailed information about this handshake testing opportunity. Join the barter network and test each other's apps.",
  keywords: "app testing details, Android app testing, beta testing, user testing, app feedback, inTesters",
  alternates: {
    canonical: "/app/handshake-testing/[id]",
  },
  openGraph: {
    title: "App Testing Details | inTesters",
    description: "View detailed information about this handshake testing opportunity. Join the barter network and test each other's apps.",
    type: "website",
    locale: "en_US",
    url: "/app/handshake-testing/[id]",
    siteName: "inTesters",
    images: [
      {
        url: "/inTesters-logo-light.svg",
        width: 1200,
        height: 630,
        alt: "App Testing Details - inTesters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "App Testing Details | inTesters",
    description: "View detailed information about this handshake testing opportunity. Join the barter network and test each other's apps.",
    images: ["/inTesters-logo-light.svg"],
  },
};

export default function AppTestingDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}