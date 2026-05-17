import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | inTesters",
  description: "Create your inTesters account and start testing Android apps. Join a community of developers and testers to launch your app on Google Play.",
  alternates: {
    canonical: "/auth/register",
  },
  openGraph: {
    title: "Sign Up | inTesters",
    description: "Create your inTesters account and start testing Android apps.",
    url: "/auth/register",
    siteName: "inTesters",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
