
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InTestersLogo } from "./icons";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, ShoppingBag, PlusCircle, LifeBuoy, User, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { demoUser } from "@/lib/data";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup } from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const mainNavLinks = [
    { name: "Developer Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community Hub", href: "/community-dashboard", icon: Users },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
];

const NavLink = ({ href, icon: Icon, children, isCollapsed }: { href: string, icon: React.ElementType, children: React.ReactNode, isCollapsed: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

    const linkContent = (
         <div className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-primary/10 text-primary",
            isCollapsed && "justify-center"
        )}>
            <Icon className="h-5 w-5" />
            <span className={cn("transition-opacity", isCollapsed && "opacity-0 absolute")}>{children}</span>
        </div>
    );

    if (isCollapsed) {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Link href={href}>{linkContent}</Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        {children}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return <Link href={href}>{linkContent}</Link>;
};


interface SidebarProps {
    isCollapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setCollapsed }: SidebarProps) {
    return (
        <div className={cn(
            "hidden md:flex h-full flex-col fixed inset-y-0 z-50 border-r bg-background transition-[width] ease-in-out duration-300",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-20 items-center justify-between border-b px-4">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                         <InTestersLogo className={cn("h-8 transition-all", isCollapsed ? "w-8" : "w-auto")} />
                    </Link>
                     <Button variant="ghost" size="icon" onClick={() => setCollapsed(!isCollapsed)}>
                        {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                        <span className="sr-only">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {mainNavLinks.map(link => (
                            <NavLink key={link.href} href={link.href} icon={link.icon} isCollapsed={isCollapsed}>
                                {link.name}
                            </NavLink>
                        ))}

                        <div className="my-4 border-t -mx-4"></div>

                        <div className={cn("px-3", isCollapsed && "px-0 text-center")}>
                             <Button asChild className={cn(isCollapsed && "w-10 h-10 p-0")}>
                                <Link href="/dashboard/add-app">
                                    <PlusCircle className={cn("mr-2", isCollapsed && "mr-0")}/>
                                    <span className={cn(isCollapsed && "sr-only")}>Submit App</span>
                                </Link>
                            </Button>
                        </div>
                        
                         <div className="mt-4">
                            <NavLink href="/help" icon={LifeBuoy} isCollapsed={isCollapsed}>Support</NavLink>
                        </div>
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={cn(
                                "w-full justify-start gap-3 h-auto py-2 px-3",
                                isCollapsed && "p-0 w-10 h-10 justify-center"
                                )}>
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format=fit=crop" alt="User Avatar" />
                                    <AvatarFallback>{demoUser.role.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className={cn("text-left", isCollapsed && "hidden")}>
                                    <p className="text-sm font-medium leading-none">Demo User</p>
                                    <p className="text-xs leading-none text-muted-foreground">demo@inTesters.com</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mb-2 rounded-xl" align="end" side="top" forceMount>
                            <DropdownMenuGroup>
                                <Link href="/profile">
                                    <DropdownMenuItem>
                                        <User className="mr-2" /> Profile
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/">
                                    <DropdownMenuItem>
                                        <LogOut className="mr-2" /> Log out
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
