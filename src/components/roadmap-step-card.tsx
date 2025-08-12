
'use client';

import { cn } from '@/lib/utils';
import type { RoadmapStep } from '@/lib/types';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface RoadmapStepCardProps {
  step: RoadmapStep;
  isPro: boolean;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function RoadmapStepCard({ step, isPro }: RoadmapStepCardProps) {
  const { title, description, details, badgeText } = step;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn(
        "w-full h-full p-8 md:p-12 lg:p-24 flex items-center justify-center overflow-hidden relative",
        "md:border-none border-b", // Add border for mobile view separation
        isPro 
          ? "bg-gradient-to-br from-secondary via-background to-background dark:from-gray-900 dark:via-gray-950 dark:to-black" 
          : "bg-white dark:bg-gray-900"
      )}
    >
        <div className={cn("absolute inset-0 pointer-events-none",
            !isPro && "md:bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent dark:from-primary/10",
            isPro && "md:bg-gradient-to-tr from-primary/5 via-transparent to-transparent dark:from-primary/20"
        )}></div>
        
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-8 md:gap-16 items-center relative z-10">
            {/* Left Column: Big Number */}
            <motion.div 
                variants={itemVariants}
                className="md:col-span-4 lg:col-span-3 flex items-start md:items-center md:justify-center"
            >
                <span className={cn(
                    "font-black leading-none",
                    "text-6xl md:text-[12rem] lg:text-[15rem]", // smaller on mobile
                    isPro 
                        ? "text-transparent bg-clip-text bg-gradient-to-b from-primary/20 to-primary/0" 
                        : "text-primary/10"
                )}>
                    {step.step}
                </span>
            </motion.div>

            {/* Right Column: Content */}
            <motion.div 
                variants={cardVariants}
                className="md:col-span-8 lg:col-span-9"
            >
                {badgeText && 
                    <motion.div variants={itemVariants}>
                        <Badge variant={isPro ? "default" : "secondary"} className="text-sm md:text-base py-2 px-4 rounded-lg mb-6 shadow-md">
                            {badgeText}
                        </Badge>
                    </motion.div>
                }
                
                <motion.h3 
                    variants={itemVariants}
                    className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 text-foreground"
                >
                    {title}
                </motion.h3>
                
                <motion.p 
                    variants={itemVariants}
                    className="text-base md:text-lg lg:text-xl mb-10 text-muted-foreground max-w-3xl"
                >
                    {description}
                </motion.p>
                
                <motion.div 
                    variants={itemVariants}
                    className="grid sm:grid-cols-2 gap-x-8 gap-y-6 md:border-l-2 border-primary/20 md:pl-6"
                >
                    {details.map((detail, index) => (
                        <div key={index}>
                            <h4 className="font-semibold text-foreground mb-1">{detail.title}</h4>
                            <p className="text-muted-foreground text-sm">{detail.description}</p>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    </motion.div>
  );
}
