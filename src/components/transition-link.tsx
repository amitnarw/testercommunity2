'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useTransitionContext } from '@/context/transition-context';
import { useRouter } from 'next/navigation';

interface TransitionLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
}

export function TransitionLink({ children, href, ...props }: TransitionLinkProps) {
    const { triggerTransition } = useTransitionContext();
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        triggerTransition(href.toString());
    };

    return (
        <Link href={href} {...props} onClick={handleClick}>
            {children}
        </Link>
    );
}
