
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, FlaskConical, CheckCircle2, Coins, PlusCircle, Gem, ArrowRight, ArrowLeft, Expand, X, PlayCircle, ChevronDown } from 'lucide-react'
import { ProjectList } from '@/components/project-list';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { processSteps } from '@/lib/data.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export default function DashboardPage() {
  const [modalStep, setModalStep] = useState<'guide' | 'form'>('guide');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state on close
      setTimeout(() => {
        setModalStep('guide');
        setFullscreenImage(null);
      }, 200); 
    }
    setIsDialogOpen(open);
  };

  return (
    <>
      <div className="min-h-screen bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Manage your apps and testing projects.</p>
            </div>
            <div className='flex items-center gap-2'>
              <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New App</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0">
                  {modalStep === 'guide' ? (
                    <>
                      <DialogHeader className="p-6 border-b shrink-0">
                          <DialogTitle className="text-2xl font-bold">Get Your App Tested</DialogTitle>
                           <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close</span>
                          </DialogClose>
                      </DialogHeader>
                      <div className="flex-grow overflow-y-auto px-6 py-6 space-y-8 min-h-0">
                        <div className="relative group rounded-xl overflow-hidden shadow-lg">
                           <Image 
                              src="https://images.unsplash.com/photo-1516116216624-53e697320f64?q=80&w=800&auto=format=fit=crop" 
                              alt="Video walkthrough thumbnail" 
                              width={800} 
                              height={450}
                              className="w-full h-auto object-cover"
                              data-ai-hint="code testing"
                            />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-6 flex flex-col justify-end">
                              <h3 className="font-bold text-lg text-white">Quick Walkthrough</h3>
                              <p className="text-white/80 text-sm mt-1 max-w-prose">This 2-minute video shows you everything from setting up your Google Play test track to submitting your app on TestTribe.</p>
                           </div>
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Button variant="ghost" className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 hover:text-white transition-transform duration-300 group-hover:scale-110">
                                <PlayCircle className="w-10 h-10" />
                                <span className="sr-only">Watch the 2-min Guide</span>
                              </Button>
                           </div>
                        </div>
                          
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-start">
                          {processSteps.map((item, index) => (
                              <div key={index} className="bg-secondary/30 p-4 rounded-lg border">
                                  <div className="flex items-start gap-4">
                                      <div className="text-5xl font-bold text-primary/50">{index + 1}</div>
                                      <div className='flex-grow'>
                                          <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="item-1" className="border-b-0">
                                                <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline py-2 justify-between">
                                                  <div className="flex-grow">
                                                    <h3 className="font-semibold text-lg leading-tight">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground font-normal">{item.shortDescription}</p>
                                                  </div>
                                                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                                </AccordionTrigger>
                                                <AccordionContent className="space-y-4 pt-2">
                                                    <p className="text-muted-foreground whitespace-pre-line text-sm">{item.detailedDescription}</p>
                                                    <div 
                                                        className="relative w-full h-40 rounded-lg overflow-hidden group cursor-pointer"
                                                        onClick={() => setFullscreenImage(item.imageUrl)}
                                                    >
                                                        <Image src={item.imageUrl} data-ai-hint={item.dataAiHint} alt={item.title} layout="fill" objectFit="cover" />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Expand className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                          </Accordion>
                                      </div>
                                  </div>
                              </div>
                          ))}
                        </div>
                      </div>
                       <DialogFooter className="p-6 border-t bg-background shrink-0">
                          <Button onClick={() => setModalStep('form')} className="w-full sm:w-auto">
                              Get Started <ArrowRight className="ml-2"/>
                          </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <div className="flex flex-col h-full">
                      <DialogHeader className="p-6 border-b shrink-0">
                          <DialogTitle className="text-2xl font-bold">Submit Your App Details</DialogTitle>
                          <DialogDescription>
                              Fill in the information below. You can edit these details later.
                          </DialogDescription>
                           <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close</span>
                          </DialogClose>
                      </DialogHeader>
                      <div className="flex-grow py-6 space-y-6 overflow-y-auto px-6">
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
                      </div>
                      <DialogFooter className="p-6 border-t bg-background shrink-0 flex justify-between w-full">
                          <Button variant="ghost" onClick={() => setModalStep('guide')}><ArrowLeft className="mr-2 h-4 w-4"/> Back to Guide</Button>
                          <Button type="submit" className="px-8">Submit App</Button>
                      </DialogFooter>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Button variant="outline" asChild>
                  <Link href="/pricing">
                      <Gem className="mr-2 h-4 w-4" /> Add More Points
                  </Link>
              </Button>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Apps
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  Across all your projects
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Testing
                </CardTitle>
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  Currently being tested by the community
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Finished testing cycles
                </p>
              </CardContent>
            </Card>
             <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Points
                </CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250</div>
                <p className="text-xs text-muted-foreground">
                  Your current point balance
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
              <ProjectList />
          </div>
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
                className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/20 h-10 w-10 rounded-full"
                onClick={() => setFullscreenImage(null)}
            >
                <X className="w-6 h-6" />
                <span className="sr-only">Close</span>
            </Button>
            <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
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
  )
}
