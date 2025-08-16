
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
    <Card className="flex flex-col justify-between bg-card rounded-xl w-[350px] h-[260px] mx-4 flex-shrink-0 relative overflow-hidden">
         <Quote className="absolute -top-2 -left-2 w-20 h-20 text-primary/5" />
        <CardHeader className="z-10">
            <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.dataAiHint} />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-base">{testimonial.name}</CardTitle>
                <CardDescription>{testimonial.role}</CardDescription>
            </div>
            </div>
        </CardHeader>
        <CardContent className="z-10 flex-grow">
            <p className="text-muted-foreground">&ldquo;{testimonial.comment}&rdquo;</p>
        </CardContent>
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
