'use client';

import Link from 'next/link';
import { ArrowRight, BarChart, CheckCircle, ChevronRight, LayoutGrid, Star, TestTube, Users, Smartphone, Bell, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, FeatureCard } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TestTribeLogo, GoldBadge, SilverBadge, BronzeBadge } from '@/components/icons';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from "next/image";
import { ScrollToTopButton } from '@/components/scroll-to-top-button';
import { Autoplay } from '@/components/carousel-autoplay';
import { ScrollingRibbon } from '@/components/scrolling-ribbon';
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <LayoutGrid className="h-8 w-8 text-primary" />,
    title: 'Interactive Marketplace',
    description: 'Browse and connect with top-tier testers in a visually engaging, animated marketplace.',
    link: '/marketplace',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Real-Time Dashboards',
    description: 'Monitor your testing progress with dynamic charts and data visualizations that come to life.',
    link: '/dashboard',
  },
  {
    icon: <Star className="h-8 w-8 text-primary" />,
    title: 'Gamified Reputation',
    description: 'Level up your tester profile with animated XP bars and unlockable achievement badges.',
    link: '/#reputation',
  },
  {
    icon: <TestTube className="h-8 w-8 text-primary" />,
    title: 'Seamless Bug Reporting',
    description: 'An intuitive and animated bug reporting experience that testers will love.',
    link: '/',
  },
];

const testimonials = [
  {
    name: 'Sarah Jennings',
    role: 'Lead Developer, TechNova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'woman portrait',
    comment: 'TestTribe has revolutionized our QA process. The real-time feedback and detailed reports are game-changers. The platform isn\'t just functional, it\'s a joy to use!',
  },
  {
    name: 'Mike Valerio',
    role: 'Indie Game Developer',
    avatar: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'man smiling',
    comment: 'Finding the right testers used to be a nightmare. The gamified marketplace made it fun and easy to connect with experienced, reliable people. My app is better for it.',
  },
  {
    name: 'Chen Lin',
    role: 'Product Manager, Innovate Inc.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'person glasses',
    comment: 'The dashboards are incredible. Being able to visualize our testing data with such clarity and beauty has helped us identify critical issues faster than ever before.',
  },
  {
    name: 'David Kim',
    role: 'QA Engineer, GameSphere',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'man portrait',
    comment: 'As a tester, the gamified reputation system is fantastic. It motivates me to do my best work and get recognized for it. I\'ve gotten more high-quality projects through TestTribe than any other platform.',
  },
  {
    name: 'Maria Garcia',
    role: 'Mobile App Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    dataAiHint: 'woman developer',
    comment: 'The community aspect is what sets TestTribe apart. It\'s not just a service; it\'s a network of professionals passionate about quality. The collaboration tools are excellent.',
  },
];

const appFeatures = [
    {
        icon: <Bell className="h-6 w-6 text-primary" />,
        title: "Real-time Notifications",
        description: "Get instant alerts for new test invites, bug reports, and messages."
    },
    {
        icon: <Flag className="h-6 w-6 text-primary" />,
        title: "On-the-Go Reporting",
        description: "Submit bug reports with attachments directly from your device."
    },
    {
        icon: <Smartphone className="h-6 w-6 text-primary" />,
        title: "Manage Anywhere",
        description: "Access your dashboard, manage projects, and track progress on the fly."
    }
];

