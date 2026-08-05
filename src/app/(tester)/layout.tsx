"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/authenticated/navbar";
import Footer from "@/components/authenticated/footer";
import { Sidebar } from "@/components/authenticated/sidebar";
import { authClient } from "@/lib/auth-client";
import PageTransition from "@/components/page-transition";
import { ROUTES } from "@/lib/routes";

export default function ProfessionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, isPending } = authClient.useSession();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;

    const sessionData = session as unknown as {
      role?: { name: string };
      applicationStatus?: string;
      ban_reason?: string;
      user?: { id: string };
    };
    const roleName = sessionData?.role?.name;
    const applicationStatus = sessionData?.applicationStatus;
    const isAuthPage =
      pathname === ROUTES.TESTER.AUTH.LOGIN ||
      pathname === ROUTES.TESTER.AUTH.REGISTER;
    const isPendingPage = pathname === ROUTES.TESTER.PENDING_APPROVAL;
    const isRejectedPage = pathname === ROUTES.TESTER.APPLICATION_REJECTED;
    const isStatusPage = isPendingPage || isRejectedPage;

    if (!isAuthPage) {
      if (
        !session?.user?.id ||
        (roleName !== "tester" && roleName !== "super_admin")
      ) {
        router.replace(ROUTES.TESTER.AUTH.LOGIN);
        return;
      }

      // Gate access based on application status for testers
      if (roleName === "tester" && applicationStatus !== "APPROVED") {
        if (applicationStatus === "REJECTED" && !isRejectedPage) {
          router.replace(ROUTES.TESTER.APPLICATION_REJECTED);
          return;
        }
        if (!isPendingPage) {
          router.replace(ROUTES.TESTER.PENDING_APPROVAL);
          return;
        }
      }

      // If approved, redirect away from status pages to dashboard
      if (applicationStatus === "APPROVED" && isStatusPage) {
        router.replace(ROUTES.TESTER.DASHBOARD);
        return;
      }

      return;
    }

    if (
      session?.user?.id &&
      (roleName === "tester" || roleName === "super_admin") &&
      isAuthPage
    ) {
      // For testers, check application status before redirecting to dashboard
      if (roleName === "tester" && applicationStatus !== "APPROVED") {
        if (applicationStatus === "REJECTED") {
          router.replace(ROUTES.TESTER.APPLICATION_REJECTED);
          return;
        }
        router.replace(ROUTES.TESTER.PENDING_APPROVAL);
        return;
      }
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
  const isPendingPage = pathname === ROUTES.TESTER.PENDING_APPROVAL;
  const isRejectedPage = pathname === ROUTES.TESTER.APPLICATION_REJECTED;
  const isStandalonePage = isAuthPage || isPendingPage || isRejectedPage;

  if (isStandalonePage) {
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
