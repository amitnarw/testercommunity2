import Link from 'next/link';
import { AnimateTestLogo } from './icons';
import { Button } from './ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Sign Up', href: '/signup' },
];

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <AnimateTestLogo className="h-8 w-8 text-primary" />
              <span className="font-headline text-xl font-bold">AnimateTest</span>
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
                <Image src="https://placehold.co/135x40.png" width={135} height={40} alt="Google Play Store" data-ai-hint="google play" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-2">
            <div className="space-y-4">
              <h4 className="font-headline font-semibold">Platform</h4>
              <ul className="space-y-2">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">{item.name}</Link>
                    </li>
                ))}
              </ul>
            </div>
             <div className="space-y-4">
              <h4 className="font-headline font-semibold">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Docs</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Support</Link></li>
              </ul>
            </div>
             <div className="space-y-4">
              <h4 className="font-headline font-semibold">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AnimateTest, Inc. All rights reserved.</p>
          <p>A Next-Gen App Testing Community.</p>
        </div>
      </div>
    </footer>
  );
}
