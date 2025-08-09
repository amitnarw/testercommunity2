
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
    {
        question: "When should I choose Pro testing over Community testing?",
        answer: "Choose Pro testing when you have a critical deadline, need specialized skills (like security or performance testing), or simply don't have the time for community testing. It's the best option for commercial projects, pre-launch audits, and when you need guaranteed, expert-level QA."
    }
]

export function FaqSection() {
    return (
        <section id="faq" className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
                    <p className="mt-4 text-muted-foreground">
                        Have questions? We have answers. Here are some common questions about how TestTribe works.
                    </p>
                </div>

                <div className="mt-12 max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, i) => (
                             <AccordionItem key={i} value={`item-${i}`}>
                                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
