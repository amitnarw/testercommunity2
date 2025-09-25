
'use client';

import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { Sun, Moon, LogOut } from 'lucide-react';
import { UserNav } from '../user-nav';

export function AdminHeader({ onLogout }: { onLogout: () => void }) {
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-end gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onLogout}
                    >
                        <LogOut className="h-6 w-6" />
                        <span className="sr-only">Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
