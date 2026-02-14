"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Bot,
  DollarSign,
  LifeBuoy,
  Mail,
  Search,
} from "lucide-react";
import { SupportChatbot } from "@/components/support-chatbot";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/transition-link";

const helpOptions = [
  {
    icon: <LifeBuoy className="w-6 h-6" />,
    title: "Technical Support",
    description: "Bugs, glitches, or API help.",
    contact: "support@inTesters.com",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Billing & Plans",
    description: "Invoices, subscriptions, and points.",
    contact: "billing@inTesters.com",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "General Inquiries",
    description: "Partnerships and general questions.",
    contact: "info@inTesters.com",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function HelpPage() {
  return (
    <>
      <div className="min-h-screen relative overflow-hidden selection:bg-primary/20">
        {/* Ambient Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 py-20 relative z-10">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              24/7 Support Available
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              How can we help?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Find answers, chat with our AI assistant, or get in touch with our
              support team. We&apos;re here for you.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mt-10 group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-full p-2 transition-transform duration-300 group-hover:scale-[1.01]">
                <Search className="ml-4 w-6 h-6 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ask a question or search keywords..."
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-3 text-lg placeholder:text-muted-foreground/50"
                />
                <Button
                  size="lg"
                  className="rounded-full px-8 shadow-lg shadow-primary/25"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* AI Chat Card - Featured */}
            <div className="md:col-span-2 row-span-2 group">
              <Card className="h-full relative overflow-hidden border-border/50 bg-gradient-to-br from-secondary/50 to-primary/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 rounded-3xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-colors duration-500" />

                <div className="relative p-6 sm:p-10 h-full flex flex-col justify-between z-10">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Bot className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                      Chat with Alex
                    </CardTitle>
                    <CardDescription className="text-lg max-w-md">
                      Our advanced AI assistant can help you with 90% of common
                      queries instantly. No waiting required.
                    </CardDescription>
                  </div>

                  <div className="mt-10">
                    <div
                      data-chatbot-trigger
                      className="inline-flex items-center gap-2 text-primary font-semibold cursor-pointer group/btn"
                    >
                      Start a Conversation
                      <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute right-0 bottom-0 opacity-5 sm:opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4 group-hover:translate-x-10 group-hover:translate-y-10 transition-transform duration-700">
                  <Bot className="w-80 h-80" />
                </div>
              </Card>
            </div>

            {/* FAQ Card */}
            <TransitionLink
              href="/faq"
              className="block md:col-span-1 h-full group"
            >
              <Card className="h-full relative overflow-hidden border-border/50 bg-secondary dark:bg-secondary/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl rounded-3xl">
                <div className="p-8 h-full flex flex-col relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-bold mb-2">
                    Knowledge Base
                  </CardTitle>
                  <CardDescription>
                    Browse through our detailed guides and FAQs.
                  </CardDescription>

                  <div className="mt-auto pt-8 flex justify-end">
                    <div className="bg-background rounded-full p-2 border border-border group-hover:border-primary/50 transition-colors">
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </Card>
            </TransitionLink>

            {/* Quick Actions Grid */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {helpOptions.map((option, i) => (
                <TransitionLink
                  key={option.title}
                  href={`mailto:${option.contact}`}
                  className="group"
                >
                  <Card className="h-full border-border/50 bg-secondary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-2xl flex items-center p-3 sm:p-6">
                    <div
                      className={`${option.bg} ${option.color} p-4 rounded-xl mr-6 transition-transform duration-300 group-hover:rotate-6`}
                    >
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-2 line-clamp-1">
                        {option.description}
                      </p>
                      <span className="text-xs font-medium text-muted-foreground/80 bg-secondary px-2 py-1 rounded-md group-hover:bg-background transition-colors">
                        {option.contact}
                      </span>
                    </div>
                  </Card>
                </TransitionLink>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SupportChatbot />
    </>
  );
}
