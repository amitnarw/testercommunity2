
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Testimonial } from '@/lib/types';
import { testimonials } from '@/lib/data';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const sampleTestimonial = testimonials[0];

export function TestimonialCardShowcase() {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Design 1: Minimalist */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-center">1. Minimalist</h3>
        <Card className="flex flex-col justify-between bg-card rounded-xl w-full h-full">
            <CardHeader>
                <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={sampleTestimonial.avatar} data-ai-hint={sampleTestimonial.dataAiHint} />
                    <AvatarFallback>{sampleTestimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-base">{sampleTestimonial.name}</CardTitle>
                    <CardDescription>{sampleTestimonial.role}</CardDescription>
                </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">&ldquo;{sampleTestimonial.comment}&rdquo;</p>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
      </div>

      {/* Design 2: Glassmorphic */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-center">2. Glassmorphic</h3>
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Card className="flex flex-col justify-between bg-background/50 backdrop-blur-lg border-white/20 rounded-xl w-full h-full">
                <CardHeader>
                    <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={sampleTestimonial.avatar} data-ai-hint={sampleTestimonial.dataAiHint} />
                        <AvatarFallback>{sampleTestimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-base">{sampleTestimonial.name}</CardTitle>
                        <CardDescription>{sampleTestimonial.role}</CardDescription>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">&ldquo;{sampleTestimonial.comment}&rdquo;</p>
                </CardContent>
                <CardFooter></CardFooter>
            </Card>
        </div>
      </div>
      
      {/* Design 3: Quotable */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-center">3. Quotable</h3>
        <Card className="flex flex-col justify-between bg-card rounded-xl w-full h-full relative overflow-hidden">
            <Quote className="absolute -top-4 -left-4 w-24 h-24 text-primary/10" />
            <CardHeader className="z-10">
                <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={sampleTestimonial.avatar} data-ai-hint={sampleTestimonial.dataAiHint} />
                    <AvatarFallback>{sampleTestimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-base">{sampleTestimonial.name}</CardTitle>
                    <CardDescription>{sampleTestimonial.role}</CardDescription>
                </div>
                </div>
            </CardHeader>
            <CardContent className="z-10">
                <p className="text-muted-foreground">&ldquo;{sampleTestimonial.comment}&rdquo;</p>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
      </div>

      {/* Design 4: Accent */}
       <div className="space-y-2">
        <h3 className="text-lg font-semibold text-center">4. Accent</h3>
        <Card className="flex flex-col justify-between bg-card rounded-xl w-full h-full p-0 overflow-hidden">
            <div className="flex h-full">
                <div className="w-2 bg-primary h-full"></div>
                <div className="p-6 flex flex-col justify-between">
                    <CardHeader className="p-0">
                        <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={sampleTestimonial.avatar} data-ai-hint={sampleTestimonial.dataAiHint} />
                            <AvatarFallback>{sampleTestimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base">{sampleTestimonial.name}</CardTitle>
                            <CardDescription>{sampleTestimonial.role}</CardDescription>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 mt-4">
                        <p className="text-muted-foreground">&ldquo;{sampleTestimonial.comment}&rdquo;</p>
                    </CardContent>
                </div>
            </div>
        </Card>
      </div>

      {/* Design 5: Inverted */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-center">5. Inverted</h3>
        <Card className="flex flex-col justify-between bg-foreground text-background rounded-xl w-full h-full overflow-hidden">
            <CardContent className="p-6">
                <p className="text-background/80">&ldquo;{sampleTestimonial.comment}&rdquo;</p>
            </CardContent>
            <CardFooter className="bg-background text-foreground p-4">
                 <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={sampleTestimonial.avatar} data-ai-hint={sampleTestimonial.dataAiHint} />
                        <AvatarFallback>{sampleTestimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-base font-bold">{sampleTestimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{sampleTestimonial.role}</p>
                    </div>
                </div>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
