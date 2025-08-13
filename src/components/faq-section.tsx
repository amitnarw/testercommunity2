
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const faqs = [
    {
        question: "What's the difference between Community and Pro testing?",
        answer: "Community testing is a free, reciprocal model where you test other members' apps to earn points, which you then use to get your own app tested. Pro testing allows you to directly hire our vetted, professional testers for a fee to get guaranteed, high-quality feedback without spending any time testing other apps."
    },
    {
        question: "How does the points system work?",
        answer: "You earn points for every valid bug you find and report in a community member's app. The number of points depends on the severity of the bug. You can then spend these points to submit your own app for testing by the community or even redeem them for discounts on Pro services."
    },
    {
        question: "Is community testing really free?",
        answer: "Yes! It's free in terms of money, but it requires your time and effort to test other apps. It's a 'give-to-get' model that fosters a strong community and helps everyone improve their apps."
    },
    {
        question: "Who are the professional testers?",
        answer: "Our Pro testers are experienced QA professionals who have been rigorously vetted by our team. They have a proven track record of finding critical bugs and providing high-quality, actionable feedback. You can view their profiles, skills, and ratings in the Marketplace."
    },
];

export function FaqSection() {
    return (
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
                 <AccordionItem 
                    key={i} 
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
    )
}
