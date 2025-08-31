
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { SiteLogo } from './icons';
import { Button } from './ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { useScroll, useTransform, motion } from 'framer-motion';

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

export function Footer() {
  const footerRef = useRef(null);

  // Scroll progress for the entire page
  const { scrollYProgress } = useScroll();

  // Move inTesters from 300px below to 0px as page scrolls to bottom
  const testersY = useTransform(scrollYProgress, [0.85, 1], [300, 0]);

  return (
    <footer
      ref={footerRef}
      className="bg-secondary/50 sticky bottom-0 -z-10 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6 py-20">
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
                     <Link href={item.href} className="sliding-text-hover text-muted-foreground hover:text-primary transition-colors relative z-10 block" data-text={item.name}>
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
                     <Link href={item.href} className="sliding-text-hover text-muted-foreground hover:text-primary transition-colors relative z-10 block" data-text={item.name}>
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
                     <Link href={item.href} className="sliding-text-hover text-muted-foreground hover:text-primary transition-colors relative z-10 block" data-text={item.name}>
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

      {/* Only "inTesters" animates up as you scroll to the bottom */}
      <motion.div
        style={{ y: testersY }}
        className="-z-10 absolute bottom-0 flex items-end justify-center w-full overflow-hidden pointer-events-none"
      >
        <p className="font-black text-primary/10 dark:text-secondary/50 text-[80px] sm:text-[200px] lg:text-[300px] -mb-10 sm:-mb-24 lg:-mb-40">
          inTesters
        </p>
      </motion.div>
    </footer>
  );
}
