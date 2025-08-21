
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Sun, Moon, Menu, X, LayoutDashboard, Users2, Bell, User, Gift, LifeBuoy, LogOut } from 'lucide-react';
import { UserNav } from './user-nav';
import { Sheet, SheetContent, SheetHeader, SheetClose, SheetTrigger } from './ui/sheet';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { demoUser } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';

const mobileAuthenticatedNavItems = [
  { name: 'Developer Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Community Hub', href: '/community-dashboard', icon: Users2 },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Buy Points', href: '/pricing', icon: Gift },
  { name: 'Support', href: '/help', icon: LifeBuoy },
];

export function CommunityNavbar({ onLogout }: { onLogout: () => void }) {
    const { theme, setTheme } = useTheme();
    const [greeting, setGreeting] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

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
        <header className="sticky top-0 z-40 bg-background md:pl-20 border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <div className="hidden md:block">
                        <h1 className="text-xl font-semibold">
                            {isMounted ? `${greeting}, Demo User` : 'Welcome'}
                        </h1>
                    </div>
                    <div className="md:hidden">
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-full max-w-sm flex flex-col p-0 bg-card">
                                <SheetHeader className="p-4 border-b">
                                    <div className="flex justify-between items-center">
                                        <div className="font-normal p-2">
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
                                        </div>
                                        <SheetClose asChild>
                                          <Button size="icon" variant="ghost">
                                            <X className="h-6 w-6" />
                                            <span className="sr-only">Close menu</span>
                                          </Button>
                                        </SheetClose>
                                      </div>
                                </SheetHeader>
                                <div className="p-6 flex flex-col justify-between flex-1">
                                    <nav className="flex flex-col gap-1">
                                        {mobileAuthenticatedNavItems.map((item) => (
                                          <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={cn(
                                              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                                              (pathname.startsWith(item.href) && item.href !== '/') || (pathname === '/' && item.href === '/') ? 'bg-primary/10 text-primary' : ''
                                            )}
                                          >
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                          </Link>
                                        ))}
                                    </nav>
                                    <Button variant="ghost" onClick={() => { onLogout(); setIsMenuOpen(false); }} className='w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10'>
                                      <LogOut className="mr-2 h-4 w-4" />
                                      Log Out
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex items-center gap-2">
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
                        <div className="hidden md:block">
                            <UserNav onLogout={onLogout} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
