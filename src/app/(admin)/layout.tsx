"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/authenticated/navbar";
import Footer from "@/components/authenticated/footer";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

import PageTransition from "@/components/page-transition";
import { authClient } from "@/lib/auth-client";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { data: session, isPending } = authClient.useSession();
  const isLoginPage = pathname?.startsWith("/admin/auth/login");

  useEffect(() => {
    if (isPending) return;

    if (session) {
      if (isLoginPage) {
        // Robust role detection from session user
        const user = session.user as any;
        const roleField = user?.role;
        const roleName =
          typeof roleField === "string" ? roleField : roleField?.name;
        const lowerRole = roleName?.toLowerCase() || "";
        const isAdminRole = ["admin", "super_admin", "super admin", "moderator"].includes(
          lowerRole,
        );

        if (isAdminRole) {
          router.replace("/admin/dashboard");
        }
      }
      return;
    }

    if (!isLoginPage) {
      router.replace("/admin/auth/login");
    }
  }, [session, isPending, isLoginPage, router]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/admin/auth/login");
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
        <AdminSidebar
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
