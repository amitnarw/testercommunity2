
'use client';

import Link from 'next/link';
import { SiteLogo } from './icons';
import { Button } from './ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';

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
    return (
        <footer className="bg-secondary/50">
            <div className="container mx-auto px-4 md:px-6 py-20">
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <SiteLogo />
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
                <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} inTesters, Inc. All rights reserved.</p>
                    <p>A Next-Gen App Testing Community.</p>
                </div>
            </div>
            <div className='absolute bottom-0 flex items-end justify-center w-full overflow-hidden -z-10'>
                <p className='font-black text-primary/10 dark:text-secondary/50 text-[80px] sm:text-[200px] lg:text-[300px] -mb-10 sm:-mb-32 lg:-mb-40'>inTesters</p>
            </div>
        </footer>
    );
}
