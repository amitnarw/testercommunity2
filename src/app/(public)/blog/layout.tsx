import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | inTesters",
  description:
    "Deep dives into quality assurance, community stories, and the future of software testing.",
  openGraph: {
    title: "Blog | inTesters",
    description:
      "Deep dives into quality assurance, community stories, and the future of software testing.",
    type: "website",
    siteName: "inTesters",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}