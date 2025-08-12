
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
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
      className={cn(
        "w-[350px] md:w-[450px] h-fit flex-shrink-0 p-8 rounded-3xl shadow-2xl relative flex flex-col justify-between border",
        isPro 
          ? "bg-gradient-to-br from-slate-900 to-black text-primary-foreground border-primary/20" 
          : "bg-card border-border"
      )}
    >
      <div className={cn(
        "absolute -top-6 -left-6 w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold shadow-lg",
        isPro 
          ? "bg-primary text-primary-foreground" 
          : "bg-primary text-primary-foreground"
      )}>
        {step.step}
      </div>
      
      <div className='mt-8'>
        <div className="flex items-center gap-4 mb-4">
          <div className={cn(
            "p-3 rounded-xl",
            isPro ? "bg-primary/10" : "bg-primary/10"
          )}>
            <Icon className={cn("w-6 h-6", isPro ? "text-primary" : "text-primary")} />
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <p className={cn("mb-6 text-base", isPro ? "text-slate-400" : "text-muted-foreground")}>
          {description}
        </p>
      </div>

      <div className={cn(
        "p-4 rounded-xl text-sm",
        isPro ? "bg-white/5" : "bg-secondary"
      )}>
        <p>{details}</p>
      </div>
    </motion.div>
  );
}
