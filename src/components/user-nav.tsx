
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
import { LayoutDashboard, Users2, User, Gift, LifeBuoy, LogOut, ChevronDown } from 'lucide-react';
import { demoUser } from "@/lib/data";

interface UserNavProps {
    onLogout: () => void;
}

export function UserNav({ onLogout }: UserNavProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                         <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format=fit=crop" data-ai-hint="man smiling" alt="User Avatar" />
                         <AvatarFallback>{demoUser.role.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 rounded-xl shadow-xl border-border/10 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format=fit=crop" alt="User Avatar" />
                            <AvatarFallback>{demoUser.role.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                         <div>
                            <p className="text-sm font-bold leading-none text-foreground">Demo User</p>
                            <p className="text-xs leading-none text-muted-foreground mt-1">
                                demo@inTesters.com
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
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
                            <Gift className="mr-2" />
                            <span>Buy Points</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/help">
                        <DropdownMenuItem className="h-10">
                            <LifeBuoy className="mr-2" />
                            <span>Support</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="h-10 text-red-500 focus:bg-red-500/10 focus:text-red-600">
                    <LogOut className="mr-2" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
