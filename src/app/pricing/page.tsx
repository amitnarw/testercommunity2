

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, HelpCircle, Phone, Package, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { PointsPackage } from "@/lib/types";
import { pointsPackages, pricingFaqs } from "@/lib/data";


const PointsPackageCard = ({ plan, isPopular }: { plan: PointsPackage, isPopular: boolean }) => {
    return (
        <Card className={cn(
            "flex flex-col rounded-2xl h-full transition-all duration-300",
            isPopular ? "border-2 border-primary shadow-2xl shadow-primary/20 transform scale-105" : "border-border/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2"
        )}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4" /> Best Value
                </div>
            )}
            <CardHeader className="pt-10">
                <div className="flex items-baseline gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                        <Package className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name} Plan</CardTitle>
                </div>
                 <CardDescription className="pt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">₹{plan.price.toLocaleString('en-IN')}</span>
                     <span className="text-muted-foreground">/ one-time</span>
                </div>

                <ul className="space-y-3 text-left">
                    {plan.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full text-lg py-6 font-bold">
                    Get {plan.points} {plan.points > 1 ? 'Packages' : 'Package'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function PricingPage() {
    return (
        <div className="bg-background text-foreground">
            <div className="container mx-auto px-4 md:px-6 py-20">
                <section className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold">Professional Testing <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Packages</span></h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        For free community testing, earn points by testing apps in the Community Hub. For professional testing, purchase a package below.
                    </p>
                </section>

                <section className="mt-20 max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {pointsPackages.map(plan => (
                             <div key={plan.name}>
                                <PointsPackageCard plan={plan} isPopular={plan.name === 'Accelerator'}/>
                            </div>
                        ))}
                    </div>
                </section>

                 <section className="mt-20 max-w-5xl mx-auto">
                    <Card className="flex flex-col md:flex-row items-center gap-6 rounded-2xl h-full bg-secondary/50 border-dashed border-2 p-8 justify-between text-center md:text-left">
                        <div>
                            <CardTitle className="text-2xl">Enterprise & Custom Plans</CardTitle>
                            <CardDescription className="mt-2 max-w-2xl">
                                Need a bulk package purchase, custom integrations, or dedicated account management? We can build a plan tailored to your specific requirements.
                            </CardDescription>
                        </div>
                        <Button asChild className="text-lg py-6 font-bold mt-4 md:mt-0 flex-shrink-0" variant="outline">
                            <Link href="/help">
                                <Phone className="mr-2" /> Contact Sales
                            </Link>
                        </Button>
                    </Card>
                </section>

                <section className="mt-28 max-w-4xl mx-auto">
                     <div className="text-center mb-12">
                        <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold">Packages & Points Explained</h2>
                        <p className="mt-4 text-muted-foreground">
                            Got questions? We've got answers.
                        </p>
                    </div>
                     <Accordion type="single" collapsible className="w-full">
                        {pricingFaqs.map((faq, i) => (
                             <AccordionItem 
                                key={`faq-${i}`} 
                                value={`item-${i}`}
                                className="border-b"
                            >
                                <AccordionTrigger className="text-left font-semibold hover:no-underline text-base py-6">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>
            </div>
        </div>
    );
}
