import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Your Email | inTesters",
  description: "We've sent a verification link to your email. Please check your inbox to complete your inTesters registration.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
