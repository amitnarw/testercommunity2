"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Sun, Moon, LayoutDashboard, Users, Code2, Clock, AlertTriangle } from "lucide-react";
import { UserNav } from "../user-nav";
import MobileMenu from "../mobile-menu";
import { authClient } from "@/lib/auth-client";
import { EarnPointsButton } from "../earn-points-button";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { AutoTransitionLink } from "@/components/auto-transition-link";
import { useTesterProjects } from "@/hooks/useTester";
import { useActAsRole } from "@/hooks/useAdmin";

export default function Navbar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { actingAsRole, startActingAs, stopActingAs, isLoading } = useActAsRole();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSuperAdmin = (() => {
    const role = (session as any)?.role;
    if (typeof role === "string") {
      return role.toLowerCase() === "super_admin";
    } else if (typeof role === "object" && role?.name) {
      return role.name.toLowerCase() === "super_admin";
    }
    return false;
  })();

  const isTester = (() => {
    const role = (session as any)?.role;
    if (typeof role === "string") {
      return (
        role.toLowerCase() === "tester" || role.toLowerCase() === "super_admin"
      );
    } else if (typeof role === "object" && role?.name) {
      return (
        role.name.toLowerCase() === "tester" ||
        role.name.toLowerCase() === "super_admin"
      );
    }
    return false;
  })();

  const { data: projects } = useTesterProjects();

  const pendingCount =
    projects?.filter((project) => {
      if (
        project.testerStatus !== "IN_PROGRESS" &&
        project.testerStatus !== "PENDING"
      )
        return false;
      if (project.appStatus !== "IN_TESTING") return false;

      const lastActivity = project.lastActivityAt
        ? new Date(project.lastActivityAt)
        : null;
      const today = new Date();
      const isSameDay =
        lastActivity &&
        lastActivity.getDate() === today.getDate() &&
        lastActivity.getMonth() === today.getMonth() &&
        lastActivity.getFullYear() === today.getFullYear();

      const currentDayToSubmit = isSameDay
        ? project.daysCompleted
        : project.daysCompleted + 1;

      if (currentDayToSubmit > project.totalDay) return false;

      const verification = project.dailyVerifications?.find(
        (v) => v.dayNumber === currentDayToSubmit,
      );

      if (isSameDay && verification?.status !== "REJECTED") return false;
      if (!isSameDay) return true;
      if (isSameDay && verification?.status === "REJECTED") return true;

      return false;
    }).length || 0;

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 bg-brand-background md:pl-20 py-2 overflow-x-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-full">
          <div className="flex items-center justify-end gap-2">
            <EarnPointsButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 h-8 w-8"
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <div className="hidden md:block">
              <Skeleton className="h-9 w-16 ml-3 my-2 rounded-full" />
            </div>
            <MobileMenu
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onLogout={onLogout}
              isAuthenticated={!!session}
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-brand-background md:pl-20 py-2 overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-full">
        <div className="flex items-center justify-end gap-2">
          <div className="flex flex-row justify-end gap-2 w-auto">
            {isSuperAdmin && (
              <div className="flex items-center gap-1 bg-sidebar rounded-3xl p-1 border border-white/10 mr-auto sm:mr-0">
                {/* Acting-as indicator */}
                {actingAsRole && (
                  <button
                    onClick={stopActingAs}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all text-xs font-medium"
                    title="Click to stop acting"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span className="hidden md:inline">Acting as {actingAsRole}</span>
                    <span className="md:hidden">{actingAsRole}</span>
                  </button>
                )}
                <AutoTransitionLink href="/dashboard">
                  <button
                    className={`flex items-center gap-2 py-1.5 px-3.5 rounded-3xl hover:bg-white/20 hover:text-white transition-all text-xs duration-300 font-light ${
                      pathname.startsWith("/dashboard") &&
                      !pathname.startsWith("/admin") &&
                      !pathname.startsWith("/tester") && !actingAsRole
                        ? "bg-gradient-to-br from-primary to-primary/30 text-white dark:text-black"
                        : "text-white/70 dark:text-gray-500"
                    }`}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="hidden md:inline">User</span>
                  </button>
                </AutoTransitionLink>
                <AutoTransitionLink href="/admin/dashboard">
                  <button
                    className={`flex items-center gap-2 py-1.5 px-3.5 rounded-3xl hover:bg-white/20 hover:text-white transition-all text-xs duration-300 font-light ${
                      pathname.startsWith("/admin") && !actingAsRole
                        ? "bg-gradient-to-br from-primary to-primary/30 text-white dark:text-black"
                        : "text-white/70 dark:text-gray-500"
                    }`}
                  >
                    <Users className="h-3.5 w-4 flex-shrink-0" />
                    <span className="hidden md:inline">Admin</span>
                  </button>
                </AutoTransitionLink>
                <AutoTransitionLink href="/tester/dashboard">
                  <button
                    className={`flex items-center gap-2 py-1.5 px-3.5 rounded-3xl hover:bg-white/20 hover:text-white transition-all text-xs duration-300 font-light ${
                      pathname.startsWith("/tester") || actingAsRole === "tester"
                        ? "bg-gradient-to-br from-primary to-primary/30 text-white dark:text-black"
                        : "text-white/70 dark:text-gray-500"
                    }`}
                  >
                    <Code2 className="h-3.5 w-4 flex-shrink-0" />
                    <span className="hidden md:inline">Tester</span>
                  </button>
                </AutoTransitionLink>
                {!actingAsRole && (
                  <>
                    <button
                      onClick={() => startActingAs("tester")}
                      disabled={isLoading}
                      className="flex items-center gap-2 py-1.5 px-3.5 rounded-3xl hover:bg-green-500/20 hover:text-green-400 transition-all text-xs duration-300 font-light text-white/50"
                      title="Act as Tester"
                    >
                      <span className="hidden md:inline text-[10px]">as Tester</span>
                    </button>
                    <button
                      onClick={() => startActingAs("user")}
                      disabled={isLoading}
                      className="flex items-center gap-2 py-1.5 px-3.5 rounded-3xl hover:bg-blue-500/20 hover:text-blue-400 transition-all text-xs duration-300 font-light text-white/50"
                      title="Act as User"
                    >
                      <span className="hidden md:inline text-[10px]">as User</span>
                    </button>
                  </>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              {isTester && pendingCount > 0 && (
                <Link
                  href="/tester/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 mr-1 animate-pulse hover:animate-none transition-all"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">
                    {pendingCount} Pending
                  </span>
                </Link>
              )}
              <EarnPointsButton />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 h-8 w-8"
              >
                <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <div className="hidden md:block">
                {isPending ? (
                  <Skeleton className="h-9 w-16 my-2 rounded-full" />
                ) : session ? (
                  <UserNav session={session} onLogout={onLogout} />
                ) : null}
              </div>
            </div>
            <MobileMenu
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onLogout={onLogout}
              isAuthenticated={!!session}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
