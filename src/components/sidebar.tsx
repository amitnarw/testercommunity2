
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users2, LogOut, Bell, ChevronRight, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { InTestersLogoShortHeader } from "./icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { demoUser } from "@/lib/data";

const mainNavLinks = [
    { name: "Developer Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community Hub", href: "/community-dashboard", icon: Users2 },
    { name: "Notifications", href: "/notifications", icon: Bell },
];

const NavLink = ({ href, icon: Icon, children }: { href: string, icon: React.ElementType, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link href={href} className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl text-white/70 transition-all duration-300",
                        "hover:bg-white/20 hover:text-white",
                        isActive && "bg-gradient-to-br from-primary to-primary/30 text-white"
                    )}>
                        <Icon className="h-5 w-5" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-black text-white border-white/20 ml-2">
                    {children}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};


interface SidebarProps {
    onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
    return (
        <aside className={cn(
            "fixed top-1/2 left-4 z-50 -translate-y-1/2 h-[95vh]", // Floating position
            "hidden md:flex" // Hide on mobile
        )}>
            <div className="flex flex-col items-center justify-between gap-4 bg-[#121212] text-white p-2 py-5 rounded-2xl shadow-2xl border border-white/10 relative">
                <Link href="/dashboard">
                    <InTestersLogoShortHeader className="h-10 w-10" />
                </Link>

                <div className="mb-8 mt-2">
                    <button className="bg-white rounded-full p-1 text-black shadow-2xl absolute -right-3 duration-300 hover:scale-125 hover:bg-primary hover:text-white">
                        <ChevronRight size={20} />
                    </button>
                </div>
                
                <nav className="flex flex-col items-center gap-2 h-full">
                    {mainNavLinks.map(link => (
                        <NavLink key={link.href} href={link.href} icon={link.icon}>
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
                
                <div className="flex flex-col items-center gap-2">
                    <NavLink href="/profile" icon={Settings}>Profile</NavLink>
                    <div onClick={onLogout}>
                        <NavLink href="/" icon={LogOut}>Log Out</NavLink>
                    </div>
                    <Link href="/profile" className="mt-2">
                         <Avatar className="h-12 w-12 border-2 border-primary/50">
                            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format=fit=crop" data-ai-hint="man smiling" alt="User Avatar" />
                            <AvatarFallback>{demoUser.role.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
