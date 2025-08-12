
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
          ? "bg-gradient-to-br from-secondary via-background to-background dark:from-primary/20 dark:via-background dark:to-background" 
          : "bg-background"
      )}
    >
        <div className={cn("absolute inset-0 pointer-events-none",
            !isPro && "bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
        )}></div>

        <div className="grid md:grid-cols-2 gap-12 items-center w-full max-w-6xl mx-auto relative z-10">
            {/* Left Column: Icon and Info */}
            <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
                <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                        "w-20 h-20 flex items-center justify-center rounded-full text-4xl font-bold shadow-lg",
                        "bg-primary text-primary-foreground"
                    )}>
                    {step.step}
                    </div>
                    <Icon className="w-16 h-16 text-primary" />
                </div>
                
                <h3 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{title}</h3>
                <p className="text-lg md:text-xl mb-6 text-muted-foreground">
                    {description}
                </p>
                {badgeText && <Badge variant={isPro ? "default" : "secondary"} className="text-base py-2 px-4 rounded-lg">{badgeText}</Badge>}
            </div>

            {/* Right Column: Details */}
            <div className="w-full">
                <div className={cn(
                    "p-8 rounded-2xl h-full border",
                    isPro 
                        ? "bg-card/50 backdrop-blur-sm border-primary/20" 
                        : "bg-secondary/30 dark:bg-secondary/20 border-border/50"
                )}>
                <h4 className="text-xl font-bold mb-4 text-foreground">Key Details</h4>
                <ul className="space-y-4">
                    {details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                            <span className="text-muted-foreground">{detail}</span>
                        </li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
    </div>
  );
}
