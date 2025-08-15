
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Award } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';


export default function FreemiumPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 md:px-6 py-20">
                <section className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold">The Best of Both Worlds</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Our unique platform combines a free, community-driven testing model with the option to hire expert testers for guaranteed results. Find the path that fits your project perfectly.
                    </p>
                </section>

                <section className="mt-20 max-w-4xl mx-auto">
                    <div className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800&auto=format=fit=crop')" }}
                            data-ai-hint="collaboration interface"
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                        <div className="relative flex flex-col justify-center h-full p-8 md:p-12 text-white min-h-[400px]">
                            <div className="max-w-lg">
                                <h3 className="text-3xl font-bold mb-2">The Community Path</h3>
                                <p className="text-white/80 mb-6">Harness the power of a global community. Test other apps to earn points, then spend those points to get your app tested by a diverse group of real users on real devices. It's a powerful, reciprocal ecosystem.</p>
                                <Button asChild size="lg" variant="secondary">
                                    <Link href="/community-dashboard">
                                        Join the Community <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
