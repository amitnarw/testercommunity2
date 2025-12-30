
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/authenticated/navbar";
import Footer from "@/components/authenticated/footer";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/authenticated/sidebar";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        <div className="flex flex-col flex-1 md:pl-20">
          <Navbar onLogout={handleLogout} />
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 bg-secondary/50"
            >
              {children}
            </motion.main>
          </AnimatePresence>
          <Footer />
        </div>
      </div>
    </div>
  );
}
