

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/authenticated/navbar';
import Footer from '@/components/authenticated/footer';
import { Sidebar } from '@/components/authenticated/sidebar';
import { SiteLogo } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';


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
    document.cookie = 'userRole=; path=/; max-age=0';
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
    <div className="relative flex min-h-screen">
      <Sidebar
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        <div className={`flex flex-col flex-1 transition-all duration-300 md:pl-20`}>
            <Navbar onLogout={handleLogout} />
            <AnimatePresence mode="wait">
              <motion.main
                  key={pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-1 bg-secondary/50"
              >
                  {children}
              </motion.main>
            </AnimatePresence>
            <Footer />
        </div>
    </div>
  );
}
