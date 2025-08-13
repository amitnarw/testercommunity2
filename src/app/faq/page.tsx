
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { LifeBuoy, ArrowRight } from "lucide-react";
import Link from "next/link";

const generalFaqs = [
    {
        question: "What is TestTribe?",
        answer: "TestTribe is a dual-path platform for app testing. You can either harness the power of a global community to test your app for free, or hire vetted professional testers for guaranteed, high-quality results."
    },
    {
        question: "Who is TestTribe for?",
        answer: "TestTribe is for everyone involved in app development! This includes indie developers, startups, large enterprises, product managers, QA testers, and anyone who wants to build a high-quality, bug-free application."
    },
     {
        question: "How do I get started?",
        answer: "Just sign up for a free account! From there, you can choose your path. You can start testing other apps to earn points right away, or you can browse the marketplace to hire a professional for your project."
    }
];

const communityFaqs = [
    {
        question: "How does the 'Community Testing' path work?",
        answer: "It's a reciprocal ecosystem. You test apps submitted by other community members on your devices. For every valid bug you find, you earn points. You can then spend these points to have the community test your own app."
    },
    {
        question: "Is community testing really free?",
        answer: "Yes, in terms of money. It requires your time and effort to test other apps, which is how you contribute to the community and earn your own testing credits (points). It's a 'give-to-get' model."
    },
    {
        question: "What kind of feedback can I expect from the community?",
        answer: "You'll receive reports from a diverse range of real users on real devices. This often uncovers usability issues, device-specific bugs, and general feedback that you might not find in a controlled environment."
    }
];

const proFaqs = [
    {
        question: "Who are the professional testers?",
        answer: "Our Pro testers are experienced QA professionals who have been rigorously vetted by our team for their technical skills, attention to detail, and communication. You can view their profiles, skills, ratings, and work history in the Marketplace."
    },
    {
        question: "When should I choose the 'Pro Testing' path?",
        answer: "Choose the Pro path when you have a critical deadline, need specialized testing (like security, performance, or automation), or simply don't have time for community testing. It's ideal for commercial projects and pre-launch audits."
    },
    {
        question: "How does payment work for Pro testers?",
        answer: "You can hire testers on a fixed-project price or an hourly rate. All payments are handled securely through our platform. You fund a milestone, and the payment is only released to the tester when you approve their work."
    }
];

export default function FaqPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-20">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h1>
                <p className="mt-4 text-muted-foreground">
                    Everything you need to know about TestTribe. If you have more questions, feel free to reach out to our support team.
                </p>
            </div>

            <div className="mt-16 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">General</h2>
                <Accordion type="single" collapsible className="w-full">
                    {generalFaqs.map((faq, i) => (
                         <AccordionItem 
                            key={`general-${i}`} 
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

                <h2 className="text-2xl font-bold mb-6 mt-12">Community Path</h2>
                 <Accordion type="single" collapsible className="w-full">
                    {communityFaqs.map((faq, i) => (
                         <AccordionItem 
                            key={`community-${i}`}
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

                 <h2 className="text-2xl font-bold mb-6 mt-12">Professional Path</h2>
                 <Accordion type="single" collapsible className="w-full">
                    {proFaqs.map((faq, i) => (
                         <AccordionItem 
                            key={`pro-${i}`}
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
            </div>

            <div className="mt-20 text-center bg-secondary/50 p-10 rounded-2xl">
                <LifeBuoy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Still have questions?</h3>
                <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                    Can't find the answer you're looking for? Don't worry, our support team is here to help you with any questions you might have.
                </p>
                <div className="mt-6">
                    <Button asChild>
                        <Link href="/help">Contact Support <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
