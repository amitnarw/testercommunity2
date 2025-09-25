
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Briefcase, DollarSign, LifeBuoy, ChevronRight, ChevronLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { SiteLogo } from "../icons";

const proNavLinks = [
    { name: "Dashboard", href: "/professional/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/professional/projects", icon: Briefcase },
    { name: "Earnings", href: "/professional/earnings", icon: DollarSign },
    { name: "Support", href: "/professional/support", icon: LifeBuoy },
];

const NavLink = ({ href, icon: Icon, isCollapsed, children }: { href: string, icon: React.ElementType, isCollapsed: boolean, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link href={href} className={cn(
                        "flex items-center justify-start w-full h-12 rounded-lg text-muted-foreground transition-colors duration-200 px-4",
                        "hover:bg-secondary/80 hover:text-foreground",
                        isActive && "bg-primary/10 text-primary font-semibold"
                    )}>
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="ml-4 font-medium whitespace-nowrap">{children}</span>}
                    </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right" className="bg-popover text-popover-foreground border-border/50 ml-2">
                    {children}
                </TooltipContent>}
            </Tooltip>
        </TooltipProvider>
    );
};

interface ProfessionalSidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export function ProfessionalSidebar({ isCollapsed, setIsCollapsed }: ProfessionalSidebarProps) {
    return (
        <aside className={cn(
            "fixed left-0 top-0 h-full z-50 hidden md:flex flex-col bg-background border-r",
            "transition-all duration-300",
            isCollapsed ? "w-20" : "w-72"
        )}>
            <div className={cn("flex items-center h-16 px-4 border-b", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && <SiteLogo />}
                 <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded-md hover:bg-secondary"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex flex-col gap-2 p-4 flex-grow">
                {proNavLinks.map(link => (
                    <NavLink key={link.href} href={link.href} icon={link.icon} isCollapsed={isCollapsed}>
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
