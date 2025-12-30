

"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/authenticated/navbar";
import Footer from "@/components/authenticated/footer";
import { Sidebar } from "@/components/authenticated/sidebar";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfessionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      !session?.user?.id ||
      ((session as any)?.role !== "tester" &&
        pathname !== "/tester/login" &&
        pathname !== "/tester/register")
    ) {
      router.replace("/tester/login");
    }
    if (
      session?.user?.id &&
      (session as any)?.role === "tester" &&
      (pathname === "/tester/login" || pathname === "/tester/register")
    ) {
      router.replace("/tester/dashboard");
    }
  }, [pathname, router, session]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  const isAuthPage =
    pathname === "/tester/login" || pathname === "/tester/register";

  if (isAuthPage) {
    return (
        <AnimatePresence mode="wait">
            <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-1 bg-background"
            >
                {children}
            </motion.main>
        </AnimatePresence>
    );
  }

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen">
      <Sidebar
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 md:pl-20`}
      >
        <Navbar onLogout={handleLogout} />
        <AnimatePresence mode="wait">
          <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 bg-secondary/50"
          >
              {children}
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </div>
  );
}
