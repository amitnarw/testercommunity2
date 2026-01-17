"use client";

import { Accordion } from "@/components/ui/accordion";
import FaqItem from "./faq-item";

const faqs = [
  {
    question:
      "What's the difference between the Community and Professional Paths?",
    answer:
      "The Community Path is a free, reciprocal model where you test other members' apps to earn points, which you then use to get your own app tested. The Professional Path allows you to purchase points to hire our team of vetted, professional testers for a guaranteed, managed testing experience.",
  },
  {
    question: "How does the points system work?",
    answer:
      "Points are our platform's currency. You can either earn them for free by testing apps in the Community Hub, or purchase them directly. You then spend these points to get your own app tested, either by the community or by our professional team.",
  },
  {
    question: "Is the Community Path really free?",
    answer:
      "Yes! It's free in terms of money, but it requires your time and effort to test other apps. It's a 'give-to-get' model that helps everyone meet Google's testing requirements.",
  },
  {
    question: "Why should I choose the Professional Path?",
    answer:
      "Choose the Professional Path if you're on a tight deadline, need guaranteed high-quality feedback, or simply don't have the time to test other apps. It's the fastest and most hassle-free way to get your app ready for the Play Store.",
  },
];

export function FaqSection() {
  return (
    <Accordion
      data-loc="FaqSection"
      type="single"
      collapsible
      className="w-full space-y-2"
    >
      {faqs.map((faq, i) => (
        <FaqItem
          key={i}
          index={i}
          question={faq.question}
          answer={faq.answer}
        />
      ))}
    </Accordion>
  );
}
