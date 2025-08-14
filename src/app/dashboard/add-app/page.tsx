
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, Expand, X, PlayCircle, ChevronDown } from 'lucide-react'
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { processSteps } from '@/lib/data.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AddAppPage() {
  const [step, setStep] = useState<'guide' | 'form'>('guide');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12">
           <header className="mb-8 max-w-4xl mx-auto">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
              </Button>
              <h1 className="text-4xl font-bold">Submit a New App</h1>
              <p className="text-muted-foreground mt-2">
                {step === 'guide' 
                    ? "Follow this simple guide to prepare and submit your app for testing." 
                    : "Fill in your app's details. You can edit this information later."
                }
              </p>
           </header>

          <main className="max-w-4xl mx-auto">
             {step === 'guide' ? (
                <div className="space-y-8">
                    <div className="relative group rounded-xl overflow-hidden shadow-lg border">
                        <Image 
                            src="https://images.unsplash.com/photo-1516116216624-53e697320f64?q=80&w=800&auto=format=fit=crop" 
                            alt="Video walkthrough thumbnail" 
                            width={800} 
                            height={450}
                            className="w-full h-auto object-cover"
                            data-ai-hint="code testing"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                            <h3 className="font-bold text-2xl text-white">Quick Walkthrough</h3>
                            <p className="text-white/80 text-sm mt-1 max-w-prose">This 2-minute video shows you everything from setting up your Google Play test track to submitting your app on TestTribe.</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Button variant="ghost" className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 hover:text-white transition-transform duration-300 group-hover:scale-110">
                                <PlayCircle className="w-12 h-12" />
                                <span className="sr-only">Watch the 2-min Guide</span>
                            </Button>
                        </div>
                    </div>
                      
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      {processSteps.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="bg-secondary/30 rounded-xl border overflow-hidden">
                           <AccordionTrigger className="p-6 text-left hover:no-underline">
                              <div className="flex items-start gap-6">
                                  <span className="text-6xl font-black text-primary/20 leading-none">0{index + 1}</span>
                                  <div>
                                      <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                                       <p className="text-muted-foreground text-sm text-left">{item.shortDescription}</p>
                                  </div>
                              </div>
                               <ChevronDown className="h-6 w-6 shrink-0 transition-transform duration-200" />
                           </AccordionTrigger>
                           <AccordionContent className="px-6 pb-6">
                              <div className="flex flex-col md:flex-row gap-6 items-start">
                                  <div className="flex-1 space-y-4">
                                     <p className="text-muted-foreground whitespace-pre-line">{item.detailedDescription}</p>
                                  </div>
                                  <div className="w-full md:w-64 flex-shrink-0">
                                      <div 
                                          className="relative w-full h-48 rounded-lg overflow-hidden group cursor-pointer"
                                          onClick={() => setFullscreenImage(item.imageUrl)}
                                      >
                                          <Image src={item.imageUrl} data-ai-hint={item.dataAiHint} alt={item.title} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Expand className="w-8 h-8 text-white" />
                                          </div>
                                      </div>
                                  </div>
                              </div>
                           </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    <div className="pt-6 border-t flex justify-end">
                      <Button onClick={() => setStep('form')} size="lg">
                          Get Started <ArrowRight className="ml-2"/>
                      </Button>
                    </div>
                </div>
             ) : (
                <Card className="rounded-xl">
                    <CardContent className="p-6 space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">App Name</Label>
                                <Input id="name" placeholder="E.g., Project Phoenix" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">Testing URL</Label>
                                <Input id="url" placeholder="https://example.com/test-build" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="icon">App Icon URL</Label>
                            <Input id="icon" placeholder="https://example.com/icon.png" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instructions">Test Credentials & Instructions</Label>
                            <Textarea id="instructions" placeholder="e.g., Use user: demo@test.com, pass: 1234. Focus on the new checkout flow." className="min-h-[120px]" />
                        </div>
                    </CardContent>
                    <CardHeader className="p-6 pt-0 flex flex-row justify-between items-center border-t">
                        <Button variant="ghost" onClick={() => setStep('guide')}><ArrowLeft className="mr-2 h-4 w-4"/> Back to Guide</Button>
                        <Button type="submit" size="lg">Submit App</Button>
                    </CardHeader>
                </Card>
             )}
          </main>
        </div>
      </div>
      {fullscreenImage && (
        <div 
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
            onClick={() => setFullscreenImage(null)}
        >
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/20 h-12 w-12 rounded-full"
                onClick={() => setFullscreenImage(null)}
            >
                <X className="w-8 h-8" />
                <span className="sr-only">Close</span>
            </Button>
            <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
                <Image 
                    src={fullscreenImage} 
                    alt="Fullscreen view" 
                    layout="fill" 
                    objectFit="contain" 
                    className="animate-in zoom-in-95"
                />
            </div>
        </div>
      )}
    </>
  );
}
