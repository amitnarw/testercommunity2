
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { SiteLogo } from './icons';
import { Button } from './ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
];

const resourceItems = [
  { name: 'Blog', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Support', href: '/help' },
];

const legalItems = [
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '/terms' },
];

const Sun = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5 }}
    transition={{ duration: 0.5 }}
    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <div className="w-96 h-96 bg-yellow-400 rounded-full blur-[100px]" />
  </motion.div>
);

const MoonAndStars = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5 }}
    transition={{ duration: 0.5 }}
    className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full"
  >
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-24 h-24 bg-slate-200 rounded-full blur-xl" />
    {/* Stars */}
    <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-white rounded-full animate-pulse" />
    <div className="absolute top-[50%] left-[20%] w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:0.5s]" />
    <div className="absolute top-[30%] left-[80%] w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:1s]" />
    <div className="absolute top-[60%] left-[70%] w-1.5 h-1.5 bg-white rounded-full animate-pulse [animation-delay:0.2s]" />
    <div className="absolute top-[80%] left-[40%] w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:0.8s]" />
  </motion.div>
);


export function Footer() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end end'],
  });
  const { theme } = useTheme();

  const y = useTransform(scrollYProgress, [0, 1], [-300, 0]);

  return (
    <motion.footer
      ref={container}
      style={{ y }}
      className="bg-secondary/50 relative z-10 overflow-hidden"
    >
        {theme === 'dark' ? <MoonAndStars /> : <Sun />}
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-20">
            <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4">
                <Link href="/" className="items-center gap-2 hidden sm:flex">
                <SiteLogo />
                </Link>
                <p className="text-muted-foreground">
                The future of app testing is animated.
                </p>
                <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#">
                    <Twitter className="h-5 w-5" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#">
                    <Github className="h-5 w-5" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#">
                    <Linkedin className="h-5 w-5" />
                    </Link>
                </Button>
                <Link href="#" className="inline-block">
                    <Image
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    width={135}
                    height={40}
                    alt="Google Play Store"
                    />
                </Link>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-2">
                <div className="space-y-4">
                <h4 className="font-semibold">Platform</h4>
                <ul className="space-y-2">
                    {navItems.map((item) => (
                    <li key={item.name}>
                        <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-primary transition-colors sliding-text-hover"
                        data-text={item.name}
                        >
                        <span>{item.name}</span>
                        </Link>
                    </li>
                    ))}
                </ul>
                </div>
                <div className="space-y-4">
                <h4 className="font-semibold">Resources</h4>
                <ul className="space-y-2">
                    {resourceItems.map((item) => (
                    <li key={item.name}>
                        <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-primary transition-colors sliding-text-hover"
                        data-text={item.name}
                        >
                        <span>{item.name}</span>
                        </Link>
                    </li>
                    ))}
                </ul>
                </div>
                <div className="space-y-4">
                <h4 className="font-semibold">Legal</h4>
                <ul className="space-y-2">
                    {legalItems.map((item) => (
                    <li key={item.name}>
                        <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-primary transition-colors sliding-text-hover"
                        data-text={item.name}
                        >
                        <span>{item.name}</span>
                        </Link>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            </div>
            <div className="mt-4 pt-8 sm:mb-24 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} inTesters, Inc. All rights reserved.</p>
            <p>A Testing Community at its best.</p>
            </div>
        </div>
        <div
            className="-z-10 absolute bottom-0 flex items-end justify-center w-full overflow-hidden pointer-events-none"
        >
            <p className="font-black text-primary/10 dark:text-secondary/50 text-[80px] sm:text-[200px] lg:text-[300px] -mb-10 sm:-mb-24 lg:-mb-40">
            inTesters
            </p>
        </div>
    </motion.footer>
  );
}
