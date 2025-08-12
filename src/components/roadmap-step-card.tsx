
'use client';

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
    <div
      className={cn(
        "w-full h-full p-8 md:p-12 flex items-center justify-center overflow-hidden",
        isPro 
          ? "bg-gradient-to-br from-slate-900 via-black to-slate-900 text-primary-foreground" 
          : "bg-background dark:bg-secondary/20 dark:bg-dot-pattern-dark dark:bg-[length:30px_30px]"
      )}
    >
        <div className="grid md:grid-cols-2 gap-12 items-center w-full max-w-6xl mx-auto">
            {/* Left Column: Icon and Info */}
            <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
                <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                        "w-20 h-20 flex items-center justify-center rounded-full text-4xl font-bold shadow-lg",
                        "bg-primary text-primary-foreground"
                    )}>
                    {step.step}
                    </div>
                    <Icon className={cn("w-16 h-16", isPro ? "text-primary-foreground" : "text-primary")} />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold mb-4">{title}</h3>
                <p className={cn("text-lg md:text-xl mb-6", isPro ? "text-slate-400" : "text-muted-foreground")}>
                    {description}
                </p>
                {badgeText && <Badge variant={isPro ? "default" : "secondary"} className="text-base py-2 px-4 rounded-lg">{badgeText}</Badge>}
            </div>

            {/* Right Column: Details */}
            <div className="w-full">
                <div className={cn(
                    "p-8 rounded-2xl h-full",
                    isPro ? "bg-white/5 backdrop-blur-sm" : "bg-secondary/50 dark:bg-secondary/30"
                )}>
                <h4 className="text-xl font-bold mb-4">Key Details</h4>
                <ul className="space-y-4">
                    {details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <span className={cn(isPro ? "text-slate-300" : "text-muted-foreground")}>{detail}</span>
                        </li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
    </div>
  );
}
