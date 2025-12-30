
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  initial: {
    x: "100%",
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

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

  if (isAuthPage) {
    return (
       <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 bg-background"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    );
  }

  return (
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
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 bg-background z-10"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {!isPending && <Footer />}
    </div>
  );
}
