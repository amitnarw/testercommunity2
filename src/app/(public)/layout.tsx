
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { usePathname } from 'next/navigation';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const pathname = usePathname();

   useEffect(() => {
    // In a real app, this would be a call to an auth service
    const authStatus = document.cookie.includes('isAuthenticated=true');
    setIsAuthenticated(authStatus);
    setIsAuthChecked(true);
  }, []);

  const handleLogout = () => {
    document.cookie = 'isAuthenticated=false; path=/; max-age=0';
    setIsAuthenticated(false);
  };

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth/register/profile-setup' || pathname === '/auth/register/verification';

  if (!isAuthChecked) {
      return null; // Or a loading spinner
  }

  if (isAuthPage) {
    return <main className="flex-1 bg-background">{children}</main>;
  }

  return (
    <div className="relative flex flex-col min-h-screen">
        <Header 
            isAuthenticated={isAuthenticated}
            isDashboardPage={false}
            isMobileMenuOpen={isMobileMenuOpen} 
            setMobileMenuOpen={setIsMobileMenuOpen}
            isSidebarCollapsed={true}
            setSidebarCollapsed={() => {}}
            onLogout={handleLogout}
        />
        <main className="flex-1 bg-background z-10">
            {children}
        </main>
        <Footer />
    </div>
  );
}
