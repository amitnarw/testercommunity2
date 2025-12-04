"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { InTestersLogoShortHeader } from "./icons";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTrigger,
} from "./ui/sheet";
import { Menu, ArrowRight, Sun, Moon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { UserNav } from "./user-nav";
import MobileMenu from "./mobile-menu";
import { AnimatedLink } from "./ui/animated-link";
import { authClient } from "@/lib/auth-client";

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
  };

  return (
    <header className="sticky top-4 z-50 w-[95vw] mx-auto">
      <div className="bg-transparent backdrop-blur-lg rounded-full border border-black/5 dark:border-white/5 shadow-inner shadow-black/5 dark:shadow-white/5 transition-all duration-300">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/">
                <InTestersLogoShortHeader className="h-10 w-10" />
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <AnimatedLink
                  key={item.name}
                  href={item.href}
                  className="font-medium text-base"
                >
                  {item.name}
                </AnimatedLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {isMounted && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
                      <Button variant="ghost" asChild>
                        <Link href="/auth/login">Log In</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/auth/register">
                          Sign Up <ArrowRight className="ml-2 h-4 w-4" />
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
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
