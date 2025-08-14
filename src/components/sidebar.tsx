
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InTestersLogo } from "./icons";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, ShoppingBag, PlusCircle, LifeBuoy, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { demoUser } from "@/lib/data";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup } from './ui/dropdown-menu';


const mainNavLinks = [
    { name: "Developer Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Community Hub", href: "/community-dashboard", icon: Users },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
];

const NavLink = ({ href, icon: Icon, children }: { href: string, icon: React.ElementType, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

    return (
        <Link href={href} className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-primary/10 text-primary"
        )}>
            <Icon className="h-4 w-4" />
            {children}
        </Link>
    );
};


export function Sidebar() {
    return (
        <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50 border-r bg-background">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-20 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <InTestersLogo className="h-8" />
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {mainNavLinks.map(link => (
                            <NavLink key={link.href} href={link.href} icon={link.icon}>
                                {link.name}
                            </NavLink>
                        ))}

                        <div className="my-4 border-t -mx-4"></div>

                        <Button asChild className="mb-4">
                            <Link href="/dashboard/add-app"><PlusCircle className="mr-2" /> Submit App</Link>
                        </Button>
                        
                        <NavLink href="/help" icon={LifeBuoy}>Support</NavLink>
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2 px-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format=fit=crop" alt="User Avatar" />
                                    <AvatarFallback>{demoUser.role.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="text-left">
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
