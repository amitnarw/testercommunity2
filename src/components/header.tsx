
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { InTestersLogoShortHeader } from './icons';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetClose } from './ui/sheet';
import { Menu, ArrowRight, Sun, Moon, User, LogOut, LayoutDashboard, LifeBuoy, X, Users2, Gift, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { demoUser } from '@/lib/data.tsx';

const visitorNavItems = [
  { name: 'Home', href: '/' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
];

const authenticatedNavItems = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Community', href: '/community-dashboard' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
];

const mobileAuthenticatedNavItems = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Community', href: '/community-dashboard' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
];


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


interface HeaderProps {
  isAuthenticated: boolean;
  isDashboardPage: boolean;
  isMobileMenuOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

export function Header({
  isAuthenticated,
  isDashboardPage,
  isMobileMenuOpen,
  setMobileOpen,
  isSidebarCollapsed,
  setSidebarCollapsed,
  onLogout
}: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisitorMenuOpen, setVisitorMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = isAuthenticated ? authenticatedNavItems : visitorNavItems;

  if (isAuthPage) return null;

  return (
    <header className="sticky top-4 z-50 w-[95vw] mx-auto">
      <div className="bg-transparent backdrop-blur-lg rounded-full border border-black/5 dark:border-white/5 shadow-inner shadow-black/5 dark:shadow-white/5 transition-all duration-300">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDashboardPage ? (
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => setMobileOpen(!isMobileMenuOpen)} className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="hidden md:flex">
                    {isSidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                    <span className="sr-only">{isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
                  </Button>
                </div>
              ) : (
                <Link href="/">
                  <InTestersLogoShortHeader className="h-10 w-10" />
                </Link>
              )}
            </div>

            {!isDashboardPage && (
              <nav className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    data-text={item.name}
                    className={cn(
                      'font-medium transition-colors sliding-text-hover',
                      (pathname.startsWith(item.href) && item.href !== '/') || (pathname === '/' && item.href === '/') ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-2">
              {isMounted && (
                <>
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
                      <UserNav onLogout={onLogout} />
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
                </>
              )}

              <div className="md:hidden">
                <Sheet open={isVisitorMenuOpen} onOpenChange={setVisitorMenuOpen}>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="top" className="flex flex-col h-full">
                    <SheetHeader>
                      <div className="flex justify-between items-center">
                        {isAuthenticated ? (
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format=fit=crop" data-ai-hint="man smiling" alt="User Avatar" />
                              <AvatarFallback>{demoUser.role.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col items-start justify-start'>
                              <p className="font-bold">Demo User</p>
                              <p className="text-sm text-muted-foreground">demo@inTesters.com</p>
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        )}
                        <SheetClose asChild>
                          <Button size="icon" variant="ghost">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close menu</span>
                          </Button>
                        </SheetClose>
                      </div>
                    </SheetHeader>
                    <div className="p-6 flex flex-col justify-between flex-1">
                      {isAuthenticated ? (
                        <div className="flex flex-col h-full">
                          <nav className="flex flex-col items-center text-center justify-center gap-6 h-full">
                            {mobileAuthenticatedNavItems.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setVisitorMenuOpen(false)}
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
                            <Button variant="ghost" asChild onClick={() => setVisitorMenuOpen(false)} className='w-full border'>
                              <Link href="/profile">Profile</Link>
                            </Button>
                            <Button variant="ghost" onClick={() => { onLogout(); setVisitorMenuOpen(false); }} className='bg-red-500/20 w-full'>
                              Log Out
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <nav className="flex flex-col items-center text-center gap-8 mt-8">
                            {visitorNavItems.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setVisitorMenuOpen(false)}
                                className={cn(
                                  'text-2xl font-medium transition-colors hover:text-primary',
                                  pathname === item.href ? 'text-primary' : 'text-foreground'
                                )}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </nav>
                          <div className="mt-auto flex flex-col gap-4">
                            <Button variant="outline" size="lg" asChild onClick={() => setVisitorMenuOpen(false)}>
                              <Link href="/login">Log In</Link>
                            </Button>
                            <Button asChild size="lg" onClick={() => setVisitorMenuOpen(false)}>
                              <Link href="/signup">Sign Up</Link>
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
