import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handshake Testing (Beta) | inTesters",
  description: "Discover and test Android apps with inTesters Handshake Testing. Browse available apps, track your testing requests, and participate in the 1:1 barter testing system.",
  keywords: "app testing, Android testing, Handshake Testing, beta testing, user testing, app feedback, inTesters",
  alternates: {
    canonical: "/app/handshake-testing",
  },
  openGraph: {
    title: "Handshake Testing (Beta) | inTesters",
    description: "Discover and test Android apps with inTesters Handshake Testing. Browse available apps, track your testing requests, and participate in the 1:1 barter testing system.",
    type: "website",
    locale: "en_US",
    url: "/app/handshake-testing",
    siteName: "inTesters",
    images: [
      {
        url: "/inTesters-logo-light.svg",
        width: 1200,
        height: 630,
        alt: "inTesters Handshake Testing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Handshake Testing (Beta) | inTesters",
    description: "Discover and test Android apps with inTesters Handshake Testing. Browse available apps, track your testing requests, and participate in the 1:1 barter testing system.",
    images: ["/inTesters-logo-light.svg"],
  },
};

export default function HandshakeTestingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}