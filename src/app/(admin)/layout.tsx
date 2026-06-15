"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/authenticated/navbar";
import Footer from "@/components/authenticated/footer";
import { Sidebar } from "@/components/authenticated/sidebar";

import PageTransition from "@/components/page-transition";
import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { data: session, isPending } = authClient.useSession();
  const isLoginPage = pathname?.startsWith(ROUTES.ADMIN.AUTH.LOGIN);

  useEffect(() => {
    if (isPending) return;

    if (session) {
      const roleField = (session as any)?.role;
      const roleName =
        typeof roleField === "string" ? roleField : roleField?.name;
      const lowerRole = roleName?.toLowerCase() || "";
      const isAdminRole = [
        "admin",
        "super_admin",
        "super admin",
        "moderator",
        "support",
      ].includes(lowerRole);

      if (isLoginPage) {
        if (isAdminRole) {
          if (lowerRole === "moderator") {
            router.replace(ROUTES.ADMIN.BLOG_MANAGEMENT);
          } else {
            router.replace(ROUTES.ADMIN.DASHBOARD);
          }
        }
      } else if (!isAdminRole) {
        router.replace(ROUTES.ADMIN.AUTH.LOGIN);
      }
      return;
    }

    if (!isLoginPage) {
      router.replace(ROUTES.ADMIN.AUTH.LOGIN);
    }
  }, [session, isPending, isLoginPage, router]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(ROUTES.ADMIN.AUTH.LOGIN);
        },
      },
    });
  };

  if (isLoginPage) {
    return (
      <PageTransition>
        <main className="flex-1 bg-background">{children}</main>
      </PageTransition>
    );
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
          <main className="flex-1 bg-secondary/50 print:bg-transparent">{children}</main>
          <Footer />
        </div>
      </div>
    </PageTransition>
  );
}
