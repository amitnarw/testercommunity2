
"use client";

import { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteLogo } from '@/components/icons';
import Link from 'next/link';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { cn } from '@/lib/utils';
import LoadingIcon from '@/components/loadingIcon';

function CheckEmailContent() {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="check-email"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md z-10"
            >
                <Card className="relative z-10 w-full bg-white/10 dark:bg-black/10 backdrop-blur-2xl shadow-2xl shadow-primary/10 dark:shadow-black/20 border border-white/10 dark:border-black/20 rounded-2xl">
                    <CardHeader className="text-center items-center p-8">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
                        >
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/50 to-accent flex items-center justify-center">
                                    <MailCheck className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </motion.div>
                        <CardTitle className="text-2xl mt-4">Check Your Email</CardTitle>
                        <CardDescription>We've sent a verification link to your email address. Please click the link to complete your registration.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center p-8 pt-0">
                         <Button asChild className="mt-2">
                            <Link href="/auth/login">Back to Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    )
}

export default function CheckEmailPage() {
    const { setTheme, theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000); 
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-6 bg-background">
            <InteractiveGridPattern
                className={cn(
                    "absolute inset-0 h-full w-full",
                    "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
                    "transform -skew-y-12 scale-150"
                )}
                width={30}
                height={30}
                squares={[30, 30]}
                squaresClassName="hover:fill-primary/10"
            />
            <div className="absolute top-4 right-4 flex items-center gap-4 z-20">
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
            <div className="absolute top-6 left-6 z-20">
                <Link href="/">
                    <SiteLogo />
                </Link>
            </div>
            <Suspense fallback={<LoadingIcon />}>
                {isLoading ? <LoadingIcon /> : <CheckEmailContent />}
            </Suspense>
        </div>
    )
}
