
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HowItWorksCard } from '@/components/ui/card';
import { ArrowRight, Check, Users, Briefcase, Award, Zap, Heart, Target } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const benefits = [
    {
        icon: <Users className="w-8 h-8 text-primary" />,
        title: "Crowdsourced Insights",
        description: "Leverage a global community to find bugs you'd never catch with a small team. Get diverse perspectives on usability across countless devices and environments.",
    },
    {
        icon: <Award className="w-8 h-8 text-primary" />,
        title: "Professional Polish",
        description: "Go beyond bug hunting. Hire vetted experts for structured testing, detailed reports, and the assurance you need to launch a truly production-ready application.",
    },
    {
        icon: <Zap className="w-8 h-8 text-primary" />,
        title: "Accelerated Timelines",
        description: "Stop letting QA be a bottleneck. Get feedback in hours with our community or launch a full professional test cycle in days, not weeks. Ship faster, with confidence.",
    },
];

const communityFeatures = [
    {
        icon: <Heart className="w-6 h-6 text-primary" />,
        title: "The Philosophy: Give to Get",
        description: "It's a reciprocal ecosystem built on mutual success. By contributing your skills to test others' apps, you earn the right to have the community's eyes on your own project. It's collaboration in its purest form.",
    },
     {
        icon: <Target className="w-6 h-6 text-primary" />,
        title: "Who It's For",
        description: "Perfect for indie developers, students, early-stage startups, and anyone on a bootstrap budget. If you have more time than money and love being part of a community, this is for you.",
    },
    {
        icon: <Users className="w-6 h-6 text-primary" />,
        title: "How You Start",
        description: "Sign up, build your tester profile, and start browsing projects. Find an app that interests you, follow the test case, and report any valid bugs you find to start earning points immediately.",
    },
    {
        icon: <Check className="w-6 h-6 text-primary" />,
        title: "What You Get",
        description: "Receive real-world feedback from a diverse range of testers on different devices and operating systems. Uncover usability issues and bugs you might have missed. Plus, you can redeem points for Pro services.",
    }
];

const proFeatures = [
    {
        icon: <Heart className="w-6 h-6 text-primary" />,
        title: "The Philosophy: Guaranteed Quality",
        description: "For when you need certainty. This path is for mission-critical projects that require professional, documented, and guaranteed testing. You pay for expertise and peace of mind, with no time commitment required from you.",
    },
     {
        icon: <Target className="w-6 h-6 text-primary" />,
        title: "Who It's For",
        description: "Ideal for established businesses, funded startups, and developers with tight deadlines or complex testing needs (e.g., security, performance). If your reputation is on the line, go Pro.",
    },
     {
        icon: <Briefcase className="w-6 h-6 text-primary" />,
        title: "How You Start",
        description: "Post your project in our marketplace, defining your testing scope and requirements. Browse our vetted professionals, or let our algorithm match you with the perfect tester for your needs. Hire with one click.",
    },
    {
        icon: <Check className="w-6 h-6 text-primary" />,
        title: "What You Get",
        description: "Comprehensive, actionable reports from seasoned QA experts. Get detailed bug reports, usability analysis, and performance metrics. Launch with the confidence that your app has been professionally validated.",
    }
]

export default function HowItWorksPage() {
  return (
    <div className="bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-20 md:py-28 text-center bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <h1 className="text-5xl md:text-6xl font-bold">How TestTribe Works</h1>
                <p className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg">
                   We offer two distinct paths to get your app tested, polished, and ready for launch. Whether you're a solo developer or a growing business, there's a perfect path for you.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild size="lg" className="font-bold rounded-xl">
                        <Link href="/signup">Choose Your Path</Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold">The Best of Both Worlds</h2>
                    <p className="mt-4 text-muted-foreground">
                       TestTribe uniquely combines the power of community with the reliability of professionals.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((benefit) => (
                        <Card key={benefit.title} className="text-center p-8 rounded-2xl bg-background/50 border-none shadow-lg">
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    {benefit.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold">{benefit.title}</h3>
                            <p className="text-muted-foreground mt-2">{benefit.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* The Two Paths Section */}
        <section className="py-20 md:py-28 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-start">
                {/* Community Path */}
                <div className="bg-background p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold">The Community Path (Free)</h2>
                    <p className="mt-4 text-muted-foreground">
                       Leverage the power of the crowd. Test other apps to earn points, and use those points to get your own app tested by a diverse community.
                    </p>
                    <div className="mt-8 grid gap-6">
                        {communityFeatures.map((feature, index) => (
                            <HowItWorksCard key={index} {...feature} />
                        ))}
                    </div>
                </div>

                 {/* Professional Path */}
                <div className="bg-background p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold">The Professional Path (Paid)</h2>
                    <p className="mt-4 text-muted-foreground">
                       For when you need guaranteed results and expert insights. Hire our vetted professionals for a fixed price and launch with absolute confidence.
                    </p>
                    <div className="mt-8 grid gap-6">
                         {proFeatures.map((feature, index) => (
                            <HowItWorksCard key={index} {...feature} />
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold">Ready to <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Elevate</span> Your Testing?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    Choose your path and experience the future of app testing today. It's free to get started with the community.
                </p>
                <div className="mt-8">
                    <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-xl hover:shadow-lg hover:shadow-primary/30">
                        <Link href="/signup">Sign Up Now <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
            </div>
        </section>
    </div>
  );
}
