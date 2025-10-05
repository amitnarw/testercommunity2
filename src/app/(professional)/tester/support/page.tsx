
'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Bot, DollarSign, LifeBuoy, Mail } from "lucide-react";
import Link from "next/link";
import { SupportChatbot } from "@/components/support-chatbot";

const helpOptions = [
    {
        icon: <LifeBuoy className="w-8 h-8 text-primary" />,
        title: "Project Support",
        description: "Issues with a specific project, build, or instructions? Contact our project management team.",
        contact: "pro-support@inTesters.com",
    },
    {
        icon: <DollarSign className="w-8 h-8 text-primary" />,
        title: "Payment Support",
        description: "Questions about your earnings, payout status, or payment methods? Our finance team can help.",
        contact: "pro-billing@inTesters.com",
    },
    {
        icon: <Mail className="w-8 h-8 text-primary" />,
        title: "General Inquiries",
        description: "Have a general question about our professional program, NDAs, or something else? We're here to chat.",
        contact: "pro-info@inTesters.com",
    },
]

export default function ProfessionalSupportPage() {
  return (
    <>
        <div className="bg-secondary/50 flex-1">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <section className="text-center max-w-3xl mx-auto">
                    <LifeBuoy className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold">Professional Tester Support</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                       Dedicated support for our professional testers. We're here to help you succeed.
                    </p>
                </section>

                 <section className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    <Card className="rounded-2xl p-8 flex items-center justify-between group bg-card shadow-lg hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-6">
                            <div className="bg-primary/10 p-4 rounded-full">
                                <Bot className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Chat with Alex</CardTitle>
                                <CardDescription className="mt-1">Get instant answers from our AI assistant.</CardDescription>
                            </div>
                        </div>
                        <div data-chatbot-trigger>
                            <ArrowRight className="w-6 h-6 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                        </div>
                    </Card>
                    <Link href="/faq" className="block">
                        <Card className="h-full rounded-2xl p-8 flex items-center justify-between group hover:bg-secondary/80 hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-center gap-6">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <BookOpen className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Pro Tester FAQ</CardTitle>
                                    <CardDescription className="mt-1">Answers to common pro tester questions.</CardDescription>
                                </div>
                            </div>
                            <ArrowRight className="w-6 h-6 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                        </Card>
                    </Link>
                </section>

                <section className="mt-16">
                     <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold">Contact a Specialist Team</h2>
                        <p className="text-muted-foreground mt-2">Get in touch with the right team for your specific issue.</p>
                    </div>
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        {helpOptions.map(option => (
                            <Link key={option.title} href={`mailto:${option.contact}`}>
                                <Card className="h-full rounded-2xl p-6 text-center flex flex-col items-center group hover:-translate-y-1 transition-transform duration-300 hover:shadow-lg hover:shadow-primary/10">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110">
                                        {option.icon}
                                    </div>
                                    <CardHeader className="p-0">
                                        <CardTitle>{option.title}</CardTitle>
                                        <CardDescription className="mt-2">{option.description}</CardDescription>
                                    </CardHeader>
                                    <div className="mt-6 font-semibold text-primary flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> {option.contact}
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
        <SupportChatbot />
    </>
  );
}
