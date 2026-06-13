"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
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
  Shield,
  BookOpen,
  Star,
  MessageSquare,
  Headphones,
  Landmark,
  Settings,
  ThumbsUp,
  Zap,
} from "lucide-react";
import { BaseSidebar, SidebarNavLink } from "@/components/ui/base-sidebar";
import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";
import { hasPermission } from "@/lib/permissions";

const mainNavLinks = [
  { name: "Dashboard", href: ROUTES.AUTHENTICATED.DASHBOARD, icon: Home },
  { name: "Free Testing", href: ROUTES.AUTHENTICATED.FREE_TESTING, icon: Users2 },
  { name: "Pro Testing", href: ROUTES.AUTHENTICATED.PRO_TESTING, icon: Zap, badge: "PRO" },
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
type AdminNavLink = {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  section: string;
  moduleName?: string;
  superAdminOnly?: boolean;
  badge?: string;
};

// Permissions link (super_admin only)
const permissionsNavLink: AdminNavLink = {
  name: "Permission Matrix",
  href: ROUTES.ADMIN.PERMISSIONS,
  icon: Shield,
  section: "system",
  superAdminOnly: true,
};

const adminNavLinks: AdminNavLink[] = [
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
    name: "Free Subs",
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

  // System (super_admin only)
  permissionsNavLink,

  // Support
  {
    name: "Support",
    href: ROUTES.ADMIN.SUPPORT,
    icon: Headphones,
    section: "support",
    moduleName: "support",
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

  let navLinks: { name: string; href: string; icon: typeof LayoutDashboard; badge?: string }[] = mainNavLinks;
  if (isTesterRole) {
    navLinks = proNavLinks;
  }

  const permissions = role?.permissions;

  function isLinkVisible(link: (typeof adminNavLinks)[number]): boolean {
    if (link.superAdminOnly) return roleName === "super_admin";
    if (link.moduleName) return hasPermission(roleName, permissions, link.moduleName, "canReadList");
    return true;
  }

  const sections = [
    { key: "overview" as const, label: "Overview" },
    { key: "paid" as const, label: "Paid", color: "text-amber-500" },
    { key: "free" as const, label: "Free", color: "text-black/70" },
    { key: "finance" as const, label: "Finance", color: "text-cyan-300" },
    { key: "platform" as const, label: "Platform" },
    { key: "support" as const, label: "Support", color: "text-green-400" },
    { key: "system" as const, label: "System", color: "text-purple-300" },
  ];

  const navContent = isAdminRole ? (
    <>
      {sections.map((section, idx) => {
        const sectionLinks = adminNavLinks.filter(
          (l) => l.section === section.key && isLinkVisible(l),
        );
        if (sectionLinks.length === 0) return null;

        const isSpecial = section.color !== undefined;

        return (
          <div key={section.key}>
            {idx > 0 && !isCollapsed && (
              <div className="h-px bg-white/10 dark:bg-black/10 mx-3 my-1" />
            )}
            <div className="mb-1">
              {!isCollapsed && (
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-3 ${
                    isSpecial ? section.color : "text-white/70"
                  }`}
                >
                  {section.label}
                </span>
              )}
              {sectionLinks.map((link) => (
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
          </div>
        );
      })}
    </>
  ) : (
    <>
      {navLinks.map((link) => (
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
  let logoHref: string = ROUTES.AUTHENTICATED.DASHBOARD;
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
