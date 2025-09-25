
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

    if (!authStatus) {
      router.replace('/login');
    }
  }, [pathname, router]);
  
  const handleLogout = () => {
    // Simulate logout
    document.cookie = 'isAuthenticated=false; path=/; max-age=0';
    document.cookie = 'isProfessionalAuthenticated=false; path=/; max-age=0';
    router.push('/login');
  };

  if (!isAuthChecked || !isAuthenticated) {
    return null; // Or a loading spinner
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
