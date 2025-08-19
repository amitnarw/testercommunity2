
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
import { useState, useEffect } from 'react';


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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check localStorage only on the client side
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, [pathname]); // Re-check on path change

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isDashboardPage = isAuthenticated && (pathname.startsWith('/dashboard') || pathname.startsWith('/community-dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/notifications'));

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    // Optionally redirect to home or login page
  };
  
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
                isMobileOpen={isMobileMenuOpen}
                setMobileOpen={setIsMobileMenuOpen}
                onLogout={handleLogout}
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
              isDashboardPage && !isAuthPage && (isSidebarCollapsed ? "md:ml-20" : "md:ml-64")
            )}>
              <Header 
                isAuthenticated={isAuthenticated}
                isDashboardPage={isDashboardPage} 
                isMobileMenuOpen={isMobileMenuOpen} 
                setMobileMenuOpen={setIsMobileMenuOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setSidebarCollapsed={setIsSidebarCollapsed}
                onLogout={handleLogout}
              />
              <main className="flex-1">
                {children}
              </main>
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
