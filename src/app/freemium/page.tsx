
'use client';

import { TwoPathsSection } from '@/components/two-paths-section';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FreemiumPage() {
    return (
        <div className="bg-background">
            <section className="py-20 text-center container mx-auto px-4 md:px-6">
                <h1 className="text-4xl md:text-5xl font-bold">The Best of Both Worlds</h1>
                <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
                    At inTesters, we believe in flexibility. Whether you have more time than money, or more money than time, we have a path for you to get your app tested and ready for launch.
                </p>
            </section>
            <TwoPathsSection />
            <section className="py-20 text-center container mx-auto px-4 md:px-6">
                 <h2 className="text-3xl md:text-4xl font-bold">Ready to Start?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    Join thousands of developers who are launching better, more reliable apps with inTesters.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg">
                        <Link href="/signup">Sign Up for Free<ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
            </section>
        </div>
    )
}
