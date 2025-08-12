
'use client'

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

interface StepDetailProps {
    what: string;
    why: string;
    when: string;
}

interface HowItWorksStepProps {
    step: number;
    isReversed?: boolean;
    communityTitle: string;
    communityIcon: React.ReactNode;
    communityDetails: StepDetailProps,
    proTitle: string;
    proIcon: React.ReactNode;
    proDetails: StepDetailProps;
}

const StepCard = ({ title, icon, details, isPro }: { title: string, icon: React.ReactNode, details: StepDetailProps, isPro?: boolean }) => {
    return (
        <Card className={cn("w-full shadow-2xl shadow-primary/10 rounded-2xl border-2 border-transparent hover:border-primary transition-all duration-300", isPro && "bg-secondary/30")}>
            <CardContent className="p-6">
                <Badge variant={isPro ? "default" : "secondary"} className="mb-4">
                    {isPro ? "Professional Path" : "Community Path"}
                </Badge>
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>
                <div className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-semibold flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> What you do</h4>
                        <p className="text-muted-foreground pl-6">{details.what}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Why it matters</h4>
                        <p className="text-muted-foreground pl-6">{details.why}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> When it happens</h4>
                        <p className="text-muted-foreground pl-6">{details.when}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const Path = ({ isReversed = false }) => (
    <div className="absolute inset-0 h-full w-full -z-10 hidden md:block">
        <svg
            className="w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d={isReversed 
                    ? "M 400 0 C 400 100, 200 100, 200 200 C 200 300, 0 300, 0 400" 
                    : "M 0 0 C 0 100, 200 100, 200 200 C 200 300, 400 300, 400 400"
                }
                stroke="hsl(var(--border))"
                strokeWidth="2"
                strokeDasharray="8 8"
            />
        </svg>
    </div>
);


export function HowItWorksStep({ step, isReversed, communityTitle, communityIcon, communityDetails, proTitle, proIcon, proDetails }: HowItWorksStepProps) {
    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <motion.div 
            className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center my-12 md:my-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={variants}
        >
            <Path isReversed={isReversed} />

            <div className="md:hidden">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center rounded-full text-xl font-bold z-10">
                        {step}
                    </div>
                    <div className="w-full h-px bg-border"></div>
                </div>
            </div>
            
            <div className={cn("flex justify-end", isReversed && "md:order-2")}>
                <StepCard title={communityTitle} icon={communityIcon} details={communityDetails} />
            </div>

            <div className={cn("flex justify-start", isReversed && "md:order-1")}>
                 <StepCard title={proTitle} icon={proIcon} details={proDetails} isPro />
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 hidden md:flex z-20">
                <div className="bg-primary text-primary-foreground w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold shadow-lg shadow-primary/50">
                    {step}
                </div>
            </div>
        </motion.div>
    )
}
