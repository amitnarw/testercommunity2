
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { InTestersLogoShortHeader } from './icons';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetClose, SheetTrigger } from './ui/sheet';
import { Menu, ArrowRight, Sun, Moon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { UserNav } from './user-nav';


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

interface HeaderProps {
  isAuthenticated: boolean;
  isDashboardPage: boolean;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

export function Header({
  isAuthenticated,
  isDashboardPage,
  isMobileMenuOpen,
  setMobileMenuOpen,
  isSidebarCollapsed,
  setSidebarCollapsed,
  onLogout
}: HeaderProps) {
  const pathname = usePathname();
  const [isVisitorMenuOpen, setVisitorMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = isAuthenticated ? authenticatedNavItems : visitorNavItems;

  return (
    <header className="sticky top-4 z-50 w-[95vw] mx-auto">
      <div className="bg-transparent backdrop-blur-lg rounded-full border border-black/5 dark:border-white/5 shadow-inner shadow-black/5 dark:shadow-white/5 transition-all duration-300">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Link href="/">
                  <InTestersLogoShortHeader className="h-10 w-10" />
                </Link>
            </div>

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
                              <UserNav onLogout={onLogout} />
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
