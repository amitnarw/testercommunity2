
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function FreemiumPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 md:px-6 py-20">
                <section className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold">Two Paths to a Perfect App</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Every great app needs testing. Your journey to a bug-free launch starts here. Choose the path that fits your project, your budget, and your timeline.
                    </p>
                </section>

                <section className="mt-20 grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Community Path */}
                    <Link href="/community-dashboard" className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800&auto=format=fit=crop')" }}
                            data-ai-hint="collaboration interface"
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                        <div className="relative flex flex-col justify-end h-[500px] p-8 text-white">
                            <h3 className="text-3xl font-bold mb-2">The Community Path</h3>
                            <p className="text-white/80 mb-6">Harness the power of a global community. Test other apps to earn points, then spend those points to get your app tested by a diverse group of real users on real devices. It's a powerful, reciprocal ecosystem.</p>
                            <div className="flex items-center gap-2 text-lg font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-2">
                                Start Testing for Free <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>

                    {/* Professional Path */}
                    <Link href="/marketplace" className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300">
                         <div 
                           className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format=fit=crop')" }}
                           data-ai-hint="professional meeting"
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                        <div className="relative flex flex-col justify-end h-[500px] p-8 text-white">
                            <h3 className="text-3xl font-bold mb-2">The Professional Path</h3>
                            <p className="text-white/80 mb-6">When you need guaranteed results, specialized skills, or have a critical deadline, hire our vetted professionals. Get expert eyes on your app for a fixed price or hourly rate.</p>
                            <div className="flex items-center gap-2 text-lg font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-2">
                                Hire a Pro <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>
                </section>
            </div>
        </div>
    );
}
