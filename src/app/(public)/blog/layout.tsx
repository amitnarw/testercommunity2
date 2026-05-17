import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | inTesters",
  description:
    "Deep dives into quality assurance, community stories, and the future of software testing. Learn how to meet Google Play's 12-tester requirement and launch your Android app.",
  keywords: "app testing blog, Google Play testing guide, Android testing tips, 12 testers requirement, closed testing guide, inTesters blog",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | inTesters",
    description:
      "Deep dives into quality assurance, community stories, and the future of software testing.",
    type: "website",
    url: "/blog",
    siteName: "inTesters",
    images: [
      {
        url: "/dark-mac.png",
        width: 1200,
        height: 630,
        alt: "inTesters Blog - App Testing & Development Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | inTesters",
    description:
      "Deep dives into quality assurance, community stories, and the future of software testing.",
    images: ["/dark-mac.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
