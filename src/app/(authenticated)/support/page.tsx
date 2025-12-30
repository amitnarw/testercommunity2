
'use client';

import { Accordion } from "@/components/ui/accordion";
import { FaqSection } from "@/components/faq-section";
import { Button } from "@/components/ui/button";
import { LifeBuoy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SupportChatbot } from "@/components/support-chatbot";

export default function SupportPage() {
    return (
        <>
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold">Support Center</h1>
                    <p className="mt-4 text-muted-foreground">
                        Answers and help for our developer community.
                    </p>
                </div>

                <div className="mt-12 max-w-4xl mx-auto">
                    <FaqSection />
                </div>

                <div className="mt-20 text-center bg-secondary/50 p-10 rounded-2xl max-w-4xl mx-auto">
                    <LifeBuoy className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Still have questions?</h3>
                    <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                        Can't find the answer you're looking for? Chat with our AI assistant or contact our support team.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button data-chatbot-trigger>
                            Chat with Alex <ArrowRight className="ml-2" />
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="mailto:support@inTesters.com">Email Support</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <SupportChatbot />
        </>
    );
}
