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
  Bug,
  UserPlus,
  MessageSquare,
  Lightbulb,
  Activity,
  Wallet,
  Settings,
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

const adminNavItems = [
  { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Submissions", href: "/admin/submissions", icon: FileCheck },
  { name: "Applications", href: "/admin/applications", icon: UserPlus },
  { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },
  { name: "Suggestions", href: "/admin/suggestions", icon: Lightbulb },
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

  if (pathname.startsWith("/admin")) {
    navItems = adminNavItems;
    notificationHref = "/admin/notifications";
    walletHref = "/admin/wallet";
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

  return (
    <div className="md:hidden">
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost" className="p-2 h-8 w-8">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="top"
          className="flex flex-col h-full bg-background/95 backdrop-blur-lg"
        >
          <SheetHeader>
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-row gap-5 items-center">
                {isAuthenticated && (
                  <>
                    <button onClick={() => setIsMenuOpen(false)}>
                      <TransitionLink href={notificationHref}>
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                      </TransitionLink>
                    </button>
                    <button onClick={() => setIsMenuOpen(false)}>
                      <TransitionLink href={walletHref}>
                        <Wallet className="h-5 w-5" />
                        <span className="sr-only">Wallet</span>
                      </TransitionLink>
                    </button>
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
          <div className="flex flex-col h-full">
            <nav className="flex flex-col items-center text-center justify-center gap-4 h-full">
              {displayItems.map((item) => (
                <TransitionLink
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-2xl font-medium transition-colors hover:text-primary w-full",
                    pathname === item.href ? "text-primary" : "text-foreground"
                  )}
                >
                  {item.name}
                </TransitionLink>
              ))}
            </nav>
            {isAuthenticated ? (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="ghost"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                  className="border"
                >
                  <TransitionLink href="/settings">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </TransitionLink>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full border"
                >
                  <TransitionLink href="/profile">Profile</TransitionLink>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-500/20 w-full"
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
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
