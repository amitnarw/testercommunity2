"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/page-transition";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, isPending } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/tester/login") ||
    pathname.startsWith("/tester/register");

  const isSamplePage = pathname.startsWith("/samples");

  // Sample pages get their own minimal layout without navbar/footer
  if (isSamplePage) {
    return <PageTransition>{children}</PageTransition>;
  }

  if (isAuthPage) {
    return <PageTransition>{children}</PageTransition>;
  }

  return (
    <PageTransition>
      <div className="relative flex flex-col min-h-screen">
        {!isPending && (
          <Header
            session={session}
            isDashboardPage={false}
            isMobileMenuOpen={isMobileMenuOpen}
            setMobileMenuOpen={setIsMobileMenuOpen}
            isSidebarCollapsed={true}
            setSidebarCollapsed={() => {}}
          />
        )}
        <main className="flex-1 bg-background z-10 pt-14">{children}</main>
        {!isPending && <Footer />}
      </div>
    </PageTransition>
  );
}
