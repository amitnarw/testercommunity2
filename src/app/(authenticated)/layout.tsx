"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/authenticated/navbar";
import Footer from "@/components/authenticated/footer";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/authenticated/sidebar";
import { authClient } from "@/lib/auth-client";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/auth/login");
      }
    }
  }, [session, router, isPending]);

  const handleLogout = () => {
    document.cookie = "isAuthenticated=false; path=/; max-age=0";
    router.push("/auth/login");
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
          <main className="flex-1 bg-secondary/50">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
