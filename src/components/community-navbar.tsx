
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';
import { UserNav } from './user-nav';
import MobileMenu from './mobile-menu';


export function CommunityNavbar({ onLogout }: { onLogout: () => void }) {
    const { theme, setTheme } = useTheme();
    const [greeting, setGreeting] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
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
        <header className="sticky top-0 z-40 bg-[#f8fafc] dark:bg-[#0f151e] md:pl-20 py-2">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-end gap-2">

                    <div className='flex fe=lex-row md:gap-2'>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>

                            <div className="hidden md:block">
                                <UserNav onLogout={onLogout} />
                            </div>
                        </div>

                        <MobileMenu
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                            onLogout={onLogout}
                        />
                    </div>

                </div>
            </div>
        </header>
    );
}
