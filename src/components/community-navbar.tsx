
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { demoUser } from '@/lib/data';
import { Sun, Moon, User, LogOut, LayoutDashboard, LifeBuoy, Users2, Gift } from 'lucide-react';

const UserNav = ({ onLogout }: { onLogout: () => void }) => {
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
      <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Demo User</p>
            <p className="text-xs leading-none text-muted-foreground">
              demo@inTesters.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard">
            <DropdownMenuItem>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Developer Dashboard
            </DropdownMenuItem>
          </Link>
          <Link href="/community-dashboard">
            <DropdownMenuItem>
              <Users2 className="mr-2 h-4 w-4" />
              Community Hub
            </DropdownMenuItem>
          </Link>
          <Link href="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
          </Link>
          <Link href="/pricing">
            <DropdownMenuItem>
              <Gift className="mr-2 h-4 w-4" />
              Buy Points
            </DropdownMenuItem>
          </Link>
          <Link href="/help">
            <DropdownMenuItem>
              <LifeBuoy className="mr-2 h-4 w-4" />
              Support
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="/">
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export function CommunityNavbar({ onLogout }: { onLogout: () => void }) {
    const { theme, setTheme } = useTheme();
    const [greeting, setGreeting] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good morning');
        } else if (hour < 18) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
    }, []);

    return (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {isMounted ? `${greeting}, Demo User` : 'Welcome'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {isMounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        )}
                        <UserNav onLogout={onLogout} />
                    </div>
                </div>
            </div>
        </header>
    );
}
