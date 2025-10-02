
'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users2, User, Gem, LifeBuoy, LogOut, ChevronDown, Package, Briefcase, DollarSign, FileCheck, Bug, Users, UserPlus, MessageSquare, Lightbulb } from 'lucide-react';
import { useEffect, useState } from "react";


interface UserNavProps {
    onLogout: () => void;
}

export function UserNav({ onLogout }: UserNavProps) {
    const pathname = usePathname();
    const [user, setUser] = useState({ name: 'Demo User', email: 'demo@inTesters.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format=fit=crop' });

    useEffect(() => {
        const name = document.cookie.split('; ').find(row => row.startsWith('user_name='))?.split('=')[1] || 'Demo User';
        const email = document.cookie.split('; ').find(row => row.startsWith('user_email='))?.split('=')[1] || 'demo@inTesters.com';
        const avatar = document.cookie.split('; ').find(row => row.startsWith('user_avatar='))?.split('=')[1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format=fit=crop';
        setUser({ name: decodeURIComponent(name), email: decodeURIComponent(email), avatar: decodeURIComponent(avatar) });
    }, [pathname]);


    const isAdmin = pathname.startsWith('/admin');
    const isPro = pathname.startsWith('/professional');

    const getNavLinks = () => {
        if (isAdmin) {
            return (
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Admin Menu</DropdownMenuLabel>
                    <Link href="/admin/dashboard"><DropdownMenuItem className="h-10"><LayoutDashboard className="mr-2" /><span>Dashboard</span></DropdownMenuItem></Link>
                    <Link href="/admin/users"><DropdownMenuItem className="h-10"><Users className="mr-2" /><span>Users</span></DropdownMenuItem></Link>
                    <Link href="/admin/submissions"><DropdownMenuItem className="h-10"><FileCheck className="mr-2" /><span>Submissions</span></DropdownMenuItem></Link>
                    <Link href="/admin/applications"><DropdownMenuItem className="h-10"><UserPlus className="mr-2" /><span>Applications</span></DropdownMenuItem></Link>
                    <Link href="/admin/feedback"><DropdownMenuItem className="h-10"><MessageSquare className="mr-2" /><span>Feedback</span></DropdownMenuItem></Link>
                    <Link href="/admin/suggestions"><DropdownMenuItem className="h-10"><Lightbulb className="mr-2" /><span>Suggestions</span></DropdownMenuItem></Link>
                </DropdownMenuGroup>
            );
        }
        if (isPro) {
            return (
                 <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Pro Menu</DropdownMenuLabel>
                    <Link href="/professional/tester/dashboard"><DropdownMenuItem className="h-10"><LayoutDashboard className="mr-2" /><span>Pro Dashboard</span></DropdownMenuItem></Link>
                    <Link href="/professional/projects"><DropdownMenuItem className="h-10"><Briefcase className="mr-2" /><span>Projects</span></DropdownMenuItem></Link>
                    <Link href="/professional/earnings"><DropdownMenuItem className="h-10"><DollarSign className="mr-2" /><span>Earnings</span></DropdownMenuItem></Link>
                </DropdownMenuGroup>
            )
        }
        return (
            <>
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Dashboards</DropdownMenuLabel>
                    <Link href="/dashboard">
                        <DropdownMenuItem className="h-10">
                            <LayoutDashboard className="mr-2" />
                            <span>Developer Dashboard</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/community-dashboard">
                        <DropdownMenuItem className="h-10">
                            <Users2 className="mr-2" />
                            <span>Community Hub</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                 <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Account</DropdownMenuLabel>
                    <Link href="/profile">
                        <DropdownMenuItem className="h-10">
                            <User className="mr-2" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/pricing">
                        <DropdownMenuItem className="h-10">
                            <Package className="mr-2" />
                            <span>Buy Packages</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/help">
                        <DropdownMenuItem className="h-10">
                            <LifeBuoy className="mr-2" />
                            <span>Support</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
            </>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-auto rounded-full p-1.5">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} data-ai-hint="user avatar" alt="User Avatar" />
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 rounded-xl shadow-xl border-border/10 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                             <AvatarImage src={user.avatar} data-ai-hint="user avatar" alt="User Avatar" />
                             <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                         <div>
                            <p className="text-sm font-bold leading-none text-foreground">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground mt-1">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {getNavLinks()}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="h-10 text-red-500 focus:bg-red-500/10 focus:text-red-600">
                    <LogOut className="mr-2" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
