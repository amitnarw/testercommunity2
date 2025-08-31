
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

export function AnimatedLink({ href, children, className, activeClassName }: AnimatedLinkProps) {
  const pathname = usePathname();
  const isActive = (pathname.startsWith(href) && href !== '/') || (pathname === '/' && href === '/');

  return (
    <Link href={href} className={cn(
        "group transition-colors relative block overflow-hidden text-sm sm:text-[16px]",
        isActive ? cn('text-primary', activeClassName) : 'text-muted-foreground hover:text-primary',
        className
    )}>
        <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">{children}</span>
        <span className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0">{children}</span>
    </Link>
  );
}
