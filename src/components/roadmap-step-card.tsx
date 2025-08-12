
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { RoadmapStep } from '@/lib/types';
import React from 'react';

interface RoadmapStepCardProps {
  step: RoadmapStep;
  isPro: boolean;
}

export function RoadmapStepCard({ step, isPro }: RoadmapStepCardProps) {
  const { icon: Icon, title, description, details } = step;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.5 }}
      className="w-[300px] md:w-[350px] h-full flex-shrink-0 relative px-4"
    >
        <div className={cn("h-full w-full rounded-2xl p-6 flex flex-col justify-center", isPro ? "bg-primary/10 border-primary/20 border" : "bg-secondary")}>
            <div className={cn("absolute flex items-center justify-center w-16 h-16 rounded-full border-4 bg-background left-1/2 -translate-x-1/2",
                 isPro ? "bottom-[-32px] border-primary/50" : "top-[-32px] border-secondary-foreground/20"
            )}>
                 <div className={cn("flex items-center justify-center w-12 h-12 rounded-full", isPro ? "bg-primary/20 text-primary" : "bg-secondary-foreground/10 text-secondary-foreground")}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
            <p className="text-muted-foreground text-sm text-center mb-4">{description}</p>
            <div className="text-center bg-background/50 p-3 rounded-lg text-xs">
                <p className="font-semibold text-foreground">{details}</p>
            </div>
        </div>
    </motion.div>
  );
}
