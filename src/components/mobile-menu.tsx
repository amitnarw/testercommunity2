"use client"

import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetClose, SheetTrigger } from './ui/sheet';
import { UserNav } from './user-nav';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const mobileAuthenticatedNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Community', href: '/community-dashboard' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
];


export default function MobileMenu({ isMenuOpen, setIsMenuOpen, onLogout }: {
    isMenuOpen: boolean, setIsMenuOpen: (value: boolean) => void, onLogout: () => void
}) {
    const pathname = usePathname();
    return (
        <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                    <Button size="icon" variant="ghost">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="top" className="flex flex-col h-full">
                    <SheetHeader>
                        <div className="flex justify-end items-center gap-2">
                            <SheetClose asChild>
                                <Button size="icon" variant="ghost">
                                    <X className="h-6 w-6" />
                                    <span className="sr-only">Close menu</span>
                                </Button>
                            </SheetClose>
                        </div>
                    </SheetHeader>
                    <div className="flex flex-col h-full">
                        <nav className="flex flex-col items-center text-center justify-center gap-6 h-full">
                            {mobileAuthenticatedNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        'text-2xl font-medium transition-colors hover:text-primary',
                                        pathname === item.href ? 'text-primary' : 'text-foreground'
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="flex justify-center items-center gap-2">
                            <Button variant="ghost" asChild onClick={() => setIsMenuOpen(false)} className='w-full border'>
                                <Link href="/profile">Profile</Link>
                            </Button>
                            <Button variant="ghost" onClick={() => { onLogout(); setIsMenuOpen(false); }} className='bg-red-500/20 w-full'>
                                Log Out
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>)
}