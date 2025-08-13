
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const GRID_SIZE = 20;
const BUG_LIFESPAN = 5000;
const BUG_CHANCE = 0.05;
const SCANNER_DURATION = 4;

const DotGrid = () => (
    <div className="absolute inset-0 w-full h-full z-0 grid-cols-20 grid-rows-20">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <motion.div 
                key={i}
                className="w-px h-px bg-primary/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: Math.random() * 0.5 }}
            />
        ))}
    </div>
);

interface Bug {
    id: number;
    x: number;
    y: number;
    createdAt: number;
}

const Bug = ({ bug }: { bug: Bug }) => (
    <motion.div
        layoutId={`bug-${bug.id}`}
        className="absolute w-2 h-2 bg-destructive/80 rounded-sm"
        style={{ left: `${bug.x}%`, top: `${bug.y}%`, transform: 'translate(-50%, -50%)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, scale: 0, transition: { duration: 0.5 } }}
    >
        <motion.div 
            className="w-full h-full bg-destructive"
            animate={{ scale: [1, 0.8, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
        />
    </motion.div>
);

const Scanner = ({ onComplete }: { onComplete: () => void }) => {
    const isHorizontal = Math.random() > 0.5;
    return (
        <motion.div
            className={cn("absolute bg-primary/30 z-10", isHorizontal ? "w-full h-px" : "h-full w-px")}
            initial={isHorizontal ? { top: '-5%', left: '0' } : { left: '-5%', top: '0' }}
            animate={isHorizontal ? { top: '105%' } : { left: '105%' }}
            transition={{ duration: SCANNER_DURATION, ease: 'linear' }}
            onAnimationComplete={onComplete}
        />
    );
};


export const BugSquashAnimation = () => {
    const [bugs, setBugs] = useState<Bug[]>([]);
    const [scanners, setScanners] = useState<number[]>([1]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() < BUG_CHANCE && bugs.length < 10) {
                setBugs(prev => [
                    ...prev,
                    {
                        id: Date.now() + Math.random(),
                        x: Math.random() * 90 + 5,
                        y: Math.random() * 90 + 5,
                        createdAt: Date.now()
                    }
                ]);
            }

            // Cull old bugs
            setBugs(prev => prev.filter(bug => Date.now() - bug.createdAt < BUG_LIFESPAN));

        }, 500);

        return () => clearInterval(interval);
    }, [bugs.length]);
    
    const handleScannerComplete = (id: number) => {
        setBugs([]); // Clear all bugs
        setScanners(prev => prev.filter(sId => sId !== id)); // Remove this scanner
        setTimeout(() => setScanners(prev => [...prev, Date.now()]), 1000); // Add a new one after a delay
    };

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-dot-pattern-dark">
            <div className="relative w-full h-full">
                {scanners.map((id) => <Scanner key={id} onComplete={() => handleScannerComplete(id)} />)}
                {bugs.map((bug) => <Bug key={bug.id} bug={bug} />)}
            </div>
        </div>
    );
};
