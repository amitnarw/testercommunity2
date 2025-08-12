
'use client'

import type { RoadmapStep } from '@/lib/types';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface RoadmapStepCardProps {
    step: RoadmapStep;
    index: number;
}

export function RoadmapStepCard({ step, index }: RoadmapStepCardProps) {
    const { icon: Icon, title, description, time } = step;
    const isEven = index % 2 === 0;

    const itemVariants = {
        hidden: { opacity: 0, x: isEven ? -100 : 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    };

    return (
        <motion.div 
            className="relative"
            variants={itemVariants}
        >
            <div className={cn(
                "md:flex items-center w-full",
                isEven ? "md:flex-row-reverse" : "md:flex-row"
            )}>
                 {/* Icon on the timeline */}
                <div className="md:w-1/2 flex justify-center">
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 h-16 w-16 bg-background border-4 border-primary rounded-full -translate-x-1/2 flex items-center justify-center md:static md:translate-x-0">
                        <Icon className="w-8 h-8 text-primary" />
                    </div>
                </div>

                {/* Card Content */}
                <div className="w-full md:w-1/2 pl-24 md:pl-0">
                     <div className={cn(
                        "p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 border bg-card",
                        isEven ? "md:mr-8" : "md:ml-8"
                    )}>
                        <div className="flex justify-between items-start mb-2">
                             <h3 className="text-xl font-bold">{title}</h3>
                             <Badge variant="outline">{time}</Badge>
                        </div>
                        <p className="text-muted-foreground">{description}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