function PricingSection() {
    return (
        <section id="pricing" className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Find the Perfect Plan</h2>
                    <p className="mt-4 text-muted-foreground">
                        Whether you're a solo developer or a large enterprise, we have a plan that fits your needs.
                    </p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-3 items-center">
                    {/* Free Plan */}
                    <Card className="rounded-xl border-2 border-transparent hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
                        <CardHeader className="pt-8">
                            <CardTitle className="font-headline text-2xl">Starter</CardTitle>
                            <CardDescription>For individuals and hobby projects.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-4xl font-bold">
                                $0 <span className="text-lg font-normal text-muted-foreground">/ month</span>
                            </div>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>1 Project</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>5 Testers</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Basic Reporting</span>
                                </li>
                                <li className="flex items-center gap-2 text-muted-foreground/50">
                                    <CheckCircle className="w-5 h-5 " />
                                    <span>Priority Support</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full rounded-xl">Get Started</Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="rounded-2xl border-2 border-primary shadow-2xl shadow-primary/20 relative">
                         <Badge variant="default" className="absolute -top-4 left-1/2 -translate-x-1/2">Most Popular</Badge>
                        <CardHeader className="pt-8">
                            <CardTitle className="font-headline text-2xl">Pro</CardTitle>
                            <CardDescription>For small teams and growing businesses.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-4xl font-bold">
                                $49 <span className="text-lg font-normal text-muted-foreground">/ month</span>
                            </div>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>10 Projects</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>50 Testers</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Advanced Reporting</span>
                                </li>
                                 <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Priority Support</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full rounded-xl">Choose Plan</Button>
                        </CardFooter>
                    </Card>

                    {/* Enterprise Plan */}
                    <Card className="rounded-xl border-2 border-transparent hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
                        <CardHeader className="pt-8">
                            <CardTitle className="font-headline text-2xl">Enterprise</CardTitle>
                            <CardDescription>For large organizations with custom needs.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="text-4xl font-bold">
                                Custom
                            </div>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Unlimited Projects</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Unlimited Testers</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Dedicated Account Manager</span>
                                </li>
                                 <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Custom Integrations</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                             <Button variant="outline" className="w-full rounded-xl">Contact Us</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40">
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <Badge variant="outline" className="text-sm border-primary/30 bg-primary/10 text-primary py-1 px-4 rounded-full">
                Now in Public Beta
              </Badge>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-7xl font-bold mt-4">
                The Ultimate Animated App Testing Community Platform
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                TestTribe is a next-generation platform that connects developers with expert testers through a dynamic, gamified, and visually stunning experience.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button asChild size="lg" className="font-bold rounded-xl">
                  <Link href="/signup">Get Started for Free <ArrowRight className="ml-2" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-bold rounded-xl">
                  <Link href="/marketplace">Explore Testers</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">A Platform That Works as Good as It Looks</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                We've merged cutting-edge functionality with Awwwards-caliber design to create an unparalleled testing experience.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <FeatureCard key={feature.title}>
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
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

        {/* Google App Coming Soon Section */}
        <section className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="relative h-full w-full min-h-[500px]">
                    <Image src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=600&auto=format&fit=crop" alt="TestTribe Google App" layout="fill" objectFit="cover" className="rounded-xl shadow-2xl" data-ai-hint="mobile app interface" />
                </div>
                <div>
                    <Badge variant="secondary">Coming Soon</Badge>
                    <h2 className="font-headline text-3xl md:text-4xl font-bold mt-4">TestTribe, Now in Your Pocket</h2>
                    <p className="mt-4 text-muted-foreground">
                        Get ready to experience TestTribe like never before. Our native Google app is in the works, bringing all the platform's features right to your mobile device. Stay tuned for updates!
                    </p>
                    <ul className="mt-6 space-y-4">
                        {appFeatures.map((feature) => (
                            <li key={feature.title} className="flex items-start gap-4">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8">
                        <Button variant="outline" disabled className="rounded-xl">(Coming Soon)</Button>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-28 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Trusted by a Community of Innovators</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                See what developers and testers are saying about TestTribe.
              </p>
            </div>
            <Carousel
              className="mt-12 w-full"
              opts={{ loop: true, align: 'start' }}
              plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="flex flex-col justify-between h-full bg-card rounded-xl">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.dataAiHint} />
                              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{testimonial.name}</CardTitle>
                              <CardDescription>{testimonial.role}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">&ldquo;{testimonial.comment}&rdquo;</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
        
        {/* Scrolling Ribbon Section */}
        <ScrollingRibbon />
        
        {/* Pricing Section */}
        <PricingSection />

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-[linear-gradient(0deg,_#f9fafb_20%,_#f0f0f0_100%)] dark:bg-[linear-gradient(0deg,_#2a2d32_20%,_#1d1d1d_100%)]">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Ready to Elevate Your Testing?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Join the community and experience the future of app testing today. It's free to get started.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-xl">
                <Link href="/signup">Sign Up Now <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <ScrollToTopButton />
    </div>
  );
}
