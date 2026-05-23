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
  Handshake,
  BookOpen,
  Terminal,
  Ticket,
  Headphones,
  Landmark,
  Star,
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
import { ROUTES } from "@/lib/routes";

import { authClient } from "@/lib/auth-client";

const mainNavItems = [
  { name: "Home", href: ROUTES.PUBLIC.HOME },
  { name: "Community", href: ROUTES.AUTHENTICATED.COMMUNITY_DASHBOARD },
  { name: "Dashboard", href: ROUTES.AUTHENTICATED.DASHBOARD },
  { name: "Reviews", href: ROUTES.PUBLIC.REVIEWS },
  { name: "Pricing", href: ROUTES.AUTHENTICATED.BILLING },
  { name: "Support", href: ROUTES.PUBLIC.SUPPORT },
  { name: "Blog", href: ROUTES.PUBLIC.BLOG },
];

const proNavItems = [
  { name: "Pro Dashboard", href: ROUTES.TESTER.DASHBOARD, icon: LayoutDashboard },
  { name: "Projects", href: ROUTES.TESTER.PROJECTS, icon: Briefcase },
  { name: "Earnings", href: ROUTES.TESTER.EARNINGS, icon: DollarSign },
  { name: "Reviews", href: ROUTES.PUBLIC.REVIEWS, icon: Star },
  { name: "Activities", href: ROUTES.TESTER.ACTIVITIES, icon: Activity },
  { name: "Support", href: ROUTES.PUBLIC.SUPPORT, icon: LifeBuoy },
];

