
'use client'

import type { RoadmapStep } from '@/lib/types';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

interface RoadmapStepProps {
    step: RoadmapStep;
    index: number;
}

export function RoadmapStep({ step, index }: RoadmapStepProps) {
    const { icon: Icon, title, description, time } = step;
    const isReversed = index % 2 !== 0;

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <motion.div 
            className="w-full max-w-sm md:max-w-md"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
        >
            <div className={cn(
                "flex items-center",
                isReversed ? "flex-row-reverse" : "flex-row"
            )}>
                {/* Icon on the timeline */}
                <div className="bg-background border-4 border-primary rounded-full w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center z-10">
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                </div>

                {/* Card Content */}
                <Card className={cn(
                    "p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 border w-full",
                    isReversed ? "mr-[-2rem] md:mr-[-3rem]" : "ml-[-2rem] md:ml-[-3rem]"
                )}>
                    <div className="flex justify-between items-start mb-2 flex-col sm:flex-row gap-2">
                        <h3 className="text-lg md:text-xl font-bold">{title}</h3>
                        <Badge variant="outline" className="flex-shrink-0">{time}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base">{description}</p>
                </Card>
            </div>
        </motion.div>
    );
}

