
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/authenticated/navbar';
import Footer from '@/components/authenticated/footer';
import { Sidebar } from '@/components/authenticated/sidebar';

// Mock authentication
const useMockAuth = () => {
    const router = useRouter();
    // In a real app, this would involve context or a hook to check auth status
    const isAuthenticated = true; 

    // A simple redirect if not authenticated, for demonstration
    // React.useEffect(() => {
    //     if (!isAuthenticated) {
    //         router.push('/professional/login'); // Assuming a dedicated login for pros
    //     }
    // }, [isAuthenticated, router]);

    const handleLogout = () => {
        // Simulate logout
        router.push('/'); // Redirect to homepage after logout
    };

    return { isAuthenticated, handleLogout };
}

export default function ProfessionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { isAuthenticated, handleLogout } = useMockAuth();

  if (!isAuthenticated) {
    // You can return a loader here while checking auth
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
