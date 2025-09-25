'use client';

import { useState, useEffect } from 'react';
// import { Header } from '@/components/header';
import Navbar from '@/components/authenticated/navbar';
// import { Footer } from '@/components/footer';
import Footer from '@/components/authenticated/footer';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/authenticated/sidebar';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // In a real app, this would be a call to an auth service
    const authStatus = document.cookie.includes('isAuthenticated=true');
    setIsAuthChecked(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
  };

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (!isAuthChecked) {
    return null; // Or a loading spinner
  }

  if (isAuthPage) {
    return <main className="flex-1 bg-background">{children}</main>;
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        <div className="flex flex-col flex-1 md:pl-20">
          <Navbar onLogout={handleLogout} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}