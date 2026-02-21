"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { authClient } from "@/lib/auth-client";
import PageTransition from "@/components/page-transition";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function PublicClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const isAuthPage =
    pathname.startsWith("/auth") ||
    pathname.startsWith(ROUTES.TESTER.AUTH.LOGIN) ||
    pathname.startsWith(ROUTES.TESTER.AUTH.REGISTER);

  const isSamplePage = pathname.startsWith("/samples");

  // Sample pages get their own minimal layout without navbar/footer
  if (isSamplePage) {
    return <PageTransition>{children}</PageTransition>;
  }

  if (isAuthPage) {
    return <PageTransition>{children}</PageTransition>;
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <Header
        session={session}
        isDashboardPage={false}
        isMobileMenuOpen={false}
        setMobileMenuOpen={() => {}}
        isSidebarCollapsed={true}
        setSidebarCollapsed={() => {}}
      />
      <main className="relative z-10 flex-1 bg-background pt-14">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
