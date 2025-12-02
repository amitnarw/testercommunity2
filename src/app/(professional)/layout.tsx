"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/authenticated/navbar";
import Footer from "@/components/authenticated/footer";
import { Sidebar } from "@/components/authenticated/sidebar";
import { authClient } from "@/lib/auth-client";

export default function ProfessionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (
      !session &&
      pathname !== "/tester/login" &&
      pathname !== "/tester/register"
    ) {
      router.replace("/tester/login");
    }
    if (
      session &&
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

  if (isPending) {
    return <p>Loading...</p>;
  }

  const isAuthPage =
    pathname === "/tester/login" || pathname === "/tester/register";

  if (!isAuthChecked) {
    return null;
  }

  if (isAuthPage) {
    return <main className="flex-1 bg-background">{children}</main>;
  }

  if (!isAuthenticated) {
    return null;
  }
  console.log(session, "klklkl");
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
        <main className="flex-1 bg-secondary/50">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
