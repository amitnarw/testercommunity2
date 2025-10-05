
"use client"

import { Menu, X, LayoutDashboard, Bell, Briefcase, DollarSign, LifeBuoy, Users, FileCheck, Bug, UserPlus, MessageSquare, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetClose, SheetTrigger } from './ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const mainNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Community', href: '/community-dashboard' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
];

const proNavItems = [
    { name: 'Pro Dashboard', href: '/tester/tester/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/tester/projects', icon: Briefcase },
    { name: 'Earnings', href: '/tester/earnings', icon: DollarSign },
    { name: 'Support', href: '/tester/support', icon: LifeBuoy },
];

const adminNavItems = [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Submissions', href: '/admin/submissions', icon: FileCheck },
    { name: 'Applications', href: '/admin/applications', icon: UserPlus },
    { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },
    { name: "Suggestions", href: "/admin/suggestions", icon: Lightbulb },
];


export default function MobileMenu({ isMenuOpen, setIsMenuOpen, onLogout }: {
    isMenuOpen: boolean, setIsMenuOpen: (value: boolean) => void, onLogout: () => void
}) {
    const pathname = usePathname();

    let navItems = mainNavItems;
    if (pathname.startsWith('/admin')) {
        navItems = adminNavItems;
    } else if (pathname.startsWith('/tester')) {
        navItems = proNavItems;
    }

    const isAuthenticated = !pathname.startsWith('/login') && !pathname.startsWith('/signup') && !pathname.startsWith('/tester/login') && !pathname.startsWith('/tester/register');

    const publicNavItems = [
        { name: 'Home', href: '/' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Blog', href: '/blog' },
    ];

    const displayItems = isAuthenticated ? navItems : publicNavItems;

    return (
        <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                    <Button size="icon" variant="ghost">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="top" className="flex flex-col h-full bg-background/95 backdrop-blur-lg">
                    <SheetHeader>
                        <div className="flex justify-between items-center gap-2">
                            <button onClick={() => setIsMenuOpen(false)}>
                                <Link href={"/notifications"}>
                                    <Bell className="h-5 w-5" />
                                    <span className="sr-only">Close menu</span>
                                </Link>
                            </button>
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
                            {displayItems.map((item) => (
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
                        {isAuthenticated ? (
                            <div className="flex justify-center items-center gap-2">
                                <Button variant="ghost" asChild onClick={() => setIsMenuOpen(false)} className='w-full border'>
                                    <Link href="/profile">Profile</Link>
                                </Button>
                                <Button variant="ghost" onClick={() => { onLogout(); setIsMenuOpen(false); }} className='bg-red-500/20 w-full'>
                                    Log Out
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Button asChild size="lg" onClick={() => setIsMenuOpen(false)}><Link href="/login">Log In</Link></Button>
                                <Button asChild size="lg" variant="outline" onClick={() => setIsMenuOpen(false)}><Link href="/signup">Sign Up</Link></Button>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div >)
}
