
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
    <Card className="bg-card rounded-xl w-[450px] h-[260px] mx-4 flex-shrink-0 overflow-hidden">
        <div className="flex h-full">
            <div className="flex flex-col p-6 relative flex-grow">
                <Quote className="absolute -top-2 -left-2 w-20 h-20 text-primary/10" />
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex-grow">
                        <p className="text-muted-foreground line-clamp-5">&ldquo;{testimonial.comment}&rdquo;</p>
                    </div>
                    <div className="mt-4">
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                </div>
            </div>
            <div className="w-[40%] flex-shrink-0">
                 <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.dataAiHint} className="object-cover" />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
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
