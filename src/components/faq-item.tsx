import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const FaqItem = ({
  index,
  question,
  answer,
}: {
  index: number;
  question: string;
  answer: string;
}) => {
  return (
    <AccordionItem
      key={index}
      value={`item-${index}`}
      className="rounded-2xl px-4 sm:px-6 data-[state=open]:border-primary/50 transition-all duration-300 border border-border/50 shadow-sm bg-gray-100/40 hover:bg-gray-100 dark:bg-gray-800/30 hover:dark:bg-gray-800/60"
    >
      <AccordionTrigger className="text-md sm:text-lg font-medium py-4 sm:py-6 hover:no-underline hover:text-primary transition-colors">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-6 leading-relaxed">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FaqItem;
