
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/authenticated/navbar";
import Footer from "@/components/authenticated/footer";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/authenticated/sidebar";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/page-transition";

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
    <PageTransition>
      <div className="relative flex flex-col min-h-screen">
        <div className="flex flex-1">
          <Sidebar
            onLogout={handleLogout}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
          <div className="flex flex-col flex-1 md:pl-20">
            <Navbar onLogout={handleLogout} />
            <main
              className="flex-1 bg-secondary/50"
            >
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
