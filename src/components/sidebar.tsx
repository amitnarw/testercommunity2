
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users2, PlusCircle, LifeBuoy, LogOut, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { OfferCard } from "./offer-card";
import { InTestersLogoShort, SiteLogo } from "./icons";

const mainNavLinks = [
    { name: "Developer Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community Hub", href: "/community-dashboard", icon: Users2 },
    { name: "Notifications", href: "/notifications", icon: Bell },
];

const NavLink = ({ href, icon: Icon, children, isCollapsed, onClick }: { href: string, icon: React.ElementType, children: React.ReactNode, isCollapsed: boolean, onClick?: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

    const linkContent = (
         <div className={cn(
            "flex items-center gap-4 rounded-lg px-4 py-3 text-muted-foreground transition-all duration-300",
            "hover:bg-primary/10 hover:text-primary",
            isActive && "bg-primary/10 text-primary font-semibold",
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
                    <TooltipContent side="right">
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
            "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-background transition-transform duration-300 ease-in-out md:transition-[width]",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
            "md:translate-x-0",
            isCollapsed ? "w-full md:w-20" : "w-64"
        )}>
            <div className="flex h-full max-h-screen flex-col">
                <div className={cn("flex h-20 items-center border-b px-4", isCollapsed ? "justify-center" : "justify-between")}>
                    <Link href="/dashboard" className={cn("transition-opacity duration-300", isCollapsed && "opacity-0 invisible")}>
                       <SiteLogo className="h-10" />
                    </Link>
                     <Link href="/dashboard" className={cn("transition-opacity duration-300", !isCollapsed && "opacity-0 invisible")}>
                       <InTestersLogoShort className="h-8 w-8" />
                    </Link>
                </div>
                
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    <nav className="grid items-start px-2 text-sm font-medium gap-1">
                        {mainNavLinks.map(link => (
                            <NavLink key={link.href} href={link.href} icon={link.icon} isCollapsed={isCollapsed} onClick={() => setMobileOpen(false)}>
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className={cn("px-2", isCollapsed && "px-0 text-center")}>
                            <div className="my-4 border-t -mx-2"></div>
                             <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button asChild className={cn("w-full justify-center", isCollapsed && "w-auto h-auto p-3")}>
                                            <Link href="/dashboard/add-app" onClick={() => setMobileOpen(false)}>
                                                <PlusCircle className={cn("mr-2 h-4 w-4", isCollapsed && "md:mr-0")}/>
                                                <span className={cn(isCollapsed && "md:sr-only")}>Submit App</span>
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        Submit App
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                    </div>
                </div>

                <div className="mt-auto p-4 space-y-4">
                     <OfferCard isCollapsed={isCollapsed} />
                    <nav className="grid items-start px-0 text-sm font-medium gap-1">
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
