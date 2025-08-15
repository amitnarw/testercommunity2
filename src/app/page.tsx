
'use client';

import Link from 'next/link';
import { ArrowRight, BadgeCheck, CheckCircle, ChevronRight, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, FeatureCard, HowItWorksCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from "next/image";
import { ScrollToTopButton } from '@/components/scroll-to-top-button';
import { ScrollingRibbon } from '@/components/scrolling-ribbon';
import React from 'react';
import { testimonials } from '@/lib/data.tsx';
import { TestimonialScroller } from '@/components/testimonial-scroller';
import { GlobalImpactSection } from '@/components/global-impact-section';
import { FaqSection } from '@/components/faq-section';
import { TwoPathsSection } from '@/components/two-paths-section';

const features = [
    {
        title: 'Community Testing Hub',
        description: 'Engage with a vibrant community to get your app tested on a massive range of devices.',
        link: '/community-dashboard',
    },
    {
        title: 'Real-Time Dashboards',
        description: 'Monitor your testing progress with dynamic charts and data visualizations that come to life.',
        link: '/dashboard',
    },
    {
        title: 'Gamified Reputation',
        description: 'Level up your tester profile with animated XP bars and unlockable achievement badges.',
        link: '/community-dashboard',
    },
    {
        title: 'Seamless Bug Reporting',
        description: 'An intuitive and animated bug reporting experience that testers will love.',
        link: '/',
    },
];

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden">
                    <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                        <div className="max-w-4xl mx-auto">
                             <Badge variant="outline" className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs sm:text-sm font-body text-primary mb-5 sm:mb-6">
                                Meet Google's 12-Tester Requirement.
                            </Badge>
                            <h1 className="text-[2.25rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] font-heading leading-[1.1] tracking-tight font-bold mb-5 sm:mb-6 md:mb-8">
                                Launch Your App with <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Confidence</span>
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg font-body max-w-sm sm:max-w-md md:max-w-lg lg:max-w-[700px] mx-auto mb-8 sm:mb-9 md:mb-10 lg:mb-12 text-muted-foreground">
                                Get your Android app tested by 12+ real users for 14 days to meet Google's publishing requirements. Choose our free community path or hire our professional testers.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                                <Button asChild size="lg" className="font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30">
                                    <Link href="/signup">Get Started For Free <ArrowRight className="ml-2" /></Link>
                                </Button>
                            </div>

                            <div className="w-full max-w-[700px] overflow-hidden m-auto mt-12 sm:mt-20 md:mt-40">
                                <Image src={"/dark-mac.png"} alt="App Testing Platform" width={"900"} height={"600"} decoding="async" data-nimg="1" className="w-full h-auto hidden dark:block" ></Image>
                                <Image src={"/light-mac.png"} alt="App Testing Platform" width={"900"} height={"600"} decoding="async" data-nimg="1" className="w-full h-auto dark:hidden block" ></Image>
                            </div>
                        </div>
                    </div>
                </section>
                
                <TwoPathsSection />

                {/* Global Impact Section */}
                <GlobalImpactSection />

                <div className="lg:w-[80%] lg:mx-auto">
                    {/* Features Section */}
                    <section className="py-20 md:py-28 bg-background">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="text-center">
                                <h2 className="text-3xl md:text-4xl font-bold">A Platform That Works as Good as It Looks</h2>
                                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                    We've merged cutting-edge functionality with Awwwards-caliber design to create an unparalleled testing experience.
                                </p>
                            </div>
                            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {features.map((feature, i) => (
                                    <FeatureCard key={feature.title}>
                                        <CardHeader>
                                            <CardTitle className="text-lg text-black dark:text-white">{feature.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className='flex flex-col items-start justify-between h-full'>
                                            <p className="text-muted-foreground">{feature.description}</p>
                                            <Link href={feature.link} className="flex items-center text-primary font-semibold mt-4 hover:underline">
                                                Learn More <ChevronRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        </CardContent>
                                    </FeatureCard>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Testimonials Section */}
                <section className="py-20 md:py-28">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-bold">Trusted by a Community of Innovators</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                See what developers and testers are saying about inTesters.
                            </p>
                        </div>
                    </div>
                    <div className="mt-12">
                        <TestimonialScroller testimonials={testimonials} />
                    </div>
                </section>

                {/* Scrolling Ribbon Section */}
                <ScrollingRibbon />

                <div className="lg:w-[80%] lg:mx-auto">
                    {/* FAQ Section */}
                    <section id="faq" className="py-20 md:py-28 bg-background">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="text-center max-w-2xl mx-auto">
                                <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
                                <p className="mt-4 text-muted-foreground">
                                    Have questions? We have answers. For more detailed information, check out our full FAQ page.
                                </p>
                            </div>

                            <div className="mt-12 max-w-3xl mx-auto">
                                <FaqSection />
                                <div className="mt-8 text-center">
                                     <Button asChild variant="outline">
                                        <Link href="/faq">View All FAQs <ArrowRight className="ml-2" /></Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-20 md:py-28">
                        <div className="container mx-auto px-4 md:px-6 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold">Ready to <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Elevate</span> Your Testing?</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                Join the community and experience the future of app testing today. It's free to get started.
                            </p>
                            <div className="mt-8">
                                <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-xl hover:shadow-lg hover:shadow-primary/30">
                                    <Link href="/signup">Sign Up Now <ArrowRight className="ml-2" /></Link>
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <ScrollToTopButton />
        </div>
    );
}
