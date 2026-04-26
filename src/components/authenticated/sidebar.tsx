"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  Bell,
  Briefcase,
  DollarSign,
  LifeBuoy,
  Activity,
  Wallet,
  User,
  Users,
  FileCheck,
  Lightbulb,
  Ticket,
  Terminal,
  BookOpen,
} from "lucide-react";
import { BaseSidebar, SidebarNavLink } from "@/components/ui/base-sidebar";
import { authClient } from "@/lib/auth-client";

const mainNavLinks = [
  { name: "Developer Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Community Hub", href: "/community-dashboard", icon: Users2 },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

const proNavLinks = [
  { name: "Dashboard", href: "/tester/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/tester/projects", icon: Briefcase },
  { name: "Activities", href: "/tester/activities", icon: Activity },
  { name: "Notifications", href: "/tester/notifications", icon: Bell },
  { name: "Support", href: "/tester/support", icon: LifeBuoy },
];

// Admin sidebar navigation with sections
const adminNavLinks = [
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
  {
    name: "Promo Codes",
    href: "/admin/promo-codes",
    icon: Ticket,
    section: "platform",
  },
  {
    name: "Blog Management",
    href: "/admin/blog-management",
    icon: BookOpen,
    section: "platform",
  },
  {
    name: "System Logs",
    href: "/admin/logs",
    icon: Terminal,
    section: "platform",
  },
];

interface SidebarProps {
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export function Sidebar({
  onLogout,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const role = (session as any)?.role;
  const roleName = (
    typeof role === "string" ? role : role?.name
  )?.toLowerCase();

  const isAdminPath = pathname.startsWith("/admin");
  const isTesterPath = pathname.startsWith("/tester");

  // Determine standard nav links for non-admin
  let navLinks = mainNavLinks;
  if (roleName === "tester" || isTesterPath) {
    navLinks = proNavLinks;
  }

  const navContent = isAdminPath ? (
      <>
        <div className="mb-1">
          {!isCollapsed && (
            <span className="text-[10px] font-semibold text-white/40 dark:text-black/40 uppercase tracking-wider px-3">
              Overview
            </span>
          )}
          {adminNavLinks
            .filter((l) => l.section === "overview")
            .map((link) => (
              <SidebarNavLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                isCollapsed={isCollapsed}
                badge={link.badge}
              >
                {link.name}
              </SidebarNavLink>
            ))}
        </div>
        {!isCollapsed && (
          <div className="h-px bg-white/10 dark:bg-black/10 mx-3 my-1" />
        )}

        <div className="mb-1">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-3 mb-1">
              <span className="text-[10px] font-semibold text-amber-500/70 uppercase tracking-wider">
                Paid
              </span>
            </div>
          )}
          {adminNavLinks
            .filter((l) => l.section === "paid")
            .map((link) => (
              <SidebarNavLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                isCollapsed={isCollapsed}
                badge={link.badge}
              >
                {link.name}
              </SidebarNavLink>
            ))}
        </div>
        {!isCollapsed && (
          <div className="h-px bg-white/10 dark:bg-black/10 mx-3 my-1" />
        )}

        <div className="mb-1">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-3 mb-1">
              <span className="text-[10px] font-semibold text-blue-500/70 uppercase tracking-wider">
                Free
              </span>
            </div>
          )}
          {adminNavLinks
            .filter((l) => l.section === "free")
            .map((link) => (
              <SidebarNavLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                isCollapsed={isCollapsed}
                badge={link.badge}
              >
                {link.name}
              </SidebarNavLink>
            ))}
        </div>
        {!isCollapsed && (
          <div className="h-px bg-white/10 dark:bg-black/10 mx-3 my-1" />
        )}

        <div className="mb-1">
          {!isCollapsed && (
            <span className="text-[10px] font-semibold text-white/40 dark:text-black/40 uppercase tracking-wider px-3">
              Platform
            </span>
          )}
          {adminNavLinks
            .filter((l) => l.section === "platform")
            .map((link) => (
              <SidebarNavLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                isCollapsed={isCollapsed}
                badge={link.badge}
              >
                {link.name}
              </SidebarNavLink>
            ))}
        </div>
      </>
    ) : (
      <>
        {navLinks.map((link) => (
          <SidebarNavLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            isCollapsed={isCollapsed}
          >
            {link.name}
          </SidebarNavLink>
        ))}
      </>
    );

  const bottomContent = (
    <div className="flex flex-col gap-1 w-full">
      {/* Wallet for regular users */}
      {!(roleName === "super_admin" || isAdminPath) &&
        !(roleName === "tester" || isTesterPath) && (
          <SidebarNavLink
            href="/wallet"
            icon={Wallet}
            isCollapsed={isCollapsed}
          >
            Wallet
          </SidebarNavLink>
        )}

      {/* Earnings for testers */}
      {(roleName === "tester" || isTesterPath) && (
        <SidebarNavLink
          href="/tester/earnings"
          icon={DollarSign}
          isCollapsed={isCollapsed}
        >
          Earnings
        </SidebarNavLink>
      )}

      {/* Profile links based on role */}
      {roleName === "super_admin" || isAdminPath ? (
        <SidebarNavLink
          href="/admin/profile"
          icon={User}
          isCollapsed={isCollapsed}
        >
          Profile
        </SidebarNavLink>
      ) : roleName === "tester" || isTesterPath ? (
        <SidebarNavLink
          href="/tester/settings"
          icon={User}
          isCollapsed={isCollapsed}
        >
          Profile
        </SidebarNavLink>
      ) : (
        <SidebarNavLink href="/profile" icon={User} isCollapsed={isCollapsed}>
          Profile
        </SidebarNavLink>
      )}
    </div>
  );

  // Determine logo link based on role
  let logoHref = "/dashboard";
  if (roleName === "super_admin" || isAdminPath) {
    logoHref = "/admin/dashboard";
  } else if (roleName === "tester" || isTesterPath) {
    logoHref = "/tester/dashboard";
  }

  return (
    <BaseSidebar
      onLogout={onLogout}
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
      logoHref={logoHref}
      className="bg-gradient-to-r from-primary to-primary/70 border-white/10" // Unified gradient style
      navContent={navContent}
      bottomContent={bottomContent}
      showScrollIndicator={isAdminPath} // Admin sidebar has more links, might need scrolling
    />
  );
}
