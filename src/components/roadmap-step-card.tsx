
'use client'

import type { RoadmapStep } from '@/lib/types';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';

interface RoadmapStepCardProps {
    step: RoadmapStep;
    index: number;
}

export function RoadmapStepCard({ step, index }: RoadmapStepCardProps) {
    const { icon: Icon, title, description, time } = step;

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <motion.div className="relative pl-20 md:pl-0" variants={itemVariants}>
            <div className="md:flex items-center">
                {/* Icon Circle on the timeline */}
                <div className="absolute left-8 top-1 h-10 w-10 bg-background border-4 border-primary rounded-full -translate-x-1/2 flex items-center justify-center md:static md:translate-x-0">
                    <Icon className="w-5 h-5 text-primary" />
                </div>

                {/* Card Content */}
                <div className="flex-1 md:ml-8">
                    <div className="p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 border bg-card">
                        <div className="flex justify-between items-start">
                             <h3 className="text-xl font-bold mb-2">{title}</h3>
                             <Badge variant="outline">{time}</Badge>
                        </div>
                        <p className="text-muted-foreground">{description}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

