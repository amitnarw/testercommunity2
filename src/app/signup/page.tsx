
'use client';

import { SignupForm } from '@/components/signup-form';
import { TestTribeLogo } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
    const { setTheme, theme } = useTheme();

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden bg-muted lg:flex flex-col items-center justify-start pt-24 p-6 text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
            <TestTribeLogo className="h-20 w-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Join a community of innovators</h1>
            <p className="mt-2 max-w-md mx-auto text-muted-foreground">
                Whether you're here to test, or have your app tested, you're in the right place.
            </p>
        </div>
      </div>
      <div className="relative w-full flex flex-col items-center justify-start lg:justify-center p-6 bg-background">
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
        <div className="max-w-md w-full space-y-6 pt-16 lg:pt-0">
           <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="text-muted-foreground mt-2">
                Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
