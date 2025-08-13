
'use client';

import { SignupForm } from '@/components/signup-form';
import { TestTribeLogo } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { Moon, Sun, ArrowLeft } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.307-11.28-7.792l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.626,44,31.1,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

const LoginForm = () => {
    return (
        <div className="space-y-6">
             <Button variant="outline" className="w-full rounded-xl py-6 text-base">
                <GoogleIcon className="mr-3" />
                Log in with Google
            </Button>
            <div className="flex items-center gap-4">
                <Separator className="flex-1 bg-border/50" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1 bg-border/50" />
            </div>
             <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="you@example.com" className="flex h-10 w-full rounded-none border-b border-input bg-transparent px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
            </div>
            <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="••••••••" className="flex h-10 w-full rounded-none border-b border-input bg-transparent px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
            </div>
            <Button className="w-full rounded-xl py-6 text-lg">Log In</Button>
        </div>
    )
}


export default function LoginPage() {
    const { setTheme, theme } = useTheme();

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 relative">
        <div className="absolute top-4 right-4 flex items-center gap-4">
             <Button variant="ghost" asChild>
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Go to Home</Link>
            </Button>
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
        <div className="w-full flex flex-col items-center justify-center p-6 bg-background">
            <div className="max-w-md w-full space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Log in to your account
                </h2>
                <p className="text-muted-foreground mt-2">
                    Or <Link href="/signup" className="text-primary hover:underline">create a new account</Link>
                </p>
            </div>
            <LoginForm />
            </div>
        </div>
        <div className="hidden bg-muted lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
                <TestTribeLogo className="h-20 w-auto mb-4" />
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
                <p className="mt-2 max-w-md mx-auto text-muted-foreground">
                    Log in to continue your journey of building flawless apps.
                </p>
            </div>
        </div>
    </div>
  );
}
