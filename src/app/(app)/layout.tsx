
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { CommunityNavbar } from '@/components/community-navbar';
import { DashboardFooter } from '@/components/dashboard-footer';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsAuthChecked(true);
    if (!authStatus) {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (!isAuthChecked || !isAuthenticated) {
    return null; // Or a loading spinner
  }
  
  return (
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
  );
}
