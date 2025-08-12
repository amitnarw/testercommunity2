
'use client'

import { RoadmapStepCard } from './roadmap-step-card';
import type { RoadmapStep } from '@/lib/types';
import { motion } from 'framer-motion';

interface RoadmapPathProps {
    steps: RoadmapStep[];
}

export function RoadmapPath({ steps }: RoadmapPathProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto py-12">
            {/* The vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 h-full w-1 bg-border -translate-x-1/2"></div>
            
            <motion.div
                className="space-y-16"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {steps.map((step, index) => (
                    <RoadmapStepCard key={index} step={step} index={index} />
                ))}
            </motion.div>
        </div>
    );
}
