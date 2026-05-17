import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | inTesters",
  description: "Verify your email address to activate your inTesters account and start testing Android apps.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
