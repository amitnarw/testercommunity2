
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const blobs = [
    {
        color: 'bg-[#ebedff]',
        initial: { x: '0%', y: '0%', rotate: 0, scale: 1 },
        animate: { x: ['0%', '50%', '0%'], y: ['0%', '-50%', '0%'], rotate: [0, 180, 0], scale: [1, 1.2, 1] },
        transition: { duration: 20, repeat: Infinity, ease: 'easeInOut' }
    },
    {
        color: 'bg-[#f3f2f8]',
        initial: { x: '50%', y: '50%', rotate: 0, scale: 1.2 },
        animate: { x: ['50%', '0%', '50%'], y: ['50%', '100%', '50%'], rotate: [0, -180, 0], scale: [1.2, 1, 1.2] },
        transition: { duration: 25, repeat: Infinity, ease: 'easeInOut' }
    },
    {
        color: 'bg-[#dbf8ff]',
        initial: { x: '-20%', y: '80%', rotate: 0, scale: 1.1 },
        animate: { x: ['-20%', '70%', '-20%'], y: ['80%', '20%', '80%'], rotate: [0, 180, 0], scale: [1.1, 1.3, 1.1] },
        transition: { duration: 30, repeat: Infinity, ease: 'easeInOut' }
    }
];

export function AnimatedGradient() {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-background">
            <div className="relative w-full h-full">
                <div className="absolute inset-0 w-full h-full filter blur-3xl opacity-50 dark:opacity-30">
                    {blobs.map((blob, i) => (
                        <motion.div
                            key={i}
                            className={cn('absolute w-96 h-96 rounded-full', blob.color)}
                            initial={blob.initial}
                            animate={blob.animate}
                            transition={blob.transition}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
