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
import { ROUTES } from "@/lib/routes";

const mainNavLinks = [
  { name: "Community Hub", href: ROUTES.AUTHENTICATED.COMMUNITY_DASHBOARD, icon: Users2 },
  { name: "Developer Dashboard", href: ROUTES.AUTHENTICATED.DASHBOARD, icon: LayoutDashboard },
  { name: "Notifications", href: ROUTES.AUTHENTICATED.NOTIFICATIONS, icon: Bell },
  { name: "Support", href: ROUTES.PUBLIC.SUPPORT, icon: LifeBuoy },
];

const proNavLinks = [
  { name: "Dashboard", href: ROUTES.TESTER.DASHBOARD, icon: LayoutDashboard },
  { name: "Projects", href: ROUTES.TESTER.PROJECTS, icon: Briefcase },
  { name: "Community Tasks", href: ROUTES.TESTER.COMMUNITY_TASKS, icon: Users2 },
  { name: "Activities", href: ROUTES.TESTER.ACTIVITIES, icon: Activity },
  { name: "Notifications", href: ROUTES.TESTER.NOTIFICATIONS, icon: Bell },
  { name: "Support", href: ROUTES.TESTER.SUPPORT, icon: LifeBuoy },
];

// Admin sidebar navigation with sections
const adminNavLinks = [
  // Overview
  {
    name: "Dashboard",
    href: ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
    section: "overview",
  },

  // Paid Services
  {
    name: "Pro Submissions",
    href: ROUTES.ADMIN.SUBMISSIONS_PAID,
    icon: DollarSign,
    section: "paid",
    badge: "PRO",
  },

  // Free Services
  {
    name: "Community Subs",
    href: ROUTES.ADMIN.SUBMISSIONS_FREE,
    icon: Handshake,
    section: "free",
    badge: "FREE",
  },

  // Finance (super_admin only)
  {
    name: "Finance",
    href: ROUTES.ADMIN.FINANCE,
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
    name: "Blog Authors",
    href: ROUTES.ADMIN.BLOG_AUTHORS,
    icon: UserCircle,
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

  let navLinks: { name: string; href: string; icon: typeof LayoutDashboard }[] = mainNavLinks;
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
          href={ROUTES.AUTHENTICATED.WALLET}
          icon={Wallet}
          isCollapsed={isCollapsed}
        >
          Wallet
        </SidebarNavLink>
      )}

      {/* Earnings for testers */}
      {isTesterRole && (
        <SidebarNavLink
          href={ROUTES.TESTER.EARNINGS}
          icon={DollarSign}
          isCollapsed={isCollapsed}
        >
          Earnings
        </SidebarNavLink>
      )}

      {/* Profile links based on role */}
      {isAdminRole ? (
        <SidebarNavLink
          href={ROUTES.ADMIN.PROFILE}
          icon={User}
          isCollapsed={isCollapsed}
        >
          Profile
        </SidebarNavLink>
      ) : isTesterRole ? (
        <SidebarNavLink
          href={ROUTES.TESTER.PROFILE}
          icon={User}
          isCollapsed={isCollapsed}
        >
          Profile
        </SidebarNavLink>
      ) : (
        <SidebarNavLink href={ROUTES.AUTHENTICATED.PROFILE} icon={User} isCollapsed={isCollapsed}>
          Profile
        </SidebarNavLink>
      )}
    </div>
  );

  // Determine logo link based on role
  let logoHref: string = ROUTES.AUTHENTICATED.COMMUNITY_DASHBOARD;
  if (isAdminRole) {
    logoHref = ROUTES.ADMIN.DASHBOARD;
  } else if (isTesterRole) {
    logoHref = ROUTES.TESTER.DASHBOARD;
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
