
'use client';

import { useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
}

export function MagneticButton({ children, className }: MagneticButtonProps) {
    const magneticRef = useRef<HTMLDivElement>(null);
    const { contextSafe } = useGSAP({ scope: magneticRef });

    const onMouseMove = contextSafe((e: MouseEvent) => {
        if (!magneticRef.current) return;
        
        const parent = magneticRef.current.parentElement;
        if (!parent) return;

        const { clientX, clientY } = e;
        const { height, width, left, top } = parent.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        
        gsap.to(magneticRef.current, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
        });
    });

    const onMouseLeave = contextSafe(() => {
        gsap.to(magneticRef.current, {
            x: 0,
            y: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.5)',
        });
    });
    
    useGSAP(() => {
        const parent = magneticRef.current?.parentElement;
        if (parent) {
            parent.addEventListener('mousemove', onMouseMove);
            parent.addEventListener('mouseleave', onMouseLeave);

            return () => {
                parent.removeEventListener('mousemove', onMouseMove);
                parent.removeEventListener('mouseleave', onMouseLeave);
            };
        }
    }, [onMouseMove, onMouseLeave]);


    return (
        <div ref={magneticRef} className={className}>
            {children}
        </div>
    );
}
