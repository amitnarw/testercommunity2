
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users2, LogOut, Bell, ChevronRight, Settings, ChevronLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { InTestersLogoShortHeader } from "./icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { demoUser } from "@/lib/data";

const mainNavLinks = [
    { name: "Developer Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community Hub", href: "/community-dashboard", icon: Users2 },
    { name: "Notifications", href: "/notifications", icon: Bell },
];

const NavLink = ({ href, icon: Icon, children, isCollapsed }: { href: string, icon: React.ElementType, children: React.ReactNode, isCollapsed: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link href={href} className={cn(
                        "flex items-center gap-4 w-full h-12 rounded-xl text-white/70 transition-all duration-300",
                        isCollapsed ? "justify-center" : "px-4",
                        "hover:bg-white/20 hover:text-white",
                        isActive && "bg-gradient-to-br from-primary to-primary/30 text-white"
                    )}>
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className={cn("transition-opacity duration-200", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>{children}</span>
                    </Link>
                </TooltipTrigger>
                {isCollapsed && (
                    <TooltipContent side="right" className="bg-black text-white border-white/20 ml-2">
                        {children}
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
};


interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    onLogout: () => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed, onLogout }: SidebarProps) {
    return (
        <aside className={cn(
            "fixed top-0 left-0 z-50 h-full", // Pinned to the left
            "hidden md:flex", // Hide on mobile
            "transition-all duration-300 ease-in-out",
            isCollapsed ? "w-24" : "w-64"
        )}>
            <div className="flex flex-col items-center justify-between gap-4 bg-[#121212] text-white p-4 w-full relative">
                <div>
                    <Link href="/dashboard">
                        <div className={cn("flex items-center gap-2", isCollapsed ? "justify-center" : "justify-start")}>
                            <InTestersLogoShortHeader className="h-10 w-10 flex-shrink-0" />
                            <span className={cn("font-bold text-lg transition-opacity duration-200", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>inTesters</span>
                        </div>
                    </Link>
                </div>
                
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="bg-white rounded-full p-1 text-black shadow-2xl absolute -right-3 top-16 duration-300 hover:scale-125 hover:bg-primary hover:text-white z-10 transition-transform">
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                
                <nav className="flex flex-col items-center gap-2 h-full w-full mt-10">
                    {mainNavLinks.map(link => (
                        <NavLink key={link.href} href={link.href} icon={link.icon} isCollapsed={isCollapsed}>
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
                
                <div className="flex flex-col items-center gap-2 w-full">
                    <NavLink href="/profile" icon={Settings} isCollapsed={isCollapsed}>Profile</NavLink>
                    <div onClick={onLogout} className="w-full">
                        <NavLink href="/" icon={LogOut} isCollapsed={isCollapsed}>Log Out</NavLink>
                    </div>
                    <Link href="/profile" className="mt-2 border-t border-white/10 pt-4 w-full">
                         <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "px-2")}>
                            <Avatar className="h-12 w-12 border-2 border-primary/50 flex-shrink-0">
                                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format=fit=crop" data-ai-hint="man smiling" alt="User Avatar" />
                                <AvatarFallback>{demoUser.role.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className={cn("transition-opacity duration-200", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                                <p className="text-sm font-semibold whitespace-nowrap">Demo User</p>
                                <p className="text-xs text-white/70 whitespace-nowrap">Developer</p>
                            </div>
                         </div>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
