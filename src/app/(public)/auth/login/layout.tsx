import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | inTesters",
  description: "Log in to your inTesters account to manage your app testing projects, track submissions, and connect with testers.",
  alternates: {
    canonical: "/auth/login",
  },
  openGraph: {
    title: "Log In | inTesters",
    description: "Log in to your inTesters account to manage your app testing projects.",
    url: "/auth/login",
    siteName: "inTesters",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
