import Link from 'next/link';
import { TestTribeLogo } from './icons';
import { Button } from './ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Blog', href: '/blog' },
  { name: 'Sign Up', href: '/signup' },
];

const resourceItems = [
  { name: 'Docs', href: '#' },
  { name: 'Blog', href: '/blog' },
  { name: 'Support', href: '#' },
];

const legalItems = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-transparent border-t relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <TestTribeLogo className="h-8" />
            </Link>
            <p className="text-muted-foreground">The future of app testing is animated.</p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Twitter className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Github className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="#"><Linkedin className="h-5 w-5" /></Link>
              </Button>
              <Link href="#" className="inline-block">
                <Image src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" width={135} height={40} alt="Google Play Store" data-ai-hint="google play" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-2">
            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <ul className="space-y-2">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors sliding-text-hover" data-text={item.name}>
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
                    <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors sliding-text-hover" data-text={item.name}>
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
                    <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors sliding-text-hover" data-text={item.name}>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TestTribe, Inc. All rights reserved.</p>
          <p>A Next-Gen App Testing Community.</p>
        </div>
      </div>
    </footer>
  );
}
