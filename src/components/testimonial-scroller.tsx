
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
