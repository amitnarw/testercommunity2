import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/lib/query-provider";
import { TransitionProvider } from "@/context/transition-context";
import TransitionOverlay from "@/components/transition-overlay";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://intesters.com"),
  title: {
    default: "inTesters | App Testing Community Platform",
    template: "%s | inTesters",
  },
  description: "Join the inTesters community to test Android apps and earn points. Get feedback for your apps from real users and launch with confidence.",
  keywords: "app testing, Android testing, beta testing, user testing, app feedback, community testing, inTesters",
  authors: [{ name: "inTesters Team" }],
  creator: "inTesters",
  publisher: "inTesters",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "inTesters",
    title: "inTesters | App Testing Community Platform",
    description: "Join the inTesters community to test Android apps and earn points. Get feedback for your apps from real users and launch with confidence.",
    images: [
      {
        url: "/inTesters-logo.svg",
        width: 1200,
        height: 630,
        alt: "inTesters - App Testing Community Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "inTesters | App Testing Community Platform",
    description: "Join the inTesters community to test Android apps and earn points. Get feedback for your apps from real users and launch with confidence.",
    images: ["/inTesters-logo.svg"],
    creator: "@inTesters",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Playfair+Display:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <TransitionProvider>
              <TransitionOverlay />
              {children}
            </TransitionProvider>
          </QueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
