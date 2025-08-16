
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { LifeBuoy, ArrowRight } from "lucide-react";
import Link from "next/link";

const generalFaqs = [
    {
        question: "What is inTesters?",
        answer: "inTesters is a platform designed to help Android developers meet the Google Play Store's requirement of having their app tested by 12+ people for 14 days. We offer two paths: a free, community-driven approach and a paid, professional service."
    },
    {
        question: "Who is inTesters for?",
        answer: "inTesters is for any Android developer, from solo indie devs to large companies, who need to fulfill Google's pre-launch testing requirements quickly and efficiently."
    },
     {
        question: "How do I get started?",
        answer: "Just sign up for a free account! From there, you can choose your path. You can start testing other apps to earn points right away via the Community Hub, or you can purchase points and submit your app for professional testing via the Developer Dashboard."
    }
];

const communityFaqs = [
    {
        question: "How does the 'Community Path' work?",
        answer: "It's a reciprocal ecosystem. You test apps submitted by other community members on your Android devices. For each valid bug or feedback you provide, you earn points. You can then spend these points to have the community test your own app."
    },
    {
        question: "Is the Community Path really free?",
        answer: "Yes, in terms of money. It requires your time and effort to test other apps, which is how you contribute to the community and earn your own testing credits (points). It's a 'give-to-get' model."
    },
    {
        question: "What kind of feedback can I expect from the community?",
        answer: "You'll receive feedback from a diverse range of real users on real devices. This often uncovers usability issues, device-specific bugs, and general feedback that you might not find in a controlled environment."
    }
];

const proFaqs = [
    {
        question: "What is the 'Professional Path'?",
        answer: "On this path, you use points (which can be purchased) to have your app tested by our team of vetted, professional QA testers. We manage the entire process to ensure you get high-quality, structured feedback and meet the 14-day testing requirement without any hassle."
    },
    {
        question: "When should I choose the Professional Path?",
        answer: "Choose the Pro path when you have a critical deadline, need guaranteed test completion, or simply don't have time for community testing. It's the fastest and most reliable way to get your app ready for launch."
    },
    {
        question: "How are points used for the Professional Path?",
        answer: "You can purchase points directly from our website. Once you have enough points, you submit your app through the Developer Dashboard. We then assign our professional testers to your project. The points cover the entire service."
    }
];

export default function FaqPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-20">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h1>
                <p className="mt-4 text-muted-foreground">
                    Everything you need to know about inTesters. If you have more questions, feel free to reach out to our support team.
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
