
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
    href?: string;
    className?: string;
}

export function BackButton({ href, className }: BackButtonProps) {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!href) {
            e.preventDefault();
            router.back();
        }
    };

    const commonProps = {
        variant: "outline" as const,
        className: cn("rounded-full", className),
    };

    const content = (
        <>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </>
    );

    if (href) {
        return (
            <Button {...commonProps} asChild>
                <Link href={href}>{content}</Link>
            </Button>
        );
    }

    return (
        <Button {...commonProps} onClick={handleClick}>
            {content}
        </Button>
    );
}
