"use client";

import {
  Menu,
  X,
  LayoutDashboard,
  Bell,
  Briefcase,
  DollarSign,
  LifeBuoy,
  Users,
  FileCheck,
  MessageSquare,
  Lightbulb,
  Activity,
  Wallet,
  Settings,
  Users2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTrigger,
} from "./ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TransitionLink } from "./transition-link";

const mainNavItems = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Community", href: "/community-dashboard" },
  { name: "Pricing", href: "/billing" },
  { name: "Blog", href: "/blog" },
];

const proNavItems = [
  { name: "Pro Dashboard", href: "/tester/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/tester/projects", icon: Briefcase },
  { name: "Earnings", href: "/tester/earnings", icon: DollarSign },
  { name: "Activities", href: "/tester/activities", icon: Activity },
  { name: "Support", href: "/tester/support", icon: LifeBuoy },
];

// Compact admin nav items for mobile
const adminNavItems = [
  // Overview
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    section: "overview",
  },

  // Paid Services
  {
    name: "Pro Submissions",
    href: "/admin/submissions-paid",
    icon: DollarSign,
    section: "paid",
    badge: "PRO",
  },

  // Free Services
  {
    name: "Community Subs",
    href: "/admin/submissions-free",
    icon: Users2,
    section: "free",
    badge: "FREE",
  },

  // Platform
  { name: "Users", href: "/admin/users", icon: Users, section: "platform" },
  {
    name: "Applications",
    href: "/admin/applications",
    icon: FileCheck,
    section: "platform",
  },
  {
    name: "Suggestions",
    href: "/admin/suggestions",
    icon: Lightbulb,
    section: "platform",
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    section: "platform",
  },
];

export default function MobileMenu({
  isMenuOpen,
  setIsMenuOpen,
  onLogout,
  isAuthenticated,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}) {
  const pathname = usePathname();

  let navItems = mainNavItems;
  let notificationHref = "/notifications";
  let walletHref = "/wallet";
  let isAdmin = false;
  let showWallet = true;

  if (pathname.startsWith("/admin")) {
    navItems = adminNavItems;
    notificationHref = "/admin/notifications";
    walletHref = "/wallet";
    isAdmin = true;
    showWallet = false; // Don't show wallet in admin
  } else if (pathname.startsWith("/tester")) {
    navItems = proNavItems;
    notificationHref = "/tester/notifications";
    walletHref = "/tester/wallet";
  }

  const publicNavItems = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
  ];

  const displayItems = isAuthenticated ? navItems : publicNavItems;

  // Group admin items by section
  const groupedAdminItems = isAdmin
    ? {
        overview: displayItems.filter(
          (item: any) => item.section === "overview",
        ),
        paid: displayItems.filter((item: any) => item.section === "paid"),
        free: displayItems.filter((item: any) => item.section === "free"),
        platform: displayItems.filter(
          (item: any) => item.section === "platform",
        ),
      }
    : null;

  return (
    <div data-loc="MobileMenu" className="md:hidden">
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="p-2 h-8 w-8">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="top"
          className="flex flex-col h-screen bg-background/95 backdrop-blur-lg overflow-y-auto"
        >
          <SheetHeader>
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-row gap-4 items-center">
                {isAuthenticated && (
                  <>
                    <button onClick={() => setIsMenuOpen(false)}>
                      <TransitionLink href={notificationHref}>
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                      </TransitionLink>
                    </button>
                    {showWallet && (
                      <button onClick={() => setIsMenuOpen(false)}>
                        <TransitionLink href={walletHref}>
                          <Wallet className="h-5 w-5" />
                          <span className="sr-only">Wallet</span>
                        </TransitionLink>
                      </button>
                    )}
                  </>
                )}
              </div>
              <SheetClose asChild>
                <Button size="icon" variant="ghost">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          <div className="flex flex-col flex-1 min-h-0">
            {isAdmin && groupedAdminItems ? (
              // Admin menu with sections - compact layout
              <nav className="flex flex-col gap-1 py-2 pr-0 flex-1 overflow-y-auto">
                {/* Overview Section */}
                <div className="space-y-0.5">
                  {groupedAdminItems.overview.map((item: any) => (
                    <TransitionLink
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-primary/10",
                        pathname === item.href
                          ? "text-primary bg-primary/5"
                          : "text-foreground",
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.name}
                    </TransitionLink>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-border mx-3 my-1" />

                {/* Paid Services Section */}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider px-3">
                    Paid Services
                  </span>
                  {groupedAdminItems.paid.map((item: any) => (
                    <TransitionLink
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-amber-500/10",
                        "text-foreground",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && (
                          <item.icon className="h-4 w-4 text-amber-500" />
                        )}
                        {item.name}
                      </div>
                      {item.badge && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600">
                          {item.badge}
                        </span>
                      )}
                    </TransitionLink>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-border mx-3 my-1" />

                {/* Free Services Section */}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider px-3">
                    Free Services
                  </span>
                  {groupedAdminItems.free.map((item: any) => (
                    <TransitionLink
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-blue-500/10",
                        "text-foreground",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && (
                          <item.icon className="h-4 w-4 text-blue-500" />
                        )}
                        {item.name}
                      </div>
                      {item.badge && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-600">
                          {item.badge}
                        </span>
                      )}
                    </TransitionLink>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-border mx-3 my-1" />

                {/* Platform Section */}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3">
                    Platform
                  </span>
                  {groupedAdminItems.platform.map((item: any) => (
                    <TransitionLink
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
                        pathname === item.href
                          ? "text-primary bg-primary/5"
                          : "text-foreground",
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.name}
                    </TransitionLink>
                  ))}
                </div>
              </nav>
            ) : (
              // Regular menu (non-admin)
              <nav className="flex flex-col items-center text-center justify-center gap-3 flex-1">
                {displayItems.map((item: any) => (
                  <TransitionLink
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "text-xl font-medium transition-colors hover:text-primary w-full",
                      pathname === item.href
                        ? "text-primary"
                        : "text-foreground",
                    )}
                  >
                    {item.name}
                  </TransitionLink>
                ))}
              </nav>
            )}

            {/* Bottom Actions */}
            {isAuthenticated ? (
              <div className="flex justify-center items-center gap-2 pt-3 border-t flex-shrink-0">
                <Button
                  variant="ghost"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                  className="border h-8"
                >
                  <TransitionLink href="/settings">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </TransitionLink>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                  className="border h-8"
                >
                  <TransitionLink href="/profile">Profile</TransitionLink>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-500/20 h-8"
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button asChild size="lg" onClick={() => setIsMenuOpen(false)}>
                  <TransitionLink href="/auth/login">Log In</TransitionLink>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <TransitionLink href="/auth/register">Sign Up</TransitionLink>
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
