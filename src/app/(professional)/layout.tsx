
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '@/components/authenticated/navbar';
import Footer from '@/components/authenticated/footer';
import { Sidebar } from '@/components/authenticated/sidebar';

export default function ProfessionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be a call to an auth service
    const authStatus = document.cookie.includes('isProfessionalAuthenticated=true');
    setIsAuthenticated(authStatus);
    setIsAuthChecked(true);

    if (!authStatus && pathname !== '/tester/login' && pathname !== '/tester/register') {
      router.replace('/tester/login');
    }
     if (authStatus && (pathname === '/tester/login' || pathname === '/tester/register')) {
      router.replace('/professional/tester/dashboard');
    }
  }, [pathname, router]);
  
  const handleLogout = () => {
    document.cookie = 'isProfessionalAuthenticated=false; path=/; max-age=0';
    setIsAuthenticated(false);
    router.push('/tester/login');
  };

  const isAuthPage = pathname === '/tester/login' || pathname === '/tester/register';

  if (!isAuthChecked) {
    return null; // Or a loading spinner
  }

  if (isAuthPage) {
    return <main className="flex-1 bg-background">{children}</main>;
  }
  
  if (!isAuthenticated) {
      return null;
  }

  return (
    <div className="relative flex min-h-screen">
        <Sidebar
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        <div className={`flex flex-col flex-1 transition-all duration-300 md:pl-20`}>
          <Navbar onLogout={handleLogout} />
          <main className="flex-1 bg-secondary/50">
            {children}
          </main>
          <Footer />
        </div>
    </div>
  );
}
