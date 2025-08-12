
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { RoadmapStep } from '@/lib/types';
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RoadmapStepCardProps {
  step: RoadmapStep;
  isPro: boolean;
}

export function RoadmapStepCard({ step, isPro }: RoadmapStepCardProps) {
  const { icon: Icon, title, description, details, badgeText } = step;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ amount: 0.5 }}
      className={cn(
        "w-full h-full p-8 md:p-16 flex flex-col md:flex-row items-center justify-center gap-16",
        isPro 
          ? "bg-gradient-to-br from-slate-900 to-black text-primary-foreground" 
          : "bg-background"
      )}
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center md:text-left md:items-start max-w-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className={cn(
              "w-20 h-20 flex items-center justify-center rounded-full text-4xl font-bold shadow-lg",
              isPro 
                ? "bg-primary text-primary-foreground" 
                : "bg-primary text-primary-foreground"
            )}>
              {step.step}
            </div>
             <Icon className={cn("w-16 h-16", isPro ? "text-primary" : "text-primary")} />
          </div>
          
          <h3 className="text-4xl md:text-5xl font-bold mb-4">{title}</h3>
          <p className={cn("text-lg md:text-xl mb-8", isPro ? "text-slate-400" : "text-muted-foreground")}>
            {description}
          </p>
          {badgeText && <Badge variant={isPro ? "default" : "secondary"} className="text-base py-2 px-4 rounded-lg">{badgeText}</Badge>}
      </div>

      <div className="flex-1 w-full max-w-lg">
        <div className={cn(
          "p-8 rounded-2xl",
          isPro ? "bg-white/5" : "bg-secondary"
        )}>
          <h4 className="text-xl font-bold mb-4">Key Details</h4>
          <ul className="space-y-3">
            {details.map((detail, index) => (
                <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className={cn(isPro ? "text-slate-300" : "text-muted-foreground")}>{detail}</span>
                </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
