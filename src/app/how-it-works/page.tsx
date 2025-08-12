
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase, Award, Zap, Rocket, IndianRupee, CheckCircle, FileText, UploadCloud, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef } from 'react';
import { communityPathSteps, professionalPathSteps } from '@/lib/data';
import { RoadmapStepCard } from '@/components/roadmap-step-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const HorizontalRoadmap = ({ steps, isPro }: { steps: any[], isPro: boolean }) => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0.1, 0.85], ["0%", "-80%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-background">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-12 px-12">
                    {steps.map((step, index) => (
                        <RoadmapStepCard key={index} step={step} isPro={isPro} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default function HowItWorksPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="h-[80vh] w-full flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-5xl md:text-7xl font-bold">Two Paths to a Perfect App</h1>
        <p className="mt-6 max-w-3xl mx-auto text-muted-foreground text-xl">
          Whether you're an indie dev looking for community feedback or a business needing professional precision, your journey to a flawless launch starts here. Choose your path below.
        </p>
         <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-12"
        >
            <ArrowRight className="w-8 h-8 rotate-90" />
        </motion.div>
      </section>

      <section className="w-full">
         <div className="text-center container mx-auto px-4 md:px-6 my-16">
            <h2 className="text-3xl md:text-4xl font-bold inline-flex items-center gap-3"><Users className="w-8 h-8 text-primary"/>The Community Path: Grow Together</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Leverage the power of the crowd. Test other apps to earn points, then spend them to get your own app tested by a diverse community of passionate users.
            </p>
        </div>
        <HorizontalRoadmap steps={communityPathSteps} isPro={false} />
      </section>
       
      <section className="w-full">
        <div className="text-center container mx-auto px-4 md:px-6 my-16">
            <h2 className="text-3xl md:text-4xl font-bold inline-flex items-center gap-3"><Briefcase className="w-8 h-8 text-primary"/>The Professional Path: Guaranteed Quality</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                For when you need certainty. Hire vetted QA professionals who provide expert feedback, detailed reports, and guaranteed results for a flawless launch.
            </p>
        </div>
        <HorizontalRoadmap steps={professionalPathSteps} isPro={true} />
      </section>

      <motion.section 
        className="h-screen w-full flex flex-col items-center justify-center text-center p-4 relative overflow-hidden"
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
