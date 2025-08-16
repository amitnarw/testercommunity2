
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Testimonial } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="flex flex-col justify-between bg-card rounded-xl w-[400px] h-[260px] mx-4 flex-shrink-0 relative overflow-hidden p-6">
        <Quote className="absolute -top-2 -left-2 w-20 h-20 text-primary/10" />
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex-grow flex gap-6">
                <div className="flex-grow">
                    <p className="text-muted-foreground">&ldquo;{testimonial.comment}&rdquo;</p>
                </div>
                <Avatar className="w-20 h-20 flex-shrink-0 border-2 border-primary/20">
                    <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.dataAiHint} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="mt-4">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>
        </div>
    </Card>
  );
}


interface TestimonialScrollerProps {
    testimonials: Testimonial[];
}

export function TestimonialScroller({ testimonials }: TestimonialScrollerProps) {
    const duplicatedTestimonials = [...testimonials, ...testimonials];
    
    return (
        <div className="w-full overflow-hidden">
            <div className="flex flex-col gap-4">
                {/* Row 1: Left to Right */}
                <div className="relative w-full overflow-hidden">
                    <div className="flex animate-scroll-ltr">
                        {duplicatedTestimonials.map((testimonial, index) => (
                             <TestimonialCard key={`ltr-${index}`} testimonial={testimonial} />
                        ))}
                    </div>
                </div>

                {/* Row 2: Right to Left */}
                <div className="relative w-full overflow-hidden">
                     <div className="flex animate-scroll-rtl">
                        {duplicatedTestimonials.map((testimonial, index) => (
                            <TestimonialCard key={`rtl-${index}`} testimonial={testimonial} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
