
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

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <motion.div
            className="w-full h-full"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
        >
            <Card className="p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 border h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary/10 border-2 border-primary/20 rounded-lg w-12 h-12 flex-shrink-0 flex items-center justify-center z-10">
                        <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                         <h3 className="text-lg md:text-xl font-bold">{title}</h3>
                         <Badge variant="outline" className="mt-1">{time}</Badge>
                    </div>
                </div>
                <p className="text-muted-foreground text-sm md:text-base flex-grow">{description}</p>
            </Card>
        </motion.div>
    );
}
