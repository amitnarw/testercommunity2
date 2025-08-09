
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Testimonial } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="flex flex-col justify-between bg-foreground text-background rounded-xl w-[350px] mx-4 flex-shrink-0 overflow-hidden">
        <CardContent className="p-6">
            <p className="text-background/80">&ldquo;{testimonial.comment}&rdquo;</p>
        </CardContent>
        <CardFooter className="bg-background text-foreground p-4">
             <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.dataAiHint} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-base font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
            </div>
        </CardFooter>
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
