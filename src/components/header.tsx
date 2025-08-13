
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TestTribeLogo } from './icons';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from './ui/sheet';
import { Menu, ArrowRight, Sun, Moon, Twitter, Github, Linkedin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Blog', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-lg border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TestTribeLogo className="h-8" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
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
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
               <div className="md:hidden relative">
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
              </div>
              <SheetContent side="top" className="flex flex-col">
                 <div className="absolute top-4 right-4 md:hidden">
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
                        {navItems.map((item, index) => (
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
                        <Button variant="outline" size="lg" asChild onClick={() => setMenuOpen(false)}>
                            <Link href="/login">Log In</Link>
                        </Button>
                        <Button asChild size="lg" onClick={() => setMenuOpen(false)}>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="mx-auto"
                          onClick={() => {
                            setTheme(theme === 'dark' ? 'light' : 'dark');
                          }}
                        >
                          <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                          <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                </div>
                 <div className="absolute bottom-8 left-8 flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Twitter className="h-5 w-5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Github className="h-5 w-5" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Linkedin className="h-5 w-5" /></Link>
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
