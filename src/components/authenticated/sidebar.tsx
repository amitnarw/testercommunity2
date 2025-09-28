
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users2, LogOut, Bell, ChevronRight, ChevronLeft, Briefcase, DollarSign, LifeBuoy, FileCheck, Bug, Users, UserPlus, MessageSquare, Lightbulb } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { InTestersLogoShortHeader } from "../icons";

const mainNavLinks = [
    { name: "Developer Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community Hub", href: "/community-dashboard", icon: Users2 },
    { name: "Notifications", href: "/notifications", icon: Bell },
];

const proNavLinks = [
    { name: "Pro Dashboard", href: "/professional/tester/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/professional/projects", icon: Briefcase },
    { name: "Earnings", href: "/professional/earnings", icon: DollarSign },
    { name: "Support", href: "/professional/support", icon: LifeBuoy },
];

const adminNavLinks = [
    { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Submissions", href: "/admin/submissions", icon: FileCheck },
    { name: "Applications", href: "/admin/applications", icon: UserPlus },
    { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },z
    { name: "Suggestions", href: "/admin/suggestions", icon: Lightbulb },
];

const NavLink = ({ href, icon: Icon, isCollapsed, children }: { href: string, icon: React.ElementType, isCollapsed: boolean, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link href={href} className={cn(
                        "flex items-center justify-start w-full h-12 rounded-xl text-white/70 dark:text-black/70 transition-all duration-300 px-3.5",
                        "hover:bg-white/20 hover:text-white",
                        isActive && "bg-gradient-to-br from-primary to-primary/30 text-white"
                    )}>
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="ml-4 font-light whitespace-nowrap">{children}</span>}
                    </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right" className="bg-black text-white border-white/20 ml-2">
                    {children}
                </TooltipContent>}
            </Tooltip>
        </TooltipProvider>
    );
};


interface SidebarProps {
    onLogout: () => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export function Sidebar({ onLogout, isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();
    
    let navLinks = mainNavLinks;
    if (pathname.startsWith('/admin')) {
        navLinks = adminNavLinks;
    } else if (pathname.startsWith('/professional')) {
        navLinks = proNavLinks;
    }

    return (
        <div className="fixed z-[55] h-full hidden md:flex items-center justify-center pl-4 bg-[#f8fafc] dark:bg-[#0f151e]">
            <aside className={cn(
                "left-4 h-[95vh]",
                "flex",
                "transition-all duration-300",
                isCollapsed ? "w-16" : "w-72"
            )}>
                <div className="flex flex-col items-center justify-between gap-4 bg-[#121212] dark:bg-white text-white py-5 rounded-2xl shadow-2xl border border-white/10 relative w-full">
                    <Link href="/dashboard">
                        <InTestersLogoShortHeader className="h-10 w-10" />
                    </Link>

                    <div className="mb-8 mt-2">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`bg-primary text-white rounded-full p-1 shadow-2xl absolute -right-3 duration-700 hover:scale-125 flex items-center justify-center ${isCollapsed ? "w-7" : "w-32"}`}
                        >
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>

                    <nav className="flex flex-col items-center gap-2 h-full w-full px-2">
                        {navLinks.map(link => (
                            <NavLink key={link.href} href={link.href} icon={link.icon} isCollapsed={isCollapsed}>
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex flex-col items-center gap-2 w-full px-2">
                         <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <button onClick={onLogout} className={cn(
                                        "flex items-center justify-start w-full h-12 rounded-xl text-white/70 dark:text-black/70 transition-all duration-300 px-3.5",
                                        "hover:bg-white/20 hover:text-white"
                                    )}>
                                        <LogOut className="h-5 w-5 flex-shrink-0" />
                                        {!isCollapsed && <span className="ml-4 font-light whitespace-nowrap">Log Out</span>}
                                    </button>
                                </TooltipTrigger>
                                {isCollapsed && <TooltipContent side="right" className="bg-black text-white border-white/20 ml-2">
                                    Log Out
                                </TooltipContent>}
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </aside>
        </div>
    );
}
