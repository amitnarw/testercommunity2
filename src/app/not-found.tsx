
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { BackgroundBeams } from '@/components/ui/background-beams';

const floatingVariants = {
    initial: (delay: number) => ({
        y: [-15, 15],
        transition: {
            delay,
            duration: 3 + delay, // gives each a slightly different speed
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
        }
    })
};

export default function NotFoundPage() {
  const { setTheme, theme } = useTheme();
  const { data: session } = authClient.useSession();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-center p-4 overflow-hidden">
      <BackgroundBeams />
      <div className="absolute top-4 right-4 z-20">
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

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center text-[45vw] md:text-[20vw] font-black leading-none bg-gradient-to-br from-primary via-accent to-primary/50 bg-clip-text text-transparent perspective-1000">
          <motion.span
            className="inline-block"
            custom={0}
            animate="initial"
            variants={floatingVariants}
          >
            4
          </motion.span>

          <motion.span
            className="inline-block"
            custom={0.5}
            animate="initial"
            variants={floatingVariants}
          >
            0
          </motion.span>

          <motion.span
            className="inline-block"
            custom={0.2}
            animate="initial"
            variants={floatingVariants}
          >
            4
          </motion.span>
        </div>

        <h2 className="mt-8 text-2xl md:text-4xl font-semibold">
          Page Lost in Cyberspace
        </h2>
        <p className="mt-2 text-muted-foreground max-w-sm">
          It seems the page you were looking for has gone on an adventure. Let's get you back on track.
        </p>

        <div className="mt-12 flex gap-4">
          <Button asChild className="rounded-full px-6 py-5 text-base">
            <Link href="/">Go Home</Link>
          </Button>
          {session?.session?.id && (
            <Button asChild variant="outline" className="rounded-full px-6 py-5 text-base">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
