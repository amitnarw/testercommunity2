
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MailWarning, Loader, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteLogo } from '@/components/icons';
import Link from 'next/link';
import Meteors from '@/components/ui/meteors';
import { cn } from '@/lib/utils';

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

    // This will run after the initial 5-second loading animation
    const timer = setTimeout(verifyToken, 10);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const statusConfig = {
    verifying: {
      icon: (
        <div className="relative w-16 h-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/50 to-accent"
          />
          <div className="absolute inset-1 bg-background rounded-full flex items-center justify-center">
            <MailWarning className="h-8 w-8 text-primary" />
          </div>
        </div>
      ),
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
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Card className="relative z-10 w-full bg-background/30 backdrop-blur-xl border border-white/10 shadow-2xl shadow-primary/10 rounded-2xl">
          <CardHeader className="text-center items-center p-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
            >
              {currentStatus.icon}
            </motion.div>
            <CardTitle className="text-2xl mt-4">{currentStatus.title}</CardTitle>
            <CardDescription>{currentStatus.description}</CardDescription>
          </CardHeader>
          {currentStatus.cta && (
            <CardContent className="flex justify-center p-8 pt-0">
                {currentStatus.cta}
            </CardContent>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

function InitialLoader() {
    return (
         <div className="flex flex-col items-center justify-center w-full h-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'backOut' }}
            >
                <SiteLogo className="h-24 w-24 animate-pulse" />
            </motion.div>
        </div>
    )
}

export default function VerificationPage() {
    const { setTheme, theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

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
            <Suspense fallback={<InitialLoader />}>
                {isLoading ? <InitialLoader /> : <VerificationContent />}
            </Suspense>
        </div>
    )
}
