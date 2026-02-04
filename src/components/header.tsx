"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { UserNav } from "./user-nav";
import MobileMenu from "./mobile-menu";
import { AnimatedLink } from "./ui/animated-link";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from "./logo";
import { Button } from "./ui/button";

const visitorNavItems = [
  { name: "Home", href: "/" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
];

const authenticatedNavItems = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Community", href: "/community-dashboard" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
];

interface HeaderProps {
  session: {
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    };
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined;
      userAgent?: string | null | undefined;
    };
    role?: {
      name: string;
      permissions: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        roleId: number;
        moduleId: number;
        canReadList: boolean;
        canReadSingle: boolean;
        canCreate: boolean;
        canUpdate: boolean;
        canDelete: boolean;
      }[];
    };
  } | null;
  isDashboardPage: boolean;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export function Header({
  session,
  isDashboardPage,
  isMobileMenuOpen,
  setMobileMenuOpen,
  isSidebarCollapsed,
  setSidebarCollapsed,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisitorMenuOpen, setVisitorMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = session ? authenticatedNavItems : visitorNavItems;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });

    queryClient.removeQueries({ queryKey: ["getUserProfileData"] });
    queryClient.clear();

    router.replace("/auth/login");
  };

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.header
      data-loc="Header"
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="relative flex items-center justify-between"
        animate={{
          width: isScrolled ? "auto" : "95vw",
          y: isScrolled ? 0 : 10,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          layout
          className={cn(
            "relative flex items-center justify-between px-6 py-2 bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-white/5 transition-all rounded-full duration-300",
            isScrolled ? "gap-20" : "w-full",
          )}
        >
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <AnimatedLink
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10",
                  isScrolled ? "text-sm" : "text-base",
                )}
              >
                {item.name}
              </AnimatedLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isMounted && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-9 h-9"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>

                {session?.session?.id ? (
                  <div className="hidden md:block">
                    <UserNav
                      session={session}
                      onLogout={() => handleLogout()}
                    />
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="rounded-full"
                    >
                      <Link href="/auth/login">Log In</Link>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="rounded-full shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Link href="/auth/register">
                        Sign Up <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            <MobileMenu
              isMenuOpen={isVisitorMenuOpen}
              setIsMenuOpen={setVisitorMenuOpen}
              onLogout={() => handleLogout()}
              isAuthenticated={!!session}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
