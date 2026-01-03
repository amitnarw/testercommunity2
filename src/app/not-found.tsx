
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { BackgroundBeams } from '@/components/ui/background-beams';

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
        <div className="flex items-center justify-center text-[45vw] md:text-[20vw] font-black text-primary">
          <motion.span
            className="inline-block"
            animate={{
              y: [0, -20, 0],
              rotateX: [0, 15, 0],
              rotateY: [0, -10, 0],
              z: [0, 30, 0]
            }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            4
          </motion.span>

          <motion.span
            className="inline-block"
            animate={{
              y: [0, 15, 0],
              rotateX: [0, -12, 0],
              rotateY: [0, 8, 0],
              z: [0, -25, 0]
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.3
            }}
          >
            0
          </motion.span>

          <motion.span
            className="inline-block"
            animate={{
              y: [0, -18, 0],
              rotateX: [0, 10, 0],
              rotateY: [0, -12, 0],
              z: [0, 20, 0]
            }}
            transition={{
              duration: 7,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.6
            }}
          >
            4
          </motion.span>
        </div>

        <p className="mt-2 text-muted-foreground max-w-sm">
          It seems the page you were looking for has gone on an adventure. Let's get you back on track.
        </p>

        <div className="mt-12 flex gap-4">
          <Button asChild className="rounded-full px-6 py-5 text-base bg-gradient-to-br from-primary to-primary/20">
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
