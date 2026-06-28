"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/authenticated/navbar";
import Footer from "@/components/authenticated/footer";
import { Sidebar } from "@/components/authenticated/sidebar";

import PageTransition from "@/components/page-transition";
import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";

const MODULE_ROUTE_MAP: Record<string, string> = {
  dashboard: ROUTES.ADMIN.DASHBOARD,
  submissions: ROUTES.ADMIN.SUBMISSIONS,
  users: ROUTES.ADMIN.USERS,
  feedback: ROUTES.ADMIN.FEEDBACK,
  finance: ROUTES.ADMIN.FINANCE,
  suggestions: ROUTES.ADMIN.SUGGESTIONS,
  notifications: ROUTES.ADMIN.NOTIFICATIONS,
  promo_codes: ROUTES.ADMIN.PROMO_CODES,
  blogs: ROUTES.ADMIN.BLOG_MANAGEMENT,
  guides: ROUTES.ADMIN.GUIDE_MANAGEMENT,
  testimonial: ROUTES.ADMIN.REVIEWS,
  review: ROUTES.ADMIN.USER_REVIEWS,
  logs: ROUTES.ADMIN.LOGS,
  support: ROUTES.ADMIN.SUPPORT,
  permissions: ROUTES.ADMIN.PERMISSIONS,
  faqs: ROUTES.ADMIN.FAQS,
  control_room: ROUTES.ADMIN.CONTROL_ROOM,
  tester_activity: ROUTES.ADMIN.TESTER_ACTIVITY,
  tester_applications: ROUTES.ADMIN.APPLICATIONS,
  guide_categories: ROUTES.ADMIN.GUIDE_MANAGEMENT,
  authors: ROUTES.ADMIN.BLOG_MANAGEMENT,
  verification: ROUTES.ADMIN.APPLICATIONS,
  iar: ROUTES.ADMIN.USERS,
};

function getModuleFromPath(pathname: string): string | null {
  const segments = pathname.replace(/\/$/, "").split("/");
  // /admin/dashboard -> "dashboard"
  // /admin/users/123 -> "users"
  // /admin/submissions-paid -> "submissions-paid" -> map to "submissions"
  const sub = segments[2];
  if (!sub) return null;
  if (sub === "submissions-paid" || sub === "submissions-free") return "submissions";
  if (sub === "blog-management") return "blogs";
  if (sub === "guide-management") return "guides";
  if (sub === "user-reviews") return "review";
  if (sub === "promo-codes") return "promo_codes";
  if (sub === "control-room") return "control_room";
  return sub;
}

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
      const isAdminRole = roleField?.isAdmin === true;
      const roleName = roleField?.name;
      const isSuperAdmin = roleName === "super_admin";
      const permissions = roleField?.permissions || [];

      if (isLoginPage) {
        if (isSuperAdmin) {
          router.replace(ROUTES.ADMIN.DASHBOARD);
        } else if (isAdminRole) {
          // Redirect to the first module the user has permission to access
          const firstPermitted = permissions.find((p: any) => p.canReadList);
          const target = firstPermitted
            ? MODULE_ROUTE_MAP[firstPermitted.module?.name] || ROUTES.ADMIN.DASHBOARD
            : ROUTES.ADMIN.DASHBOARD;
          router.replace(target);
        }
      } else if (!isAdminRole && !isSuperAdmin) {
        router.replace(ROUTES.ADMIN.AUTH.LOGIN);
      } else if (!isSuperAdmin) {
        // Check if user has permission for the current page (skip for super_admin)
        const currentModule = getModuleFromPath(pathname);
        if (currentModule) {
          const hasAccess = permissions.some(
            (p: any) => p.module?.name === currentModule && p.canReadList,
          );
          if (!hasAccess) {
            const firstPermitted = permissions.find((p: any) => p.canReadList);
            if (firstPermitted) {
              router.replace(MODULE_ROUTE_MAP[firstPermitted.module?.name] || ROUTES.ADMIN.DASHBOARD);
            } else {
              router.replace(ROUTES.ADMIN.DASHBOARD);
            }
          }
        }
      }
      return;
    }

    if (!isLoginPage) {
      router.replace(ROUTES.ADMIN.AUTH.LOGIN);
    }
  }, [session, isPending, isLoginPage, router, pathname]);

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
