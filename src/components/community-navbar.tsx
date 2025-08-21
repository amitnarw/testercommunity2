
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { UserNav } from './user-nav';
import { Sheet, SheetContent, SheetHeader, SheetClose, SheetTrigger } from './ui/sheet';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const mobileAuthenticatedNavItems = [
  { name: 'Community Hub', href: '/community-dashboard' },
  { name: 'My Submissions', href: '/community-dashboard/my-submissions' },
  { name: 'Developer Dashboard', href: '/dashboard' },
  { name: 'Notifications', href: '/notifications' },
  { name: 'Profile', href: '/profile' },
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
        <header className="sticky top-0 z-40 bg-background dark:bg-[#0f151e] md:pl-20 border-b">
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
                                        <UserNav onLogout={() => { onLogout(); setIsMenuOpen(false); }} />
                                        <SheetClose asChild>
                                          <Button size="icon" variant="ghost">
                                            <X className="h-6 w-6" />
                                            <span className="sr-only">Close menu</span>
                                          </Button>
                                        </SheetClose>
                                      </div>
                                </SheetHeader>
                                <div className="p-6 flex flex-col justify-between flex-1">
                                    <nav className="flex flex-col gap-4">
                                        {mobileAuthenticatedNavItems.map((item) => (
                                          <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={cn(
                                              'text-lg font-medium transition-colors hover:text-primary',
                                              pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                                            )}
                                          >
                                            {item.name}
                                          </Link>
                                        ))}
                                    </nav>
                                    <Button variant="destructive" onClick={() => { onLogout(); setIsMenuOpen(false); }} className='w-full'>
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
