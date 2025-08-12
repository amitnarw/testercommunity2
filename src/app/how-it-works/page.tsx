
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Users, Briefcase, Clock, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const communitySteps = [
    {
        title: "Step 1: Join the Community",
        description: "Sign up for a free account and create your developer profile. It only takes a few minutes.",
        time: "5 Mins",
        icon: <Users className="w-8 h-8 text-primary" />
    },
    {
        title: "Step 2: Earn Points by Testing",
        description: "Browse apps submitted by other community members. Find and report valid bugs to earn points.",
        time: "Flexible",
        icon: <Award className="w-8 h-8 text-primary" />
    },
    {
        title: "Step 3: Submit Your App",
        description: "Use the points you've earned to submit your own app for testing by the community.",
        time: "Instant",
        icon: <CheckCircle className="w-8 h-8 text-primary" />
    },
    {
        title: "Step 4: Receive Feedback",
        description: "Get valuable feedback and bug reports from a diverse pool of testers on various devices.",
        time: "24-48 Hours",
        icon: <Clock className="w-8 h-8 text-primary" />
    }
];

const proSteps = [
    {
        title: "Step 1: Define Your Project",
        description: "Submit your project requirements. Specify the type of testing you need, from UI/UX to security.",
        time: "15 Mins",
        icon: <Briefcase className="w-8 h-8 text-primary" />
    },
    {
        title: "Step 2: Hire a Professional",
        description: "Browse our marketplace of vetted testers. We'll assign the best fit within hours.",
        time: "6 Hours",
        icon: <Users className="w-8 h-8 text-primary" />
    },
    {
        title: "Step 3: Professional Testing Begins",
        description: "Our experts conduct thorough, structured testing based on your requirements, providing detailed reports.",
        time: "1-3 Days",
        icon: <Award className="w-8 h-8 text-primary" />
    },
    {
        title: "Step 4: Launch with Confidence",
        description: "Receive a comprehensive report with actionable insights, ensuring a high-quality production release.",
        time: "Up to 14 Days",
        icon: <CheckCircle className="w-8 h-8 text-primary" />
    }
];

export default function HowItWorksPage() {
  return (
    <div className="bg-background text-foreground">
        {/* Hero Section */}
        <section className="py-20 md:py-28 text-center bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <h1 className="text-5xl md:text-6xl font-bold">See How It Works</h1>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    Your App, Tested and Improved in 4 Simple Steps. Join 2,000+ successful developers. See our proven process for getting your app ready for launch.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild size="lg" className="font-bold rounded-xl">
                        <Link href="/signup">Start Your Journey</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="font-bold rounded-xl">
                        <Link href="/dashboard">View Sample Dashboard</Link>
                    </Button>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <Card className="rounded-xl bg-background/50">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-primary">99%</CardTitle>
                            <p className="text-muted-foreground">Success Rate</p>
                        </CardHeader>
                    </Card>
                    <Card className="rounded-xl bg-background/50">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-primary">6 Hours</CardTitle>
                            <p className="text-muted-foreground">Tester Assignment</p>
                        </CardHeader>
                    </Card>
                    <Card className="rounded-xl bg-background/50">
                         <CardHeader>
                            <CardTitle className="text-3xl font-bold text-primary">14 Days</CardTitle>
                            <p className="text-muted-foreground">To Production Access</p>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </section>

        {/* Community Path */}
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1">
                    <h2 className="text-3xl md:text-4xl font-bold">The Community Path (Free)</h2>
                    <p className="mt-4 text-muted-foreground">
                        Leverage the power of the crowd. Test other apps to earn points, and use those points to get your own app tested by a diverse community.
                    </p>
                    <div className="mt-8 space-y-8 relative">
                         <div className="absolute left-4 top-0 h-full w-0.5 bg-border -z-10"></div>
                         {communitySteps.map((step, index) => (
                            <div key={index} className="flex items-start gap-6 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full flex items-center justify-center ring-8 ring-background">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{step.title} <span className="text-sm text-primary font-mono ml-2">({step.time})</span></h3>
                                    <p className="text-muted-foreground mt-1">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <Image src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800&auto=format&fit=crop" width={600} height={700} alt="Community Collaboration" className="rounded-2xl shadow-2xl object-cover aspect-[4/5]" data-ai-hint="collaboration interface" />
                </div>
            </div>
        </section>

         {/* Pro Path */}
        <section className="py-20 md:py-28 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-16 items-center">
                 <div>
                    <Image src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop" width={600} height={700} alt="Professional Testers" className="rounded-2xl shadow-2xl object-cover aspect-[4/5]" data-ai-hint="professional meeting" />
                </div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold">The Professional Path (Paid)</h2>
                    <p className="mt-4 text-muted-foreground">
                       For when you need guaranteed results and expert insights. Hire our vetted professionals for a fixed price and launch with absolute confidence.
                    </p>
                    <div className="mt-8 space-y-8 relative">
                         <div className="absolute left-4 top-0 h-full w-0.5 bg-border -z-10"></div>
                         {proSteps.map((step, index) => (
                            <div key={index} className="flex items-start gap-6 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full flex items-center justify-center ring-8 ring-secondary/30">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{step.title} <span className="text-sm text-primary font-mono ml-2">({step.time})</span></h3>
                                    <p className="text-muted-foreground mt-1">{step.description}</p>
                                </div>
                            </div>
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
