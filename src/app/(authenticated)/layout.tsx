
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/authenticated/navbar';
import Footer from '@/components/authenticated/footer';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/authenticated/sidebar';

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // In a real app, this would be a call to an auth service
    const authStatus = document.cookie.includes('isAuthenticated=true');
    setIsAuthChecked(true);
    if (!authStatus) {
        router.replace('/auth/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    document.cookie = 'isAuthenticated=false; path=/; max-age=0';
    router.push('/auth/login');
  };

  if (!isAuthChecked) {
    return null; // Or a loading spinner
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
          <main className="flex-1 bg-secondary/50">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
