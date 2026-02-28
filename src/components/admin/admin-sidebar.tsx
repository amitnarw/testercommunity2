"use client";

import { TransitionLink } from "@/components/transition-link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LogOut,
  ChevronRight,
  ChevronLeft,
  FileCheck,
  Lightbulb,
  Bell,
  Users,
  DollarSign,
  Users2,
  User,
  ChevronDown,
  Ticket,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

// Admin sidebar navigation with clear sections
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
];

const NavLink = ({
  href,
  icon: Icon,
  isCollapsed,
  children,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  isCollapsed: boolean;
  children: React.ReactNode;
  badge?: string;
}) => {
  const pathname = usePathname();
  // For exact match (links without query params), check pathname equality
  // For links with query params, only active if we're on that exact URL with those params
  const isActive = href.includes("?")
    ? pathname === href.split("?")[0] &&
      typeof window !== "undefined" &&
      window.location.search.includes(href.split("?")[1])
    : pathname === href;

  const getBadgeStyles = () => {
    if (badge === "PRO") return "bg-amber-500/30 text-amber-300";
    if (badge === "FREE") return "bg-blue-500/30 text-blue-300";
    return "";
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <TransitionLink
            href={href}
            className={cn(
              "flex items-center justify-start w-full h-12 rounded-xl text-white/70 dark:text-black/70 transition-all duration-300 px-3.5",
              "hover:bg-white/20 hover:text-white dark:hover:text-black",
              isActive &&
                "bg-gradient-to-br from-primary to-primary/30 text-white",
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <div className="ml-4 flex items-center justify-between w-full overflow-hidden">
                <span className="font-light whitespace-nowrap truncate">
                  {children}
                </span>
                {badge && (
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0",
                      getBadgeStyles(),
                    )}
                  >
                    {badge}
                  </span>
                )}
              </div>
            )}
          </TransitionLink>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent
            side="right"
            className="bg-black text-white border-white/20 ml-2"
          >
            <div className="flex items-center gap-2">
              <span>{children}</span>
              {badge && (
                <span
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded",
                    getBadgeStyles(),
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

interface AdminSidebarProps {
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export function AdminSidebar({
  onLogout,
  isCollapsed,
  setIsCollapsed,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  // Check if navigation content overflows
  useEffect(() => {
    const checkOverflow = () => {
      if (navRef.current) {
        const { scrollHeight, clientHeight } = navRef.current;
        setShowScrollIndicator(scrollHeight > clientHeight);
      }
    };

    checkOverflow();
    // Re-check on collapse toggle
    const timer = setTimeout(checkOverflow, 350);
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  // Hide scroll indicator when user scrolls to bottom
  const handleScroll = () => {
    if (navRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = navRef.current;
      // Hide indicator when near bottom (within 20px)
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setShowScrollIndicator(false);
      } else if (scrollHeight > clientHeight) {
        setShowScrollIndicator(true);
      }
    }
  };

  return (
    <div
      data-loc="AdminSidebar"
      className="fixed z-[55] h-full hidden md:flex items-center justify-center pl-4 bg-brand-background"
    >
      <aside
        className={cn(
          "left-4 h-[95vh]",
          "flex",
          "transition-all duration-300",
          isCollapsed ? "w-16" : "w-72",
        )}
      >
        <div className="flex flex-col items-center justify-between gap-4 bg-sidebar text-white py-5 rounded-2xl shadow-2xl border border-white/10 relative w-full">
          {/* Logo - Inverted for sidebar (sidebar is dark in light mode, light in dark mode) */}
          <TransitionLink href="/admin/dashboard">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/inTesters-logo.svg"
                alt="InTesters Logo"
                fill
                className="object-contain invert dark:invert-0"
                priority
              />
            </div>
          </TransitionLink>

          {/* Collapse Toggle */}
          <div className="mb-8 mt-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`bg-primary text-white rounded-full p-1 shadow-2xl absolute -right-3 duration-700 hover:scale-125 flex items-center justify-center ${
                isCollapsed ? "w-7" : "w-32"
              }`}
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>

          {/* Navigation - Scrollable without visible scrollbar */}
          <div className="flex-1 flex flex-col min-h-0 relative w-full">
            <nav
              ref={navRef}
              onScroll={handleScroll}
              className="flex flex-col gap-1 w-full px-2 mt-2 flex-1 overflow-y-auto scrollbar-hide"
              style={{
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE and Edge
              }}
            >
              {/* Overview Section */}
              <div className="mb-1">
                {!isCollapsed && (
                  <span className="text-[10px] font-semibold text-white/40 dark:text-black/40 uppercase tracking-wider px-3">
                    Overview
                  </span>
                )}
                {adminNavLinks
                  .filter((l) => l.section === "overview")
                  .map((link) => (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      icon={link.icon}
                      isCollapsed={isCollapsed}
                      badge={link.badge}
                    >
                      {link.name}
                    </NavLink>
                  ))}
              </div>

              {/* Divider */}
              {!isCollapsed && (
                <div className="h-px bg-white/10 dark:bg-black/10 mx-3 my-1" />
              )}

              {/* Paid Services Section */}
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
                    <NavLink
                      key={link.href}
                      href={link.href}
                      icon={link.icon}
                      isCollapsed={isCollapsed}
                      badge={link.badge}
                    >
                      {link.name}
                    </NavLink>
                  ))}
              </div>

              {/* Divider */}
              {!isCollapsed && (
                <div className="h-px bg-white/10 dark:bg-black/10 mx-3 my-1" />
              )}

              {/* Free Services Section */}
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
                    <NavLink
                      key={link.href}
                      href={link.href}
                      icon={link.icon}
                      isCollapsed={isCollapsed}
                      badge={link.badge}
                    >
                      {link.name}
                    </NavLink>
                  ))}
              </div>

              {/* Divider */}
              {!isCollapsed && (
                <div className="h-px bg-white/10 dark:bg-black/10 mx-3 my-1" />
              )}

              {/* Platform Section */}
              <div className="mb-1">
                {!isCollapsed && (
                  <span className="text-[10px] font-semibold text-white/40 dark:text-black/40 uppercase tracking-wider px-3">
                    Platform
                  </span>
                )}
                {adminNavLinks
                  .filter((l) => l.section === "platform")
                  .map((link) => (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      icon={link.icon}
                      isCollapsed={isCollapsed}
                      badge={link.badge}
                    >
                      {link.name}
                    </NavLink>
                  ))}
              </div>
            </nav>

            {/* Scroll for more indicator - positioned absolute above logout */}
            {showScrollIndicator && !isCollapsed && (
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-2 bg-gradient-to-t from-sidebar via-sidebar/95 to-transparent z-30 pointer-events-none">
                <span className="text-[11px] text-white/60 dark:text-black/60 flex items-center gap-1 animate-pulse">
                  <ChevronDown size={14} />
                  Scroll for more
                </span>
              </div>
            )}
          </div>

          {/* Bottom Section - Profile and Logout - Always visible */}
          <div className="w-full px-2 pt-2 border-t border-white/10 dark:border-black/10 flex-shrink-0">
            <NavLink href="/profile" icon={User} isCollapsed={isCollapsed}>
              Profile
            </NavLink>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={onLogout}
                    className={cn(
                      "flex items-center justify-start w-full h-12 rounded-xl text-white/70 dark:text-black/70 transition-all duration-300 px-3.5",
                      "hover:bg-white/20 hover:text-white",
                    )}
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-4 font-light whitespace-nowrap">
                        Log Out
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent
                    side="right"
                    className="bg-black text-white border-white/20 ml-2"
                  >
                    Log Out
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </aside>
    </div>
  );
}
