"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/authenticated/navbar";
import Footer from "@/components/authenticated/footer";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/authenticated/sidebar";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/page-transition";
import { ROUTES } from "@/lib/routes";
import { useUserData, useUserProfileData } from "@/hooks/useUser";
import { useToggleMyActiveStatus } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import { DiscoverySourceModal } from "@/components/discovery-source-modal";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const { data: userData } = useUserData({ enabled: !!session });
  const { data: userProfileData, isLoading: profileLoading } =
    useUserProfileData({ enabled: !!session });
  const queryClient = useQueryClient();
  const [reactivating, setReactivating] = useState(false);
  const [discoveryDismissed, setDiscoveryDismissed] = useState(false);

  const showDiscoveryModal =
    !profileLoading &&
    !!userProfileData &&
    !discoveryDismissed &&
    userProfileData.discovery_source_answered === false;

  const { mutate: toggleStatus } = useToggleMyActiveStatus({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserData"] });
      setReactivating(false);
    },
    onError: () => {
      setReactivating(false);
    },
  });

  useEffect(() => {
    if (isPending) return;

    const roleField = (session as any)?.role;
    const roleName = roleField?.name?.toLowerCase();

    // Block non-super-admin admins from user pages
    if (roleField?.isAdmin === true && roleName !== "super_admin") {
      router.replace(ROUTES.ADMIN.DASHBOARD);
    }
  }, [session, isPending, router]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(ROUTES.AUTH.LOGIN);
        },
      },
    });
  };

  if (userData?.isActive === false) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center text-center p-6 bg-background">
        <Logo className="w-20 h-20 mb-6" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-red-500 flex items-center gap-2">
          <Power className="w-7 h-7" />
          Account Deactivated
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Your account is currently deactivated. Your data has been kept and
          you can reactivate anytime to regain access.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            disabled={reactivating}
            onClick={() => {
              setReactivating(true);
              toggleStatus(true);
            }}
          >
            {reactivating ? "Reactivating..." : "Reactivate Account"}
          </Button>
          <Button size="lg" variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <>
        <div className="relative flex flex-col min-h-screen">
          <div className="flex flex-1">
            <Sidebar
              onLogout={handleLogout}
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
            />
            <div className="flex flex-col flex-1 min-w-0 md:pl-20">
              <Navbar onLogout={handleLogout} />
              <main className="flex-1 bg-secondary/50 overflow-x-hidden print:bg-transparent">{children}</main>
              <Footer />
            </div>
          </div>
        </div>
        {/* Bottom edge fade ,  at the bottom of the viewport */}
        <div
          aria-hidden="true"
          className="fixed left-0 right-0 bottom-0 h-6 bg-gradient-to-t from-background/80 to-transparent pointer-events-none z-30 print:hidden"
        />
        <DiscoverySourceModal
          open={showDiscoveryModal}
          onComplete={() => setDiscoveryDismissed(true)}
          onClose={() => setDiscoveryDismissed(true)}
        />
      </>
    </PageTransition>
  );
}
