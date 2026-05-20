"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  Handshake,
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
  Star,
  MessageSquare,
  Headphones,
  Landmark,
  UserCircle,
} from "lucide-react";
import { BaseSidebar, SidebarNavLink } from "@/components/ui/base-sidebar";
import { authClient } from "@/lib/auth-client";

const mainNavLinks = [
  { name: "Developer Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Community Hub", href: "/community-dashboard", icon: Users2 },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Support", href: "/support", icon: LifeBuoy },
];

const proNavLinks = [
  { name: "Dashboard", href: "/tester/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/tester/projects", icon: Briefcase },
  { name: "Community Tasks", href: "/tester/community-tasks", icon: Users2 },
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
    name: "Reviews",
    href: "/admin/reviews",
    icon: Star,
    section: "platform",
  },
  {
    name: "User Reviews",
    href: "/admin/user-reviews",
    icon: MessageSquare,
    section: "platform",
  },
  {
    name: "Blog Authors",
    href: "/admin/blog-authors",
    icon: UserCircle,
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

  // Support
  {
    name: "Support",
    href: "/admin/support",
    icon: Headphones,
    section: "support",
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

  const isAdminRole = [
    "admin",
    "super_admin",
    "super admin",
    "moderator",
    "support",
  ].includes(roleName);
  const isTesterRole = roleName === "tester" || roleName === "super_admin";

  let navLinks = mainNavLinks;
  if (isTesterRole) {
    navLinks = proNavLinks;
  }

  const navContent = isAdminRole ? (
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

        {/* Finance section - super_admin only */}
        {roleName === "super_admin" && (
          <>
            <div className="mb-1">
              {!isCollapsed && (
                <div className="flex items-center gap-2 px-3 mb-1">
                  <span className="text-[10px] font-semibold text-emerald-500/70 uppercase tracking-wider">
                    Finance
                  </span>
                </div>
              )}
              {adminNavLinks
                .filter((l) => l.section === "finance")
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
          </>
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
        {!isCollapsed && (
          <div className="h-px bg-white/10 dark:bg-black/10 mx-3 my-1" />
        )}

        <div className="mb-1">
          {!isCollapsed && (
            <span className="text-[10px] font-semibold text-green-500/70 uppercase tracking-wider px-3">
              Support
            </span>
          )}
          {adminNavLinks
            .filter((l) => l.section === "support")
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
      {!isAdminRole && !isTesterRole && (
        <SidebarNavLink
          href="/wallet"
          icon={Wallet}
          isCollapsed={isCollapsed}
        >
          Wallet
        </SidebarNavLink>
      )}

      {/* Earnings for testers */}
      {isTesterRole && (
        <SidebarNavLink
          href="/tester/earnings"
          icon={DollarSign}
          isCollapsed={isCollapsed}
        >
          Earnings
        </SidebarNavLink>
      )}

      {/* Profile links based on role */}
      {isAdminRole ? (
        <SidebarNavLink
          href="/admin/profile"
          icon={User}
          isCollapsed={isCollapsed}
        >
          Profile
        </SidebarNavLink>
      ) : isTesterRole ? (
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
  if (isAdminRole) {
    logoHref = "/admin/dashboard";
  } else if (isTesterRole) {
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
      showScrollIndicator={isAdminRole} // Admin sidebar has more links, might need scrolling
    />
  );
}
