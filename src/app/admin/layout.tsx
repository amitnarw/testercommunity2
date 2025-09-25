
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminFooter } from '@/components/admin/admin-footer';

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
    const authStatus = localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsAuthChecked(true);

    if (!authStatus && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  const isLoginPage = pathname === '/admin/login';

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        {/* You can add a loading spinner here */}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-secondary/50">
      {isLoginPage ? (
        <main className="flex-1">{children}</main>
      ) : (
        <div className="flex flex-1">
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
      )}
    </div>
  );
}
