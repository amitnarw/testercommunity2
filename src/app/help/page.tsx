
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Bot, DollarSign, LifeBuoy, Mail, MessageCircle, Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { SupportChatbot } from "@/components/support-chatbot";

const helpOptions = [
    {
        icon: <MessageCircle className="w-8 h-8 text-primary" />,
        title: "General Inquiries",
        description: "Have a general question about how inTesters works, our community, or partnerships? We're here to chat.",
        contact: "info@inTesters.com",
        contactType: "email",
    },
    {
        icon: <Bot className="w-8 h-8 text-primary" />,
        title: "Technical Support",
        description: "Encountering a bug, having trouble with a submission, or need help with our API? Our tech team is on standby.",
        contact: "support@inTesters.com",
        contactType: "email",
    },
    {
        icon: <DollarSign className="w-8 h-8 text-primary" />,
        title: "Billing Questions",
        description: "Need help with an invoice, have questions about our point packages, or need to manage your subscription? Let us know.",
        contact: "billing@inTesters.com",
        contactType: "email",
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

                <section className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {helpOptions.map(option => (
                        <Link key={option.title} href={`mailto:${option.contact}`}>
                            <Card className="h-full rounded-2xl p-6 text-center flex flex-col items-center group hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:shadow-primary/20">
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
                </section>

                <section className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Link href="/faq">
                        <Card className="h-full rounded-2xl p-8 flex items-center justify-between group hover:bg-secondary">
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
                    <Card className="rounded-2xl p-8 flex items-center justify-between bg-card">
                        <div className="flex items-center gap-6">
                            <div className="bg-primary/10 p-4 rounded-full">
                                    <LifeBuoy className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Connect with us</CardTitle>
                                <CardDescription className="mt-1">Follow us on our social channels.</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="#"><Twitter className="w-6 h-6 text-muted-foreground hover:text-primary" /></Link>
                            <Link href="#"><Linkedin className="w-6 h-6 text-muted-foreground hover:text-primary" /></Link>
                            <Link href="#"><Github className="w-6 h-6 text-muted-foreground hover:text-primary" /></Link>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
        <SupportChatbot />
    </>
  );
}
