"use client";

import Image from "next/image";
import { TransitionLink } from "@/components/transition-link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  section?: string;
  badge?: string;
}

export const SidebarNavLink = ({
  href,
  icon: Icon,
  isCollapsed,
  children,
  badge,
  activeMatch,
}: {
  href: string;
  icon: React.ElementType;
  isCollapsed: boolean;
  children: React.ReactNode;
  badge?: string;
  activeMatch?: (pathname: string, href: string) => boolean;
}) => {
  const pathname = usePathname();

  // The original admin sidebar used strict equality, while the normal sidebar
  // used `.startsWith()`. To unify but avoid active collisions (e.g. /dashboard triggering /),
  // we check if the path precisely starts with the href, ensuring it's not just a substring
  // match unless it's exactly the path or follows with a sub-path segment (like /admin/users and /admin/users/1)
  const isActive = activeMatch
    ? activeMatch(pathname, href)
    : href.includes("?")
      ? pathname === href.split("?")[0] &&
        typeof window !== "undefined" &&
        window.location.search.includes(href.split("?")[1])
      : pathname === href || pathname.startsWith(`${href}/`);

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
                "bg-white text-black shadow-xl dark:bg-black dark:text-white dark:from-black dark:to-black",
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <div className="ml-4 flex items-center justify-between w-full overflow-hidden">
                <span className="font-light whitespace-nowrap truncate text-sm">
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
            className="bg-black text-white border-white/20 ml-2 z-[60]"
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

export interface BaseSidebarProps {
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  logoHref: string;
  navContent: ReactNode; // We let the specific sidebar pass in the mapped nav items, section headers, etc.
  bottomContent?: ReactNode; // For Wallet, Profile, etc.
  showScrollIndicator?: boolean; // Useful for admin panel
  className?: string; // Additional classes for the inner container (e.g. background gradients)
}

export function BaseSidebar({
  onLogout,
  isCollapsed,
  setIsCollapsed,
  logoHref,
  navContent,
  bottomContent,
  showScrollIndicator = false,
  className,
}: BaseSidebarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  // Check if navigation content overflows
  useEffect(() => {
    if (!showScrollIndicator) return;

    const checkOverflow = () => {
      if (navRef.current) {
        const { scrollHeight, clientHeight } = navRef.current;
        setCanScroll(scrollHeight > clientHeight);
      }
    };

    checkOverflow();
    // Re-check on collapse toggle
    const timer = setTimeout(checkOverflow, 350);
    return () => clearTimeout(timer);
  }, [isCollapsed, showScrollIndicator]);

  // Hide scroll indicator when user scrolls to bottom
  const handleScroll = () => {
    if (!showScrollIndicator) return;

    if (navRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = navRef.current;
      // Hide indicator when near bottom (within 20px)
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setCanScroll(false);
      } else if (scrollHeight > clientHeight) {
        setCanScroll(true);
      }
    }
  };

  return (
    <div
      data-loc="BaseSidebar"
      className="fixed z-[55] h-full hidden md:flex items-center justify-center pl-4 bg-brand-background pointer-events-none"
    >
      <aside
        className={cn(
          "left-4 h-[95vh]",
          "flex",
          "transition-all duration-300 pointer-events-auto",
          isCollapsed ? "w-16" : "w-72",
        )}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-between text-white py-5 rounded-2xl shadow-2xl border border-white/10 relative w-full",
            className || "bg-sidebar", // Default to the dark sidebar background
          )}
        >
          {/* Logo */}
          <TransitionLink href={logoHref}>
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
              className={cn(
                "bg-sidebar text-white dark:text-black rounded-full p-1 shadow-2xl absolute -right-3 duration-700 hover:scale-125 flex items-center justify-center z-[60]",
                isCollapsed ? "w-7" : "w-32",
              )}
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>

          {/* Navigation Area */}
          <div className="flex-1 flex flex-col min-h-0 relative w-full overflow-hidden">
            <nav
              ref={navRef}
              onScroll={handleScroll}
              className={cn(
                "flex flex-col gap-1 w-full px-2 mt-2 flex-1 overflow-y-auto scrollbar-hide pb-4",
                showScrollIndicator &&
                  canScroll &&
                  !isCollapsed &&
                  "seamless-scroll-mask",
              )}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {navContent}
            </nav>

            {/* Optional scroll indicator */}
            <AnimatePresence>
              {showScrollIndicator && canScroll && !isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute bottom-4 left-0 right-0 pointer-events-none flex justify-center z-20"
                >
                  <span className="text-[10px] text-white/70 animate-pulse bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10 shadow-lg">
                    Scroll for more
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Section */}
          <div className="w-full px-2 pt-2 border-t border-white/20 dark:border-black/30 flex-shrink-0 flex flex-col gap-1 z-20 bg-inherit">
            {bottomContent}

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
                      <span className="ml-4 font-light whitespace-nowrap text-sm">
                        Log Out
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent
                    side="right"
                    className="bg-black text-white border-white/20 ml-2 z-[60]"
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
