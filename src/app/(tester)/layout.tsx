"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/authenticated/navbar";
import Footer from "@/components/authenticated/footer";
import { Sidebar } from "@/components/authenticated/sidebar";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/page-transition";
import { ROUTES } from "@/lib/routes";

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
    if (isPending) return;

    const roleName = (session as any)?.role?.name;
    const isAuthPage =
      pathname === ROUTES.TESTER.AUTH.LOGIN ||
      pathname === ROUTES.TESTER.AUTH.REGISTER;

    if (
      !session?.user?.id ||
      (!isAuthPage && roleName !== "tester" && roleName !== "super_admin")
    ) {
      router.replace(ROUTES.TESTER.AUTH.LOGIN);
      return;
    }

    if (session?.user?.id && roleName === "tester" && isAuthPage) {
      router.replace(ROUTES.TESTER.DASHBOARD);
    }
  }, [pathname, router, session, isPending]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(ROUTES.AUTH.LOGIN);
        },
      },
    });
  };

  const isAuthPage =
    pathname === ROUTES.TESTER.AUTH.LOGIN ||
    pathname === ROUTES.TESTER.AUTH.REGISTER;

  if (isAuthPage) {
    return (
      <PageTransition>
        <main className="flex-1 bg-background">{children}</main>
      </PageTransition>
    );
  }

  if (!session?.user?.id) {
    return null;
  }

  return (
    <PageTransition>
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
          <main className="flex-1 bg-secondary/50">{children}</main>
          <Footer />
        </div>
      </div>
    </PageTransition>
  );
}
