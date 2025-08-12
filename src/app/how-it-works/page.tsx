
'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { communityPathSteps, professionalPathSteps } from '@/lib/data';
import { RoadmapStepCard } from '@/components/roadmap-step-card';
import { ArrowRight, Rocket, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Confetti from 'react-dom-confetti';
import { motion } from 'framer-motion';
import { HowItWorksProcessCard } from '@/components/how-it-works-process-card';

const processSteps = [
    {
        icon: <Users className="w-8 h-8"/>,
        title: "Sign Up & Join",
        description: "Create your free profile to become part of a global community.",
        communityDetails: "Choose your path as a tester or developer. No payment info needed to start.",
        proDetails: "Post your project for free, outlining your app and testing requirements."
    },
    {
        icon: <Rocket className="w-8 h-8"/>,
        title: "Engage & Test",
        description: "Start your testing journey by either earning points or hiring experts.",
        communityDetails: "Test other apps to earn points. The more you test, the more you earn.",
        proDetails: "Browse our marketplace of vetted professionals and hire the perfect tester for your needs."
    },
    {
        icon: <Briefcase className="w-8 h-8"/>,
        title: "Get Feedback",
        description: "Receive valuable insights to improve your application.",
        communityDetails: "Use your points to get your app tested by a diverse range of community members.",
        proDetails: "Receive comprehensive, actionable reports from your hired professional."
    },
    {
        icon: <ArrowRight className="w-8 h-8"/>,
        title: "Launch with Confidence",
        description: "Iterate on the feedback and prepare for a successful launch.",
        communityDetails: "Engage with testers, fix bugs, and resubmit for further testing.",
        proDetails: "Verify fixes with your tester and approve the project upon successful completion."
    }
];

export default function HowItWorksPage() {
    
    return (
        <div className="bg-background text-foreground">
             <section className="h-screen w-full flex flex-col items-center justify-center text-center p-4 bg-dot-pattern dark:bg-dot-pattern-dark">
                <h1 className="text-5xl md:text-7xl font-bold">The Path to a Perfect App</h1>
                <p className="mt-6 max-w-3xl mx-auto text-muted-foreground text-xl">
                    Our unified process ensures quality, whether you leverage the community or hire professionals. Your journey to a flawless launch starts here.
                </p>
                <p className="mt-8 text-sm text-muted-foreground animate-pulse">Scroll down to see how it works</p>
            </section>
            
            <section className="py-20 md:py-32 container mx-auto px-4 md:px-6">
                 <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
                    {/* Left Column: Scrolling Text */}
                    <div className="md:col-span-1 space-y-24">
                        {processSteps.map((step, index) => (
                           <motion.div 
                                key={index} 
                                className="space-y-4"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true, amount: 0.5, margin: "-200px" }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center gap-4">
                                     <div className="text-primary bg-primary/10 p-3 rounded-lg flex items-center justify-center">
                                        {step.icon}
                                    </div>
                                    <h2 className="text-3xl font-bold">{step.title}</h2>
                                </div>
                                <p className="text-lg text-muted-foreground">{step.description}</p>
                           </motion.div>
                        ))}
                    </div>

                    {/* Right Column: Sticky Card */}
                    <div className="md:col-span-1 md:sticky top-24">
                        <HowItWorksProcessCard
                            icon={<Users className="w-8 h-8"/>}
                            title="Sign Up & Join"
                            description="Create your free profile to become part of a global community."
                            communityDetails="Choose your path as a tester or developer. No payment info needed to start."
                            proDetails="Post your project for free, outlining your app and testing requirements."
                        />
                    </div>
                </div>
            </section>

             <motion.section 
                className="h-screen w-full flex flex-col items-center justify-center text-center p-4 relative overflow-hidden bg-secondary/30 dark:bg-secondary/20"
            >
                <Rocket className="w-16 h-16 text-primary mb-4" />
                <h2 className="text-5xl md:text-7xl font-bold">You've Reached the <span className="text-primary">Launchpad</span></h2>
                <p className="mt-6 max-w-2xl mx-auto text-muted-foreground text-xl">
                Your journey to a flawless app starts now. Choose your path and launch with the confidence of knowing your app is truly ready for the world.
                </p>
                <div className="mt-10">
                <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-xl hover:shadow-lg hover:shadow-primary/30">
                    <Link href="/signup">Begin Your Ascent <ArrowRight className="ml-2" /></Link>
                </Button>
                </div>
            </motion.section>
        </div>
    );
}
