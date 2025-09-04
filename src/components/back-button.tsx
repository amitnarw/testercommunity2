
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
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
        className: cn("rounded-full px-5 group pl-12 border-0 shadow-lg shadow-[hsl(var(--primary))]/10 hover:bg-white hover:dark:bg-secondary hover:text-[hsl(var(--primary))]", className),
    };

    const content = (
        <div className='flex items-center justify-center absolute -left-1 rounded-full duration-300 group-hover:bg-[hsl(var(--primary))] p-5 group-hover:scale-[1.3]'>
            <ChevronLeft className="absolute group-hover:text-white scale-[1.2] left-5" />
        </div>
    );

    if (href) {
        return (
            <Button {...commonProps} asChild>
                <Link href={href}>{content}Back</Link>
            </Button>
        );
    }

    return (
        <Button {...commonProps} onClick={handleClick}>
            {content}
        </Button>
    );
}
