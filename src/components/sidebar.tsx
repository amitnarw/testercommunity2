
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users2, PlusCircle, LifeBuoy, LogOut, Bell, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { OfferCard } from "./offer-card";
import { InTestersLogoShort, SiteLogo } from "./icons";

const mainNavLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Developer Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community Hub", href: "/community-dashboard", icon: Users2 },
    { name: "Notifications", href: "/notifications", icon: Bell },
];

const NavLink = ({ href, icon: Icon, children, isCollapsed, onClick }: { href: string, icon: React.ElementType, children: React.ReactNode, isCollapsed: boolean, onClick?: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/' && href !== '/dashboard' && pathname.startsWith(href));

    const linkContent = (
         <div className={cn(
            "flex items-center w-full gap-4 rounded-full px-4 py-3 text-white/70 transition-all duration-300",
            "hover:bg-white/20 hover:text-white",
            isActive && "bg-white/10 text-white font-semibold shadow-inner",
            isCollapsed && "justify-center"
        )}>
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className={cn("transition-opacity duration-200", isCollapsed && "md:opacity-0 md:absolute")}>{children}</span>
        </div>
    );

    if (isCollapsed) {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Link href={href} onClick={onClick}>{linkContent}</Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-black text-white border-white/20">
                        {children}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return <Link href={href} onClick={onClick}>{linkContent}</Link>;
};


interface SidebarProps {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
    onLogout: () => void;
}

export function Sidebar({ isCollapsed, isMobileOpen, setMobileOpen, onLogout }: SidebarProps) {
    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-black transition-transform duration-300 ease-in-out md:transition-[width]",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
            "md:translate-x-0",
            isCollapsed ? "w-full md:w-20" : "w-64"
        )}>
            <div className="flex h-full max-h-screen flex-col p-4">
                <div className={cn("flex h-16 items-center", isCollapsed ? "justify-center" : "justify-start")}>
                    <Link href="/dashboard" className={cn("transition-opacity duration-300", isCollapsed && "hidden")}>
                       <SiteLogo className="h-10" />
                    </Link>
                     <Link href="/dashboard" className={cn("transition-opacity duration-300", !isCollapsed && "hidden")}>
                       <InTestersLogoShort className="h-8 w-8" />
                    </Link>
                </div>
                
                <div className="flex-1 overflow-y-auto mt-8">
                    <nav className="grid items-start text-sm font-medium gap-2">
                        {mainNavLinks.map(link => (
                            <NavLink key={link.href} href={link.href} icon={link.icon} isCollapsed={isCollapsed} onClick={() => setMobileOpen(false)}>
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto space-y-4">
                     <OfferCard isCollapsed={isCollapsed} />
                    <nav className="grid items-start text-sm font-medium gap-2">
                       <NavLink href="/help" icon={LifeBuoy} isCollapsed={isCollapsed} onClick={() => setMobileOpen(false)}>Support</NavLink>
                       <div onClick={onLogout}>
                            <NavLink href="/" icon={LogOut} isCollapsed={isCollapsed} onClick={() => setMobileOpen(false)}>Log Out</NavLink>
                       </div>
                    </nav>
                </div>
            </div>
        </aside>
    );
}
