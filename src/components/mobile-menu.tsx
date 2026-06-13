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
  Users2,
  FileCheck,
  MessageSquare,
  Lightbulb,
  Activity,
  Wallet,
  Settings,
  Handshake,
  Home,
  BookOpen,
  Terminal,
  Ticket,
  Headphones,
  Landmark,
  Star,
  ThumbsUp,
  Zap,
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
import { hasPermission } from "@/lib/permissions";

import { authClient } from "@/lib/auth-client";

type AdminNavItem = {
  name: string;
  href: string;
  icon?: typeof LayoutDashboard;
  section?: string;
  badge?: string;
  superAdminOnly?: boolean;
  moduleName?: string;
};

const mainNavItems: AdminNavItem[] = [
  { name: "Dashboard", href: ROUTES.AUTHENTICATED.DASHBOARD, icon: Home, section: "overview" },
  { name: "Pro Testing", href: ROUTES.AUTHENTICATED.PRO_TESTING, icon: Zap, section: "paid", badge: "PRO" },
  { name: "Free Testing", href: ROUTES.AUTHENTICATED.FREE_TESTING, icon: Users2, section: "free", badge: "FREE" },
  { name: "Notifications", href: ROUTES.AUTHENTICATED.NOTIFICATIONS, icon: Bell, section: "platform" },
  { name: "Wallet", href: ROUTES.AUTHENTICATED.WALLET, icon: Wallet, section: "platform" },
  { name: "Support", href: ROUTES.PUBLIC.SUPPORT, icon: LifeBuoy, section: "support" },
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
const adminNavItems: AdminNavItem[] = [
  // Overview
  {
    name: "Dashboard",
    href: ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
    section: "overview",
    moduleName: "dashboard",
  },

  // Paid Services
  {
    name: "Pro Submissions",
    href: ROUTES.ADMIN.SUBMISSIONS_PAID,
    icon: DollarSign,
    section: "paid",
    badge: "PRO",
    moduleName: "submissions",
  },

  // Free Services
  {
    name: "Community Subs",
    href: ROUTES.ADMIN.SUBMISSIONS_FREE,
    icon: Handshake,
    section: "free",
    badge: "FREE",
    moduleName: "submissions",
  },

  // Finance
  {
    name: "Finance",
    href: ROUTES.ADMIN.FINANCE,
    icon: Landmark,
    section: "finance",
    moduleName: "finance",
  },

  // Platform
  { name: "Users", href: ROUTES.ADMIN.USERS, icon: Users, section: "platform", moduleName: "users" },
  {
    name: "Applications",
    href: ROUTES.ADMIN.APPLICATIONS,
    icon: FileCheck,
    section: "platform",
    moduleName: "tester_applications",
  },
  {
    name: "Suggestions",
    href: ROUTES.ADMIN.SUGGESTIONS,
    icon: Lightbulb,
    section: "platform",
    moduleName: "suggestions",
  },
  {
    name: "Notifications",
    href: ROUTES.ADMIN.NOTIFICATIONS,
    icon: Bell,
    section: "platform",
    moduleName: "notifications",
  },
  {
    name: "Promo Codes",
    href: ROUTES.ADMIN.PROMO_CODES,
    icon: Ticket,
    section: "platform",
    moduleName: "promo_codes",
  },
  {
    name: "Reviews",
    href: ROUTES.ADMIN.REVIEWS,
    icon: Star,
    section: "platform",
    moduleName: "testimonial",
  },
  {
    name: "User Reviews",
    href: ROUTES.ADMIN.USER_REVIEWS,
    icon: MessageSquare,
    section: "platform",
    moduleName: "review",
  },
  {
    name: "Feedback",
    href: ROUTES.ADMIN.FEEDBACK,
    icon: ThumbsUp,
    section: "platform",
    moduleName: "feedback",
  },
  {
    name: "Control Room",
    href: ROUTES.ADMIN.CONTROL_ROOM,
    icon: Settings,
    section: "platform",
    moduleName: "control_room",
  },
  {
    name: "Blog Management",
    href: ROUTES.ADMIN.BLOG_MANAGEMENT,
    icon: BookOpen,
    section: "platform",
    moduleName: "blogs",
  },
  {
    name: "System Logs",
    href: ROUTES.ADMIN.LOGS,
    icon: Terminal,
    section: "platform",
    moduleName: "logs",
  },

  // Support
  {
    name: "Support",
    href: ROUTES.ADMIN.SUPPORT,
    icon: Headphones,
    section: "support",
    moduleName: "support",
  },

  // System
  {
    name: "Permission Matrix",
    href: ROUTES.ADMIN.PERMISSIONS,
    icon: Settings,
    section: "system",
    superAdminOnly: true,
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

  const permissions = role?.permissions;

  function isItemVisible(item: AdminNavItem): boolean {
    if (item.superAdminOnly) return roleName === "super_admin";
    if (item.moduleName) return hasPermission(roleName, permissions, item.moduleName, "canReadList");
    return true;
  }

  let navItems: AdminNavItem[] = mainNavItems;
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
  } else if (roleName === "tester") {
    navItems = proNavItems;
    notificationHref = ROUTES.TESTER.NOTIFICATIONS;
    walletHref = ROUTES.TESTER.EARNINGS;
  }

  const publicNavItems = [
    { name: "Home", href: ROUTES.PUBLIC.HOME },
    { name: "How It Works", href: ROUTES.PUBLIC.HOW_IT_WORKS },
    { name: "Reviews", href: ROUTES.PUBLIC.REVIEWS },
    { name: "Pricing", href: ROUTES.PUBLIC.PRICING },
    { name: "Support", href: ROUTES.PUBLIC.SUPPORT },
    { name: "Blog", href: ROUTES.PUBLIC.BLOG },
  ];

  const displayItems = isAuthenticated ? navItems : publicNavItems;

  // Group admin items by section with permission-based filtering
  const groupedAdminItems = isAdmin
    ? {
        overview: (displayItems as AdminNavItem[]).filter(
          (item) => item.section === "overview" && isItemVisible(item),
        ),
        paid: (displayItems as AdminNavItem[]).filter(
          (item) => item.section === "paid" && isItemVisible(item),
        ),
        free: (displayItems as AdminNavItem[]).filter(
          (item) => item.section === "free" && isItemVisible(item),
        ),
        finance: (displayItems as AdminNavItem[]).filter(
          (item) => item.section === "finance" && isItemVisible(item),
        ),
        platform: (displayItems as AdminNavItem[]).filter(
          (item) => item.section === "platform" && isItemVisible(item),
        ),
        support: (displayItems as AdminNavItem[]).filter(
          (item) => item.section === "support" && isItemVisible(item),
        ),
        system: (displayItems as AdminNavItem[]).filter(
          (item) => item.section === "system" && isItemVisible(item),
        ),
      }
    : null;

  // Group normal user items by section
  const groupedUserItems = isAuthenticated && !isAdminRole && roleName !== "tester"
    ? {
        overview: mainNavItems.filter((item) => item.section === "overview"),
        paid: mainNavItems.filter((item) => item.section === "paid"),
        free: mainNavItems.filter((item) => item.section === "free"),
        platform: mainNavItems.filter((item) => item.section === "platform"),
        support: mainNavItems.filter((item) => item.section === "support"),
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
                {(() => {
                  type SectionCfg = { key: string; header: string | null; iconColor?: string; hoverClass?: string; activeClass?: string };
                  const sectionConfigs: SectionCfg[] = [
                    { key: "overview", header: null },
                    { key: "paid", header: "Paid Services", iconColor: "text-amber-500", hoverClass: "hover:bg-amber-500/10" },
                    { key: "free", header: "Free Services", iconColor: "text-blue-500", hoverClass: "hover:bg-blue-500/10" },
                    { key: "finance", header: "Finance", iconColor: "text-emerald-500", hoverClass: "hover:bg-emerald-500/10" },
                    { key: "platform", header: "Platform", hoverClass: "hover:bg-muted", activeClass: "text-primary bg-primary/5" },
                    { key: "support", header: "Support", iconColor: "text-green-500", hoverClass: "hover:bg-green-500/10" },
                    { key: "system", header: "System", iconColor: "text-purple-500", hoverClass: "hover:bg-purple-500/10" },
                  ];

                  const headerColorMap: Record<string, string> = {
                    paid: "text-amber-500",
                    free: "text-blue-500",
                    finance: "text-emerald-500",
                    platform: "text-muted-foreground",
                    support: "text-green-500",
                    system: "text-purple-500",
                  };

                  const visibleSections = sectionConfigs.filter(
                    (s) => (groupedAdminItems as Record<string, any[]>)[s.key].length > 0,
                  );

                  return visibleSections.map((section, idx) => {
                    const items = (groupedAdminItems as Record<string, any[]>)[section.key];
                    const hasBadge = section.key === "paid" || section.key === "free";

                    return (
                      <div key={section.key}>
                        {idx > 0 && <div className="h-px bg-border mx-3 my-1" />}
                        <div className="space-y-0.5">
                          {section.header && (
                            <span className={`text-[10px] font-semibold ${headerColorMap[section.key]} uppercase tracking-wider px-3`}>
                              {section.header}
                            </span>
                          )}
                          {items.map((item: any) => (
                            <TransitionLink
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsMenuOpen(false)}
                              className={cn(
                                hasBadge
                                  ? `flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${section.hoverClass || "hover:bg-primary/10"} text-foreground`
                                  : `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${section.hoverClass || "hover:bg-primary/10"}`,
                                (() => {
                                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                  return section.activeClass
                                    ? isActive ? section.activeClass : "text-foreground"
                                    : isActive ? "text-primary bg-primary/5" : "text-foreground";
                                })(),
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {item.icon && (
                                  <item.icon className={cn("h-4 w-4", section.iconColor)} />
                                )}
                                {item.name}
                              </div>
                              {item.badge && hasBadge && (
                                <span className={cn(
                                  "text-[8px] font-bold px-1.5 py-0.5 rounded",
                                  section.key === "paid" && "bg-amber-500/20 text-amber-600 dark:bg-amber-500/10 dark:text-amber-700",
                                  section.key === "free" && "bg-blue-500/20 text-blue-600 dark:bg-blue-500/10 dark:text-blue-700",
                                )}>
                                  {item.badge}
                                </span>
                              )}
                            </TransitionLink>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </nav>
            ) : groupedUserItems ? (
              // Normal user menu with sections - mirrors admin layout
              <nav className="flex flex-col gap-1 py-2 pr-0 flex-1 overflow-y-auto">
                {(() => {
                  type SectionCfg = { key: string; header: string | null; iconColor?: string; hoverClass?: string; activeClass?: string };
                  const sectionConfigs: SectionCfg[] = [
                    { key: "overview", header: null },
                    { key: "paid", header: "Paid Services", iconColor: "text-amber-500", hoverClass: "hover:bg-amber-500/10" },
                    { key: "free", header: "Free Services", iconColor: "text-blue-500", hoverClass: "hover:bg-blue-500/10" },
                    { key: "platform", header: "Platform", hoverClass: "hover:bg-muted", activeClass: "text-primary bg-primary/5" },
                    { key: "support", header: "Support", iconColor: "text-green-500", hoverClass: "hover:bg-green-500/10" },
                  ];

                  const headerColorMap: Record<string, string> = {
                    paid: "text-amber-500",
                    free: "text-blue-500",
                    platform: "text-muted-foreground",
                    support: "text-green-500",
                  };

                  const visibleSections = sectionConfigs.filter(
                    (s) => (groupedUserItems as Record<string, any[]>)[s.key].length > 0,
                  );

                  return visibleSections.map((section, idx) => {
                    const items = (groupedUserItems as Record<string, any[]>)[section.key];
                    const hasBadge = section.key === "paid" || section.key === "free";

                    return (
                      <div key={section.key}>
                        {idx > 0 && <div className="h-px bg-border mx-3 my-1" />}
                        <div className="space-y-0.5">
                          {section.header && (
                            <span className={`text-[10px] font-semibold ${headerColorMap[section.key]} uppercase tracking-wider px-3`}>
                              {section.header}
                            </span>
                          )}
                          {items.map((item: any) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                              <TransitionLink
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                  hasBadge
                                    ? `flex items-center justify-between px-3 py-1.5 rounded-lg text-lg font-medium transition-colors ${section.hoverClass || "hover:bg-primary/10"} text-foreground`
                                    : `flex items-center gap-2 px-3 py-1.5 rounded-lg text-lg font-medium transition-colors ${section.hoverClass || "hover:bg-primary/10"}`,
                                  section.activeClass
                                    ? isActive ? section.activeClass : "text-foreground"
                                    : isActive ? "text-primary bg-primary/5" : "text-foreground",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  {item.icon && isActive && (
                                    <item.icon className={cn("h-5 w-5", section.iconColor)} />
                                  )}
                                  {item.name}
                                </div>
                              {item.badge && hasBadge && (
                                <span className={cn(
                                  "text-[8px] font-bold px-1.5 py-0.5 rounded",
                                  section.key === "paid" && "bg-amber-500/20 text-amber-600 dark:bg-amber-500/10 dark:text-amber-700",
                                  section.key === "free" && "bg-blue-500/20 text-blue-600 dark:bg-blue-500/10 dark:text-blue-700",
                                )}>
                                  {item.badge}
                                </span>
                              )}
                            </TransitionLink>
                           );
                          })}
                         </div>
                      </div>
                    );
                  });
                })()}
              </nav>
            ) : (
              // Flat layout for testers and public users
              <nav className="flex flex-col gap-1 py-2 pr-0 flex-1 overflow-y-auto">
                {displayItems.map((item: any) => {
                  const isItemActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <TransitionLink
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-primary/10",
                        isItemActive ? "text-primary bg-primary/5" : "text-foreground",
                      )}
                    >
                      {item.icon && (
                        <span className="flex items-center justify-center h-4 w-4 shrink-0">
                          <item.icon className={cn("h-4 w-4", isItemActive ? "text-primary" : "text-muted-foreground")} />
                        </span>
                      )}
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:bg-amber-500/10 dark:text-amber-700">
                          {item.badge}
                        </span>
                      )}
                    </TransitionLink>
                  );
                })}
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
