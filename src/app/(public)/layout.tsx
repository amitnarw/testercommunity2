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
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/tester/login") ||
    pathname.startsWith("/tester/register");


  useEffect(() => {
    if (!isPending) {
      if (session && isAuthPage) {
        if((session as any)?.role === 'tester') {
          router.replace("/tester/dashboard");
        } else {
          router.replace("/dashboard");
        }
      }
    }
  }, [session, isAuthPage, router, isPending]);

  if (isAuthPage) {
    return <main className="flex-1 bg-background">{children}</main>;
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
      <main className="flex-1 bg-background z-10">{children}</main>
      {!isPending && <Footer />}
    </div>
  );
}
