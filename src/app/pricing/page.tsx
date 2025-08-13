
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Star, HelpCircle, Phone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { PricingPlan } from "@/lib/types";

const plans: PricingPlan[] = [
    {
        name: "Starter",
        price: 999,
        apps: 1,
        features: [
            "Access to Professional Testers",
            "Detailed Bug Reports",
            "Standard Support"
        ],
        popular: false
    },
    {
        name: "Growth",
        price: 1999,
        apps: 3,
        features: [
            "Access to Professional Testers",
            "Detailed Bug Reports",
            "Priority Support",
            "Project Dashboard Access"
        ],
        popular: true
    },
    {
        name: "Scale",
        price: 3499,
        apps: 10,
        features: [
            "Access to Professional Testers",
            "Detailed Bug Reports",
            "Dedicated Support",
            "Project Dashboard Access",
            "API Access"
        ],
        popular: false
    }
];

const faqItems = [
    {
        question: "What counts as an 'app'?",
        answer: "An app is a single project within TestTribe. For example, if you want to test both an iOS and an Android version of the same application, they would count as two separate apps."
    },
    {
        question: "Can I upgrade or downgrade my plan later?",
        answer: "Yes, you can change your plan at any time from your account settings. Your billing will be prorated accordingly."
    },
    {
        question: "What happens if I need to test more than 10 apps?",
        answer: "For more than 10 apps or for specific enterprise needs like dedicated account management and custom integrations, please contact us to create a custom plan."
    },
    {
        question: "What is the difference between standard and priority support?",
        answer: "Standard support guarantees a response within 24 business hours. Priority support guarantees a response within 4 hours and includes weekend support for critical issues."
    }
]

const PricingCard = ({ plan }: { plan: PricingPlan }) => {
    const pricePerApp = plan.apps > 0 ? (plan.price / plan.apps).toFixed(2) : plan.price;
    const savings = plan.name === "Growth" ? 33 : plan.name === "Scale" ? 65 : 0;

    return (
        <Card className={cn(
            "flex flex-col rounded-2xl h-full transition-all duration-300 transform hover:-translate-y-2",
            plan.popular ? "border-2 border-primary shadow-2xl shadow-primary/20" : "border-border/50 hover:shadow-xl hover:shadow-primary/10"
        )}>
            {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4" /> Most Popular
                </div>
            )}
            <CardHeader className="pt-10">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                    {plan.name === 'Starter' ? 'Perfect for getting started with a single project.' :
                     plan.name === 'Growth' ? 'Ideal for small teams managing multiple apps.' :
                     'Best for businesses scaling their operations.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6">
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                </div>
                <div className="bg-secondary/50 p-3 rounded-lg text-center">
                    <p className="font-bold text-primary">₹{pricePerApp} per app</p>
                    {savings > 0 && <p className="text-xs text-muted-foreground">Save {savings}%</p>}
                </div>
                <ul className="space-y-3">
                    <li className="flex items-center gap-2 font-bold">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span>Up to {plan.apps} app{plan.apps > 1 && 's'}</span>
                    </li>
                    {plan.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full text-lg py-6 font-bold">
                    Choose {plan.name}
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
                    <h1 className="text-4xl md:text-6xl font-bold">Find the <span className="text-primary">Perfect Plan</span></h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Simple, transparent pricing to help you ship better apps, faster. Choose the plan that's right for your needs.
                    </p>
                </section>

                <section className="mt-20 max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {plans.map(plan => (
                             <div key={plan.name}>
                                <PricingCard plan={plan} />
                            </div>
                        ))}
                         <div>
                            <Card className="flex flex-col rounded-2xl h-full bg-secondary/50 border-dashed border-2 p-6 justify-center items-center text-center">
                                <CardHeader className="pt-10">
                                    <CardTitle className="text-2xl">Enterprise</CardTitle>
                                    <CardDescription>
                                        Custom solutions for large-scale testing needs.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-6">
                                    <p className="text-muted-foreground">
                                        Need more than 10 apps, custom integrations, or dedicated account management? We can build a plan tailored to your specific requirements.
                                    </p>
                                     <ul className="space-y-3 text-left">
                                        {["Unlimited Apps", "Volume Discounts", "Custom Integrations", "Dedicated Account Manager", "Advanced Security & Compliance"].map(feature => (
                                            <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle className="w-5 h-5 text-primary" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full text-lg py-6 font-bold" variant="outline">
                                        <Link href="/help">
                                            <Phone className="mr-2" /> Contact Sales
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>

                <section className="mt-28 max-w-4xl mx-auto">
                     <div className="text-center mb-12">
                        <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
                        <p className="mt-4 text-muted-foreground">
                            Got questions? We've got answers.
                        </p>
                    </div>
                     <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((faq, i) => (
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
