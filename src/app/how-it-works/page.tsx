
'use client'

import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoadmapPath } from '@/components/roadmap-path';
import { communityPathSteps, professionalPathSteps } from '@/lib/data';

export default function HowItWorksPage() {
  return (
    <div className="bg-background text-foreground overflow-hidden">
        {/* Hero Section */}
        <section className="py-20 md:py-28 text-center bg-secondary/30 relative">
             <div className="absolute inset-0 bg-dot-pattern-dark opacity-30 z-0"></div>
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold">
                    Two Paths to a Perfect App
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
                   Whether you're a bootstrapper who loves community collaboration or a business that needs guaranteed professional results, we have a journey designed for you.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-xl hover:shadow-lg hover:shadow-primary/30">
                        <Link href="/signup">Start Your Journey <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* The Paths Section */}
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 md:px-6">
                 <Tabs defaultValue="community" className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
                        <TabsTrigger value="community" className="h-10 text-lg font-bold flex items-center gap-2"><Users className="w-5 h-5"/> Community Path</TabsTrigger>
                        <TabsTrigger value="professional" className="h-10 text-lg font-bold flex items-center gap-2"><Briefcase className="w-5 h-5"/> Professional Path</TabsTrigger>
                    </TabsList>
                    <TabsContent value="community">
                        <div className="pt-12">
                             <h2 className="text-3xl font-bold text-center mb-4">The Community Path: Give to Get</h2>
                             <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">Test other apps to earn points, then spend them to get your own app tested by a global community. It's free, collaborative, and powerful.</p>
                             <RoadmapPath steps={communityPathSteps} />
                        </div>
                    </TabsContent>
                    <TabsContent value="professional">
                         <div className="pt-12">
                            <h2 className="text-3xl font-bold text-center mb-4">The Professional Path: Guaranteed Quality</h2>
                            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">Hire our vetted QA professionals for dedicated testing. Get expert feedback, detailed reports, and launch with ultimate confidence.</p>
                            <RoadmapPath steps={professionalPathSteps} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    </div>
  );
}
