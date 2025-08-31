
'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Sidebar } from '@/components/sidebar';
import { useState, useEffect } from 'react';
import { CommunityNavbar } from '@/components/community-navbar';
import { DashboardFooter } from '@/components/dashboard-footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side after hydration.
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsAuthChecked(true); // Mark that we have checked for authentication.
  }, [pathname]); // Re-check on path change to handle login/logout navigation

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    // No need to manually navigate, the layout will re-render correctly.
  };
  
  const authPages = ['/login', '/signup'];
  const dashboardPages = [
    '/dashboard',
    '/community-dashboard',
    '/profile',
    '/notifications',
  ];

  const isAuthPage = authPages.includes(pathname);
  
  // This value is now reliable because we check `isAuthChecked` before using it.
  const isDashboardPage = isAuthenticated && dashboardPages.some(p => pathname.startsWith(p));

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
          {isAuthChecked ? (
            <div className="relative flex flex-col min-h-screen">
              {isDashboardPage ? (
                <div className="flex flex-1">
                  <Sidebar 
                    onLogout={handleLogout} 
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                  />
                  <div className="flex flex-col flex-1 md:pl-20">
                      <CommunityNavbar 
                        onLogout={handleLogout}
                      />
                      <main className="flex-1">
                        {children}
                      </main>
                      <DashboardFooter />
                  </div>
                </div>
              ) : (
                <>
                  {!isAuthPage && (
                    <Header 
                      isAuthenticated={isAuthenticated}
                      isDashboardPage={false}
                      isMobileMenuOpen={isMobileMenuOpen} 
                      setMobileMenuOpen={setIsMobileMenuOpen}
                      isSidebarCollapsed={isSidebarCollapsed}
                      setSidebarCollapsed={setIsSidebarCollapsed}
                      onLogout={handleLogout}
                    />
                  )}
                  <div className="relative z-[1] bg-background pb-10">
                    <main className="flex-1">
                        {children}
                    </main>
                  </div>
                  {!isAuthPage && <Footer />}
                </>
              )}
            </div>
          ) : (
             <div className="relative flex flex-col min-h-screen">
                {/* Render nothing or a loading spinner while checking auth to prevent flash */}
             </div>
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
