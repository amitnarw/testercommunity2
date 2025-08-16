
'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Testimonial } from '@/lib/types';
import { Quote } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="bg-card rounded-xl w-[450px] h-[220px] mx-4 flex-shrink-0 overflow-hidden relative p-6 flex items-center">
      <Quote className="absolute -top-2 -left-2 w-20 h-20 text-primary/10" />
      <div className="flex-grow pr-4 z-10">
        <p className="text-sm text-muted-foreground line-clamp-5 mb-4">&ldquo;{testimonial.comment}&rdquo;</p>
        <p className="text-xs font-semibold">{testimonial.name} <span className="text-muted-foreground font-normal">| {testimonial.role}</span></p>
      </div>
      <div className="flex-shrink-0">
        <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
          <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.dataAiHint} className="object-cover" />
          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </Card>
  );
}

const HorizontalLooper = ({ children, speed, reversed = false }: { children: React.ReactNode, speed: number, reversed?: boolean }) => {
    const mainRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!mainRef.current || !contentRef.current) return;
        
        const contentWidth = contentRef.current.offsetWidth / 2;
        gsap.set(contentRef.current, { xPercent: -50, x: 0 });

        const tl = gsap.timeline();
        
        tl.to(contentRef.current, {
            x: reversed ? contentWidth : -contentWidth,
            duration: speed,
            ease: "linear",
            repeat: -1,
        });

    }, { scope: mainRef });

    return (
        <div className="relative w-full overflow-hidden" ref={mainRef}>
            <div className="flex" ref={contentRef}>
                {children}
                {children}
            </div>
        </div>
    );
};

interface TestimonialScrollerProps {
    testimonials: Testimonial[];
}

export function TestimonialScroller({ testimonials }: TestimonialScrollerProps) {
    
    const cards = testimonials.map((testimonial, index) => (
        <TestimonialCard key={index} testimonial={testimonial} />
    ));
    
    return (
        <div className="w-full">
            <div className="flex flex-col gap-4">
               <HorizontalLooper speed={40} reversed={false}>
                    {cards}
                </HorizontalLooper>
                <HorizontalLooper speed={40} reversed={true}>
                    {cards}
                </HorizontalLooper>
            </div>
        </div>
    );
}
