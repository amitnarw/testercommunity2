
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Users, Briefcase } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function TwoPathsSection() {
    return (
        <section className="py-20 md:py-28 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">Two Paths to Get Your App Tested</h2>
                    <p className="mt-4 text-muted-foreground">
                        Whether you want to contribute to a community or need guaranteed professional results, we have a solution that fits your needs.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Path 1: Community */}
                    <Card className="rounded-2xl border h-full flex flex-col p-6 text-center items-center">
                        <div className="flex-grow">
                            <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
                                <Users className="w-8 h-8" />
                            </div>
                            <CardHeader className="p-0">
                                <CardTitle className="text-2xl">The Community Path</CardTitle>
                                <CardDescription className="max-w-xs mx-auto">Test apps, earn points, and get your app tested by the community.</CardDescription>
                            </CardHeader>
                            <CardDescription className="text-4xl font-bold text-center my-6">
                                Free
                            </CardDescription>
                            <ul className="space-y-3 text-sm text-muted-foreground text-left">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span>Reciprocal "give-to-get" model.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span>Earn points for testing other apps.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span>Access a diverse pool of real users and devices.</span>
                                </li>
                            </ul>
                        </div>
                        <CardFooter className='w-full mt-6 p-0'>
                            <Button asChild className="w-full rounded-xl" variant="outline">
                                <Link href="/community-dashboard">Explore Community Hub</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Path 2: Professional */}
                    <Card className="rounded-2xl border-2 border-primary shadow-2xl shadow-primary/20 relative h-full flex flex-col p-6 text-center items-center">
                        <Badge variant="default" className="absolute -top-4 left-1/2 -translate-x-1/2">Recommended</Badge>
                        <div className="flex-grow">
                            <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <CardHeader className="p-0">
                                <CardTitle className="text-2xl">The Professional Path</CardTitle>
                                <CardDescription className="max-w-xs mx-auto">Hire our professional testers for guaranteed, high-quality results.</CardDescription>
                            </CardHeader>
                            <div className="text-4xl font-bold text-center my-6 text-primary">
                                Paid
                            </div>
                            <ul className="space-y-3 text-sm text-muted-foreground text-left">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span>Guaranteed testing by vetted professionals.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span>Fast-track your launch, no community testing required.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span>Managed process for hassle-free completion.</span>
                                </li>
                            </ul>
                        </div>
                        <CardFooter className='w-full mt-6 p-0'>
                            <Button asChild className="w-full rounded-xl">
                                <Link href="/pricing">View Point Packages</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}
