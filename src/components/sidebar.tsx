
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InTestersLogo } from "./icons";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, PlusCircle, LifeBuoy, LogOut, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const mainNavLinks = [
    { name: "Developer Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community Hub", href: "/community-dashboard", icon: Users },
];

const NavLink = ({ href, icon: Icon, children, isCollapsed, onClick }: { href: string, icon: React.ElementType, children: React.ReactNode, isCollapsed: boolean, onClick?: () => void }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

    const linkContent = (
         <div className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-primary/10 text-primary",
            isCollapsed && "justify-center"
        )}>
            <Icon className="h-5 w-5" />
            <span className={cn("transition-opacity", isCollapsed && "md:opacity-0 md:absolute")}>{children}</span>
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
    setCollapsed: (collapsed: boolean) => void;
    isMobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ isCollapsed, setCollapsed, isMobileOpen, setMobileOpen }: SidebarProps) {
    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-background transition-transform duration-300 ease-in-out md:transition-[width]",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
            "md:translate-x-0", // Always visible on desktop
            isCollapsed ? "w-full md:w-20" : "w-64"
        )}>
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className={cn("flex h-20 items-center border-b px-4", isCollapsed ? "justify-center" : "justify-between")}>
                     <Button variant="ghost" size="icon" onClick={() => setCollapsed(!isCollapsed)} className="hidden md:flex">
                        {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                        <span className="sr-only">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="md:hidden">
                        <X />
                        <span className="sr-only">Close menu</span>
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {mainNavLinks.map(link => (
                            <NavLink key={link.href} href={link.href} icon={link.icon} isCollapsed={isCollapsed} onClick={() => setMobileOpen(false)}>
                                {link.name}
                            </NavLink>
                        ))}

                        <div className="my-4 border-t -mx-4"></div>

                        <div className={cn("px-3", isCollapsed && "px-0 text-center")}>
                             <Button asChild className={cn("w-full justify-center", isCollapsed && "w-10 h-10 p-0 md:w-auto md:p-2")}>
                                <Link href="/dashboard/add-app" onClick={() => setMobileOpen(false)}>
                                    <PlusCircle className={cn("mr-2 h-4 w-4", isCollapsed && "md:mr-0")}/>
                                    <span className={cn(isCollapsed && "md:sr-only")}>Submit App</span>
                                </Link>
                            </Button>
                        </div>
                        
                         <div className="mt-4">
                            <NavLink href="/help" icon={LifeBuoy} isCollapsed={isCollapsed} onClick={() => setMobileOpen(false)}>Support</NavLink>
                        </div>
                    </nav>
                </div>
            </div>
        </aside>
    );
}
