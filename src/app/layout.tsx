
'use client';

import { usePathname } from 'next/navigation';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check localStorage only on the client side
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, [pathname]); // Re-check on path change

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  // Show special sidebar only for community dashboard pages
  const isCommunityDashboard = isAuthenticated && pathname.startsWith('/community-dashboard');

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
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen">
            {isCommunityDashboard ? (
               <Sidebar 
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
                onLogout={handleLogout} 
               />
            ) : (
              !isAuthPage && <Header 
                isAuthenticated={isAuthenticated}
                isDashboardPage={false}
                isMobileMenuOpen={isMobileMenuOpen} 
                setMobileMenuOpen={setIsMobileMenuOpen}
                isSidebarCollapsed={isSidebarCollapsed}
                setSidebarCollapsed={setIsSidebarCollapsed}
                onLogout={handleLogout}
              />
            )}
            
            <div className={cn(
              "flex flex-col flex-1 transition-all duration-300",
              isCommunityDashboard && !isAuthPage && (isSidebarCollapsed ? "md:pl-24" : "md:pl-64"),
            )}>
              <div className={cn("relative flex-1", !isCommunityDashboard ? 'z-20 bg-background' : 'z-0' )}>
                <main className="flex-1">
                  {children}
                </main>
              </div>
              {!isAuthPage && !isCommunityDashboard && (
                 <Footer />
              )}
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
