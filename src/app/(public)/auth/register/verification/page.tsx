
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MailWarning, Loader, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteLogo } from '@/components/icons';
import Link from 'next/link';
import Meteors from '@/components/ui/meteors';

type VerificationStatus = 'verifying' | 'success' | 'error';

function VerificationContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token not found. Please check the link in your email.');
      return;
    }

    const verifyToken = async () => {
      try {
        // Simulate network delay for loading animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = await authClient.verify.email({ token });
        if (response.error) {
            throw new Error(response.error.message);
        }
        setStatus('success');
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.message || 'An unknown error occurred. Please try again.');
      }
    };

    verifyToken();
  }, [searchParams]);

  const statusConfig = {
    verifying: {
      icon: <Loader className="h-16 w-16 text-primary animate-spin" />,
      title: "Verifying Your Email",
      description: "Please wait a moment while we confirm your email address. This shouldn't take long.",
      cta: null,
    },
    success: {
      icon: <CheckCircle className="h-16 w-16 text-green-500" />,
      title: "Verification Successful!",
      description: "Your email has been successfully verified. You can now log in to your account.",
      cta: (
        <Button asChild className="mt-8">
            <Link href="/auth/login">Proceed to Login <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      )
    },
    error: {
      icon: <MailWarning className="h-16 w-16 text-destructive" />,
      title: "Verification Failed",
      description: errorMessage || "We couldn't verify your email. The link may have expired or is invalid.",
       cta: (
        <div className="flex gap-4 mt-8">
            <Button asChild variant="outline">
                <Link href="/auth/register">Re-register</Link>
            </Button>
            <Button asChild >
                <Link href="/help">Contact Support</Link>
            </Button>
        </div>
      )
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <Card className="relative z-10 w-full max-w-md bg-background/60 backdrop-blur-lg border-border/50">
      <CardHeader className="text-center items-center">
         <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-secondary rounded-full mb-4 w-fit"
            >
              {currentStatus.icon}
            </motion.div>
        </AnimatePresence>
        <CardTitle className="text-2xl">{currentStatus.title}</CardTitle>
        <CardDescription>{currentStatus.description}</CardDescription>
      </CardHeader>
      {currentStatus.cta && (
         <CardContent className="flex justify-center">
            {currentStatus.cta}
        </CardContent>
      )}
    </Card>
  );
}


export default function VerificationPage() {
    const { setTheme, theme } = useTheme();
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
             <Meteors />
             <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                    <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
            <div className="absolute top-6 left-6 z-10">
                <Link href="/">
                    <SiteLogo />
                </Link>
            </div>
            <Suspense fallback={<Loader className="h-16 w-16 text-primary animate-spin" />}>
                <VerificationContent />
            </Suspense>
        </div>
    )
}
