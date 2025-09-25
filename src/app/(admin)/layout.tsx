
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminFooter } from '@/components/admin/admin-footer';
import { SiteLogo } from '@/components/icons';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  useEffect(() => {
    // In a real app, this would be a call to an auth service
    const authStatus = document.cookie.includes('isAdminAuthenticated=true');
    setIsAuthenticated(authStatus);
    setIsAuthChecked(true);

    if (!authStatus && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    document.cookie = 'isAdminAuthenticated=false; path=/; max-age=0';
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  const isLoginPage = pathname === '/admin/login';

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SiteLogo className="h-20 w-auto animate-pulse" />
      </div>
    );
  }

  if (isLoginPage) {
    return <main className="flex-1 bg-background">{children}</main>;
  }
  
  if (!isAuthenticated) {
      return null;
  }
  
  return (
    <div className="relative flex min-h-screen bg-secondary/50">
        <AdminSidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
        />
        <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>
            <AdminHeader onLogout={handleLogout} />
            <main className="flex-1">
                {children}
            </main>
            <AdminFooter />
        </div>
    </div>
  );
}
