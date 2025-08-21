
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';
import { UserNav } from './user-nav';

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
        <header className="sticky top-0 z-40 bg-secondary/50 border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {isMounted ? `${greeting}, Demo User` : 'Welcome'}
                        </h1>
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
                        <UserNav onLogout={onLogout} />
                    </div>
                </div>
            </div>
        </header>
    );
}
