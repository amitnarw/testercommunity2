
'use client';

import { motion } from 'framer-motion';
import { Users, Briefcase } from 'lucide-react';
import React from 'react';

interface HowItWorksProcessCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    communityDetails: string;
    proDetails: string;
}

export function HowItWorksProcessCard({
    icon,
    title,
    description,
    communityDetails,
    proDetails
}: HowItWorksProcessCardProps) {
    return (
        <motion.div 
            className="bg-card/50 backdrop-blur-md border border-primary/20 rounded-2xl p-8 h-full flex flex-col shadow-xl"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="text-primary bg-primary/10 p-3 rounded-lg">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold">{title}</h3>
            </div>
            <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
            
            <div className="space-y-4">
                {/* Community Path Details */}
                <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-primary"/>
                        <h4 className="font-semibold">Community Path</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{communityDetails}</p>
                </div>

                {/* Professional Path Details */}
                <div className="bg-secondary/50 p-4 rounded-lg">
                     <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-5 h-5 text-primary"/>
                        <h4 className="font-semibold">Professional Path</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{proDetails}</p>
                </div>
            </div>
        </motion.div>
    );
}
