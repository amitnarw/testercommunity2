import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews & Success Stories | inTesters",
  description: "Read reviews and success stories from developers and testers who have used inTesters to launch their Android apps successfully.",
  keywords: "inTesters reviews, success stories, app testing testimonials, developer reviews, tester experiences, Android app launch, community testing",
  alternates: {
    canonical: "/reviews",
  },
  openGraph: {
    title: "Reviews & Success Stories | inTesters",
    description: "Read reviews and success stories from developers and testers who have used inTesters to launch their Android apps successfully.",
    type: "website",
    locale: "en_US",
    url: "/reviews",
    siteName: "inTesters",
    images: [
      {
        url: "/dark-mac.png",
        width: 1200,
        height: 630,
        alt: "inTesters Reviews - Success Stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reviews & Success Stories | inTesters",
    description: "Read reviews and success stories from developers and testers who have used inTesters to launch their Android apps successfully.",
    images: ["/dark-mac.png"],
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}