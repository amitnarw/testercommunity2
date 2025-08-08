'use client';

import Link from 'next/link';
import { ArrowRight, BarChart, CheckCircle, ChevronRight, LayoutGrid, Star, TestTube, Users, Smartphone, Bell, Flag, Zap, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, FeatureCard } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TestTribeLogo, GoldBadge, SilverBadge, BronzeBadge } from '@/components/icons';
import Image from "next/image";
import { ScrollToTopButton } from '@/components/scroll-to-top-button';
import { ScrollingRibbon } from '@/components/scrolling-ribbon';
import React from 'react';
import { cn } from '@/lib/utils';
import { testimonials } from '@/lib/data';
import { TestimonialScroller } from '@/components/testimonial-scroller';

const features = [
  {
    title: 'Interactive Marketplace',
    description: 'Browse and connect with top-tier testers in a visually engaging, animated marketplace.',
    link: '/marketplace',
  },
  {
    title: 'Real-Time Dashboards',
    description: 'Monitor your testing progress with dynamic charts and data visualizations that come to life.',
    link: '/dashboard',
  },
  {
    title: 'Gamified Reputation',
    description: 'Level up your tester profile with animated XP bars and unlockable achievement badges.',
    link: '/#reputation',
  },
  {
    title: 'Seamless Bug Reporting',
    description: 'An intuitive and animated bug reporting experience that testers will love.',
    link: '/',
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
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Hire Professional Testers</h2>
                    <p className="mt-4 text-muted-foreground">
                        Access dedicated, professional testers for your project. No subscriptions, just results.
                    </p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2 items-center justify-center">
                    {/* Pay-as-you-go Plan */}
                    <Card className="rounded-xl border-2 border-transparent hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
                        <CardHeader className="pt-8">
                            <CardTitle className="font-headline text-2xl">Hourly</CardTitle>
                            <CardDescription>For flexible, on-demand testing needs.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-4xl font-bold">
                                Pay-as-you-go
                            </div>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Hire testers by the hour</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Access to the full marketplace</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Direct communication with testers</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Secure payment processing</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full rounded-xl">Explore Marketplace</Button>
                        </CardFooter>
                    </Card>

                    {/* Project-based Plan */}
                    <Card className="rounded-2xl border-2 border-primary shadow-2xl shadow-primary/20 relative">
                         <Badge variant="default" className="absolute -top-4 left-1/2 -translate-x-1/2">Best Value</Badge>
                        <CardHeader className="pt-8">
                            <CardTitle className="font-headline text-2xl">Project-Based</CardTitle>
                            <CardDescription>For fixed-scope projects with clear deliverables.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="text-4xl font-bold">
                                Custom Quote
                            </div>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Fixed price for the entire project</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Dedicated project management</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Milestone-based payments</span>
                                </li>
                                 <li className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <span>Guaranteed outcomes</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                             <Button className="w-full rounded-xl">Request a Quote</Button>
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
                Get Your App <span className="text-primary">Tested & Published</span> Faster
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                Get Google Play production access, faster, smoother, and without rejections. Join devs from 100+ countries using our service.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
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
                    <CardTitle>{feature.title}</CardTitle>
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
        
        {/* Two Services Section */}
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Two Paths to Perfect Testing</h2>
                    <p className="mt-4 text-muted-foreground">
                        Whether you want to harness the power of community or hire dedicated professionals, we've got you covered.
                    </p>
                </div>
                <div className="mt-12 grid md:grid-cols-2 gap-8">
                    <FeatureCard>
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-full w-max mb-4">
                                <Users2 className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Community-Powered Testing</CardTitle>
                            <CardDescription>Leverage the community to get your app tested and earn rewards.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Users test each other's apps in a reciprocal ecosystem. By testing community-submitted apps, you earn points. These points can then be redeemed to get your own apps tested by our professional testers. It's a great way to get valuable feedback while contributing to the community.
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Test apps to earn points.</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Submit your own apps for testing.</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Use points to hire individual testers.</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full rounded-xl">
                                <Link href="/signup">Join the Community</Link>
                            </Button>
                        </CardFooter>
                    </FeatureCard>
                    <FeatureCard>
                        <CardHeader>
                             <div className="bg-primary/10 p-3 rounded-full w-max mb-4">
                                <Zap className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Hire Professional Testers</CardTitle>
                            <CardDescription>Directly hire skilled testers for your project. No subscriptions required.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <p className="text-muted-foreground">
                                Need dedicated testing expertise? Browse our marketplace of vetted professional testers and hire them on an hourly or project basis. This is a straightforward, paid service for when you need guaranteed, expert-level testing for your critical projects.
                            </p>
                             <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Purely a paid service.</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> No free or trial plans available.</li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Access top-tier, vetted talent.</li>
                            </ul>
                        </CardContent>
                         <CardFooter>
                            <Button asChild variant="outline" className="w-full rounded-xl">
                                <Link href="/marketplace">Browse Testers</Link>
                            </Button>
                        </CardFooter>
                    </FeatureCard>
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
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Trusted by a Community of Innovators</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                See what developers and testers are saying about TestTribe.
              </p>
            </div>
          </div>
          <div className="mt-12">
            <TestimonialScroller testimonials={testimonials} />
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
