"use client";

import { motion } from "framer-motion";
import {
    LifeBuoy,
    MessageSquare,
    Bot,
    Mail,
    FileText,
    DollarSign,
    Shield,
    ArrowRight,
    HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SupportChatbot } from "@/components/support-chatbot";

const helpOptions = [
    {
        title: "Project Support",
        description: "Issues with a specific project, build, or instructions? Contact our project management team.",
        icon: LifeBuoy,
        contact: "pro-support@inTesters.com",
        href: "mailto:pro-support@inTesters.com",
        color: "from-blue-600 to-indigo-600",
        textColor: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-500/10 dark:bg-blue-500/10",
    },
    {
        title: "Payment Support",
        description: "Questions about your earnings, payout status, or payment methods? Our finance team can help.",
        icon: DollarSign,
        contact: "pro-billing@inTesters.com",
        href: "mailto:pro-billing@inTesters.com",
        color: "from-emerald-500 to-teal-600",
        textColor: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-500/10 dark:bg-emerald-500/10",
    },
    {
        title: "General Inquiries",
        description: "Have a general question about our professional program, NDAs, or something else? We're here to chat.",
        icon: Mail,
        contact: "pro-info@inTesters.com",
        href: "mailto:pro-info@inTesters.com",
        color: "from-purple-500 to-pink-600",
        textColor: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-500/10 dark:bg-purple-500/10",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.23, 1, 0.32, 1],
        },
    },
};

export default function ProfessionalSupportPage() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
            {/* Subtle Background Mesh */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--muted)/0.5)_0%,hsl(var(--background))_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

            <main className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-6xl relative z-10 w-full">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-16"
                >
                    {/* Header Section */}
                    <motion.div variants={itemVariants} className="text-center space-y-6 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                            <Shield className="w-3.5 h-3.5" />
                            Professional Tester Support
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.9] text-foreground">
                            We're here to help <br />
                            <span className="text-muted-foreground italic">you succeed.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Dedicated priority support channels for our certified professional testers.
                        </p>
                    </motion.div>

                    {/* Quick Actions Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Chat with Alex */}
                        <div className="group relative rounded-[2.5rem] p-8 bg-card dark:bg-zinc-900/40 border border-border dark:border-white/[0.05] hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-lg dark:shadow-none overflow-hidden" data-chatbot-trigger>
                            <div className="absolute top-0 right-0 p-8 opacity-50 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex flex-col h-full justify-between gap-8">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Bot className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">Chat with Alex</h3>
                                    <p className="text-muted-foreground mt-2 font-medium">Get instant answers 24/7 from our advanced AI support assistant.</p>
                                </div>
                            </div>
                        </div>

                        {/* Pro FAQ */}
                        <Link href="/faq" className="group relative rounded-[2.5rem] p-8 bg-card dark:bg-zinc-900/40 border border-border dark:border-white/[0.05] hover:border-primary/50 transition-all shadow-sm hover:shadow-lg dark:shadow-none overflow-hidden block">
                            <div className="absolute top-0 right-0 p-8 opacity-50 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex flex-col h-full justify-between gap-8">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <FileText className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">Pro Tester FAQ</h3>
                                    <p className="text-muted-foreground mt-2 font-medium">Curated answers to common questions about payments, NDAs, and testing cycles.</p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Specialist Teams */}
                    <motion.div variants={itemVariants} className="space-y-10">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">Contact Specialist Teams</h2>
                            <p className="text-muted-foreground text-sm font-medium">Direct lines to the departments you need.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {helpOptions.map((option) => (
                                <Link
                                    key={option.title}
                                    href={option.href}
                                    className="group relative rounded-[2rem] p-8 bg-card dark:bg-zinc-900/20 border border-border dark:border-white/[0.05] hover:bg-muted/50 dark:hover:bg-zinc-900/40 transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none"
                                >
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", option.bgColor, option.textColor)}>
                                        <option.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{option.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                        {option.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>Email Support</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </main>

            <SupportChatbot />
        </div>
    );
}
