
'use client';

import { usePathname } from 'next/navigation';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { DashboardFooter } from '@/components/dashboard-footer';
import { Sidebar } from '@/components/sidebar';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// This is a client component, so we can't use metadata here.
// We'll manage the title in the individual page components.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isDashboardPage = pathname.startsWith('/dashboard') || pathname.startsWith('/community-dashboard') || pathname.startsWith('/profile');

  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
         <title>inTesters | App Testing Community Platform</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen">
            {isDashboardPage && (
              <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                setCollapsed={setIsSidebarCollapsed}
                isMobileOpen={isMobileMenuOpen}
                setMobileOpen={setIsMobileMenuOpen}
              />
            )}
             {isDashboardPage && isMobileMenuOpen && (
                <div 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                ></div>
            )}
            <div className={cn(
              "transition-[margin-left] ease-in-out duration-300",
              isDashboardPage && (isSidebarCollapsed ? "md:ml-20" : "md:ml-64")
            )}>
              {!isAuthPage && <Header isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setIsMobileMenuOpen} />}
              <main className="flex-1">{children}</main>
              {!isAuthPage && (
                isDashboardPage ? <DashboardFooter /> : <Footer />
              )}
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
