
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

   useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsAuthChecked(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthChecked) {
      return null; // Or a loading spinner
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
        <main className="flex-1 bg-background">
            {children}
        </main>
        <Footer />
    </div>
  );
}
