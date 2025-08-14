
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, FlaskConical, CheckCircle2, Coins, PlusCircle, Gem, UploadCloud, PlayCircle, Users, Globe, FileCheck, Power, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react'
import { ProjectList } from '@/components/project-list';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { processSteps } from '@/lib/data.tsx';


export default function DashboardPage() {
  const [modalStep, setModalStep] = useState(1);
  const [selectedStep, setSelectedStep] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your apps and testing projects.</p>
          </div>
          <div className='flex items-center gap-2'>
            <Dialog onOpenChange={() => { setModalStep(1); setSelectedStep(0); }}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New App</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl p-0">
                  <AnimatePresence mode="wait">
                  {modalStep === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        <div className="p-8 md:p-12 w-full flex flex-col">
                            <DialogHeader className="text-center mb-8">
                                <DialogTitle className="text-3xl font-bold">Get Your App Tested</DialogTitle>
                                <DialogDescription>
                                    Follow this guide to prepare your app for our testing community.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="max-h-[70vh] overflow-y-auto pr-4">
                                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-8">
                                    <div className="text-center">
                                        <PlayCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                                        <p className="text-muted-foreground mt-2">Watch the Process Guide</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {processSteps.map((item, index) => (
                                        <div key={index} className="border rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => setSelectedStep(selectedStep === index ? null : index)}
                                                className="w-full text-left p-4 flex justify-between items-center bg-secondary/30 hover:bg-secondary/70 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-primary/10 text-primary p-2 rounded-lg">{item.icon}</div>
                                                    <span className="font-semibold">{item.title}</span>
                                                </div>
                                                <ChevronDown className={cn("transform transition-transform", selectedStep === index && "rotate-180")} />
                                            </button>
                                            <AnimatePresence>
                                                {selectedStep === index && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        className="bg-background"
                                                    >
                                                        <div className="p-6 grid md:grid-cols-2 gap-6 items-center">
                                                            <div className="space-y-4">
                                                                <p className="text-muted-foreground whitespace-pre-line">{item.detailedDescription}</p>
                                                                <Link href="/help" className="text-sm text-primary underline">Contact Support if you're confused</Link>
                                                            </div>
                                                            <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                                                                <Image src={item.imageUrl} data-ai-hint={item.dataAiHint} alt={item.title} layout="fill" objectFit="cover" />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <DialogFooter className="mt-8 pt-6 border-t">
                                <Button onClick={() => setModalStep(2)} className="w-full md:w-auto ml-auto text-lg py-6">
                                    Get Started <ArrowRight className="ml-2"/>
                                </Button>
                            </DialogFooter>
                        </div>
                    </motion.div>
                  ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                        <div className="p-12 w-full flex flex-col h-full">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-bold">Submit Your App Details</DialogTitle>
                                <DialogDescription>
                                    Fill in the information below. You can edit these details later from your project dashboard.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-grow py-8 space-y-6 max-h-[70vh] overflow-y-auto pr-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium">App Name</Label>
                                        <Input id="name" placeholder="E.g., Project Phoenix" className="h-12"/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="url" className="text-sm font-medium">Testing URL</Label>
                                        <Input id="url" placeholder="https://example.com/test-build" className="h-12"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="icon" className="text-sm font-medium">App Icon URL</Label>
                                    <Input id="icon" placeholder="https://example.com/icon.png" className="h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instructions" className="text-sm font-medium">Test Credentials & Instructions (Optional)</Label>
                                    <Textarea id="instructions" placeholder="e.g., Use user: demo@test.com, pass: 1234. Focus on the new checkout flow." className="min-h-[120px]" />
                                </div>
                            </div>
                            <DialogFooter className="mt-auto pt-6 border-t">
                                <Button variant="ghost" onClick={() => setModalStep(1)}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
                                <Button type="submit" className="px-8">Submit App</Button>
                            </DialogFooter>
                        </div>
                    </motion.div>
                  )}
                  </AnimatePresence>
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
  )
}
