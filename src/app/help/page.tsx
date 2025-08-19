
'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Bot, DollarSign, LifeBuoy, Mail } from "lucide-react";
import Link from "next/link";
import { SupportChatbot } from "@/components/support-chatbot";

const helpOptions = [
    {
        icon: <LifeBuoy className="w-8 h-8 text-primary" />,
        title: "Technical Support",
        description: "Encountering a bug, having trouble with a submission, or need help with our API? Our tech team is on standby.",
        contact: "support@inTesters.com",
    },
    {
        icon: <DollarSign className="w-8 h-8 text-primary" />,
        title: "Billing Questions",
        description: "Need help with an invoice, have questions about our point packages, or need to manage your subscription? Let us know.",
        contact: "billing@inTesters.com",
    },
    {
        icon: <Mail className="w-8 h-8 text-primary" />,
        title: "General Inquiries",
        description: "Have a general question about how inTesters works, our community, or partnerships? We're here to chat.",
        contact: "info@inTesters.com",
    },
]

export default function HelpPage() {
  return (
    <>
        <div className="bg-secondary/50">
            <div className="container mx-auto px-4 md:px-6 py-20">
                <section className="text-center max-w-3xl mx-auto">
                    <LifeBuoy className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h1 className="text-4xl md:text-6xl font-bold">How can we help?</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        We're here to assist you with any questions or issues you might have. Choose the option that best fits your needs.
                    </p>
                </section>

                 <section className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
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
                         {/* This button will be handled by the chatbot component itself */}
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
                                    <CardTitle>Check our FAQ</CardTitle>
                                    <CardDescription className="mt-1">Many common questions are already answered.</CardDescription>
                                </div>
                            </div>
                            <ArrowRight className="w-6 h-6 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                        </Card>
                    </Link>
                </section>

                <section className="mt-16">
                     <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold">Prefer to email us?</h2>
                        <p className="text-muted-foreground mt-2">We'll get back to you as soon as possible.</p>
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
