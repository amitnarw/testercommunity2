
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { InTestersLogo } from './icons';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from './ui/sheet';
import { Menu, ArrowRight, Sun, Moon, User, LogOut, LayoutDashboard, Settings, LifeBuoy, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { demoUser } from '@/lib/data.tsx';

const navItems = [
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Blog', href: '/blog' },
];


const UserNav = () => {
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
                <LayoutDashboard className="mr-2" />
                Dashboard
            </DropdownMenuItem>
          </Link>
          <Link href="/profile">
            <DropdownMenuItem>
                <User className="mr-2" />
                Profile
            </DropdownMenuItem>
          </Link>
          <Link href="/help">
            <DropdownMenuItem>
                <LifeBuoy className="mr-2" />
                Support
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="/">
            <DropdownMenuItem>
            <LogOut className="mr-2" />
            Log out
            </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isAuthenticated = pathname.startsWith('/dashboard') || pathname.startsWith('/profile');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mobileNavItems = [
    ...(isAuthenticated 
        ? [{ name: 'Dashboard', href: '/dashboard' }]
        : [{ name: 'Home', href: '/' }]),
    ...navItems
  ];

  const mobileAuthNavItems = [
      { name: 'Profile', href: '/profile', icon: <User /> },
      { name: 'Support', href: '/help', icon: <LifeBuoy /> },
      { name: 'Log out', href: '/', icon: <LogOut /> },
  ]

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <InTestersLogo className="h-8" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
             {isAuthenticated ? (
                 <Link
                    href="/dashboard"
                    data-text="Dashboard"
                    className={cn(
                    'font-medium transition-colors sliding-text-hover',
                    pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                    )}
                >
                    <span>Dashboard</span>
                </Link>
            ) : (
                 <Link
                    href="/"
                    data-text="Home"
                    className={cn(
                    'font-medium transition-colors sliding-text-hover',
                    pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                    )}
                >
                    <span>Home</span>
                </Link>
            )}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                data-text={item.name}
                className={cn(
                  'font-medium transition-colors sliding-text-hover',
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
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
            {isAuthenticated ? (
                <div className="hidden md:block">
                    <UserNav />
                </div>
            ) : (
                <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild>
                    <Link href="/signup">Sign Up <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            )}
            <div className="md:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="top" className="flex flex-col">
                        <div className="absolute top-4 right-4">
                            <SheetClose asChild>
                                <Button size="icon" variant="outline">
                                    <X className="h-6 w-6" />
                                    <span className="sr-only">Close menu</span>
                                </Button>
                            </SheetClose>
                        </div>
                        <SheetHeader>
                        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                        </SheetHeader>
                        <div className="p-6 pt-20 w-full">
                            <nav className="flex flex-col items-center text-center gap-8">
                                {mobileNavItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        className={cn(
                                        'text-2xl font-medium transition-colors hover:text-primary',
                                        pathname === item.href ? 'text-primary' : 'text-foreground'
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-12 flex flex-col gap-4">
                                {isAuthenticated ? (
                                    <div className="border-t pt-8 mt-4">
                                        <nav className="flex flex-col items-center text-center gap-8">
                                            {mobileAuthNavItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={() => setMenuOpen(false)}
                                                    className={cn(
                                                        'flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary',
                                                        pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                                                    )}
                                                >
                                                    {item.icon}
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                ) : (
                                    <>
                                     <Button variant="outline" size="lg" asChild onClick={() => setMenuOpen(false)}>
                                        <Link href="/login">Log In</Link>
                                    </Button>
                                    <Button asChild size="lg" onClick={() => setMenuOpen(false)}>
                                        <Link href="/signup">Sign Up</Link>
                                    </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
