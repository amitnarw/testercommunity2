
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, BadgeCheck, Users, Briefcase } from "lucide-react";
import Link from "next/link";

const communityFeatures = [
    "Test other apps to earn points",
    "Use points to get your app tested",
    "Access a diverse pool of real users",
    "Ideal for indie devs and hobby projects",
    "It's free, powered by your time"
];

const proFeatures = [
    "Hire vetted QA professionals",
    "Get guaranteed, high-quality feedback",
    "Choose testers with specific skills",
    "Perfect for businesses and critical launches",
    "Pay-per-project or hourly rates"
];


export default function FreemiumPage() {
    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 md:px-6 py-20">
                <section className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold">The Best of Both Worlds</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        We believe in flexibility. Whether you have more time than money or need guaranteed results on a deadline, we have a path for you. Both paths lead to a better app.
                    </p>
                </section>

                <section className="mt-20 grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Community Path */}
                    <Card className="rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 h-full flex flex-col">
                        <CardHeader className="pt-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-primary/10 p-3 rounded-lg">
                                    <Users className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-3xl">Community Path</CardTitle>
                            </div>
                            <CardDescription>Leverage the power of the crowd. Test apps, earn points, and get your app tested for free.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 flex-grow">
                            <div className="text-4xl font-bold">
                                Free
                                <span className="text-lg text-muted-foreground ml-2">(Pay with your time)</span>
                            </div>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {communityFeatures.map((feature, index) => (
                                     <li key={index} className="flex items-start gap-2">
                                        <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href="/signup">Join the Community <ArrowRight className="ml-2" /></Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Path */}
                     <Card className="rounded-2xl border-2 border-primary shadow-2xl shadow-primary/20 relative h-full flex flex-col">
                        <CardHeader className="pt-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-primary/10 p-3 rounded-lg">
                                    <Briefcase className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-3xl">Professional Path</CardTitle>
                            </div>
                            <CardDescription>Hire vetted professionals for guaranteed results and specialized testing when you need it most.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 flex-grow">
                             <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold">Pay-per-Project</span>
                            </div>
                             <ul className="space-y-3 text-sm text-muted-foreground">
                                {proFeatures.map((feature, index) => (
                                     <li key={index} className="flex items-start gap-2">
                                        <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full" variant="outline">
                                <Link href="/marketplace">Explore Marketplace <ArrowRight className="ml-2" /></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </section>
            </div>
        </div>
    );
}
