"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/auth/register/profile-setup" ||
    pathname === "/auth/verification" ||
    pathname === "/auth/register/check-email";

  useEffect(() => {
    if (!isPending) {
      if (session && isAuthPage) {
        router.replace("/dashboard");
      }
    }
  }, [session, isAuthPage, router]);

  if (!session && isAuthPage) {
    return <main className="flex-1 bg-background">{children}</main>;
  }
  if (session && isAuthPage) {
    return null;
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header
        session={session}
        isDashboardPage={false}
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setIsMobileMenuOpen}
        isSidebarCollapsed={true}
        setSidebarCollapsed={() => {}}
      />
      <main className="flex-1 bg-background z-10">{children}</main>
      <Footer />
    </div>
  );
}
