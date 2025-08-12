
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
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
      className={cn(
        "w-[350px] md:w-[450px] h-fit flex-shrink-0 p-8 rounded-3xl shadow-2xl relative flex flex-col justify-between",
        isPro 
          ? "bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground border-primary" 
          : "bg-card border-border"
      )}
    >
      <div className={cn(
        "absolute -top-6 -right-6 w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold",
        isPro 
          ? "bg-primary-foreground text-primary" 
          : "bg-primary text-primary-foreground"
      )}>
        {step.step}
      </div>
      
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className={cn(
            "p-3 rounded-xl",
            isPro ? "bg-primary-foreground/20" : "bg-primary/10"
          )}>
            <Icon className={cn("w-6 h-6", isPro ? "text-primary-foreground" : "text-primary")} />
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <p className={cn("mb-6", isPro ? "text-primary-foreground/90" : "text-muted-foreground")}>
          {description}
        </p>
      </div>

      <div className={cn(
        "p-4 rounded-xl text-sm",
        isPro ? "bg-black/20" : "bg-secondary"
      )}>
        <p>{details}</p>
      </div>
    </motion.div>
  );
}
