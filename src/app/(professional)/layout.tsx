
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  
  const handleLogout = () => {
    // Simulate logout
    document.cookie = 'isAuthenticated=false; path=/; max-age=0';
    document.cookie = 'isProfessionalAuthenticated=false; path=/; max-age=0';
    router.push('/');
  };

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