// Compact admin nav items for mobile (mirrors sidebar)
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
    icon: Handshake,
    section: "free",
    badge: "FREE",
  },

  // Finance (super_admin only)
  {
    name: "Finance",
    href: "/admin/finance",
    icon: Landmark,
    section: "finance",
    superAdminOnly: true,
  },

  // Platform
  { name: "Users", href: ROUTES.ADMIN.USERS, icon: Users, section: "platform" },
  {
    name: "Applications",
    href: ROUTES.ADMIN.APPLICATIONS,
    icon: FileCheck,
    section: "platform",
  },
  {
    name: "Suggestions",
    href: ROUTES.ADMIN.SUGGESTIONS,
    icon: Lightbulb,
    section: "platform",
  },
  {
    name: "Notifications",
    href: ROUTES.ADMIN.NOTIFICATIONS,
    icon: Bell,
    section: "platform",
  },
  {
    name: "Promo Codes",
    href: ROUTES.ADMIN.PROMO_CODES,
    icon: Ticket,
    section: "platform",
  },
  {
    name: "Reviews",
    href: ROUTES.ADMIN.REVIEWS,
    icon: Star,
    section: "platform",
  },
  {
    name: "User Reviews",
    href: ROUTES.ADMIN.USER_REVIEWS,
    icon: MessageSquare,
    section: "platform",
  },
  {
    name: "Blog Management",
    href: ROUTES.ADMIN.BLOG_MANAGEMENT,
    icon: BookOpen,
    section: "platform",
  },
  {
    name: "System Logs",
    href: ROUTES.ADMIN.LOGS,
    icon: Terminal,
    section: "platform",
  },

  // Support
  {
    name: "Support",
    href: ROUTES.ADMIN.SUPPORT,
    icon: Headphones,
    section: "support",
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
  const { data: session } = authClient.useSession();
  const role = (session as any)?.role;
  const roleName = (
    typeof role === "string" ? role : role?.name
  )?.toLowerCase();

  let navItems: { name: string; href: string; icon?: typeof LayoutDashboard; section?: string; badge?: string; superAdminOnly?: boolean }[] = mainNavItems;
  let notificationHref = "/notifications";
  let walletHref = "/wallet";
  let isAdmin = false;
  let showWallet = true;

  const isAdminRole = [
    "admin",
    "super_admin",
    "super admin",
    "moderator",
    "support",
  ].includes(roleName);

  if (isAdminRole) {
    navItems = adminNavItems;
    notificationHref = ROUTES.ADMIN.NOTIFICATIONS;
    walletHref = ROUTES.AUTHENTICATED.WALLET;
    isAdmin = true;
    showWallet = false;
  } else if (roleName === "tester" || roleName === "super_admin") {
    navItems = proNavItems;
    notificationHref = ROUTES.TESTER.NOTIFICATIONS;
    walletHref = ROUTES.TESTER.EARNINGS;
  }

  const publicNavItems = [
    { name: "Home", href: ROUTES.PUBLIC.HOME },
    { name: "How It Works", href: ROUTES.PUBLIC.HOW_IT_WORKS },
    { name: "Pricing", href: ROUTES.PUBLIC.PRICING },
    { name: "Support", href: ROUTES.PUBLIC.SUPPORT },
    { name: "Blog", href: ROUTES.PUBLIC.BLOG },
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
        finance: roleName === "super_admin"
          ? displayItems.filter((item: any) => item.section === "finance")
          : [],
        platform: displayItems.filter(
          (item: any) => item.section === "platform",
        ),
        support: displayItems.filter(
          (item: any) => item.section === "support",
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
          className="flex flex-col h-dvh bg-background/95 backdrop-blur-lg overflow-y-auto"
        >
          <SheetHeader>
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-row gap-4 items-center">
                {isAuthenticated && (
                  <>
                    <button onClick={() => setIsMenuOpen(false)}>
                      <TransitionLink href={notificationHref}>
                        <Bell className="h-7 w-7" />
                        <span className="sr-only">Notifications</span>
                      </TransitionLink>
                    </button>
                    {showWallet && (
                      <button onClick={() => setIsMenuOpen(false)}>
                        <TransitionLink href={walletHref}>
                          <Wallet className="h-7 w-7" />
                          <span className="sr-only">Wallet</span>
                        </TransitionLink>
                      </button>
                    )}
                  </>
                )}
              </div>
              <SheetClose asChild>
                <Button size="icon" variant="ghost">
                  <X className="!h-7 !w-7" />
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

                {/* Finance Section (super_admin only) */}
                {groupedAdminItems.finance.length > 0 && (
                  <>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider px-3">
                        Finance
                      </span>
                      {groupedAdminItems.finance.map((item: any) => (
                        <TransitionLink
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-emerald-500/10",
                            "text-foreground",
                          )}
                        >
                          {item.icon && <item.icon className="h-4 w-4 text-emerald-500" />}
                          {item.name}
                        </TransitionLink>
                      ))}
                    </div>
                    <div className="h-px bg-border mx-3 my-1" />
                  </>
                )}

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

                {/* Divider */}
                <div className="h-px bg-border mx-3 my-1" />

                {/* Support Section */}
                {groupedAdminItems.support.length > 0 && (
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-green-500 uppercase tracking-wider px-3">
                      Support
                    </span>
                    {groupedAdminItems.support.map((item: any) => (
                      <TransitionLink
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-green-500/10",
                          "text-foreground",
                        )}
                      >
                        {item.icon && <item.icon className="h-4 w-4 text-green-500" />}
                        {item.name}
                      </TransitionLink>
                    ))}
                  </div>
                )}
              </nav>
            ) : (
              // Regular menu (non-admin)
              <nav className="flex flex-col items-center text-center justify-center gap-5 flex-1">
                {displayItems.map((item: any) => (
                  <TransitionLink
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "text-2xl font-medium transition-colors hover:text-primary w-full",
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
                  className="border h-10"
                >
                  <TransitionLink href={isAdminRole ? ROUTES.ADMIN.PROFILE : roleName === "tester" ? ROUTES.TESTER.SETTINGS : ROUTES.AUTHENTICATED.SETTINGS}>
                    <Settings className="!h-5 !w-5" />
                    <span className="sr-only">Settings</span>
                  </TransitionLink>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                  className="border h-10"
                >
                  <TransitionLink href={isAdminRole ? ROUTES.ADMIN.PROFILE : roleName === "tester" ? ROUTES.TESTER.SETTINGS : ROUTES.AUTHENTICATED.PROFILE}>Profile</TransitionLink>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-500/20 h-10"
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button asChild size="lg" onClick={() => setIsMenuOpen(false)}>
                  <TransitionLink href={ROUTES.AUTH.LOGIN}>
                    Log In
                  </TransitionLink>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <TransitionLink href={ROUTES.AUTH.REGISTER}>
                    Sign Up
                  </TransitionLink>
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
