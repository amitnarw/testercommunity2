
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsAuthChecked(true);

    if (authStatus) {
      router.replace('/dashboard');
    }
  }, [router]);

  if (!isAuthChecked || isAuthenticated) {
    return null; // Or a loading spinner
  }

  return <main className="flex-1 bg-background">{children}</main>;
}
