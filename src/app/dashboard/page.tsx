
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, FlaskConical, CheckCircle2, Coins, PlusCircle, Gem, ArrowRight, ArrowLeft } from 'lucide-react'
import { ProjectList } from '@/components/project-list';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { processSteps } from '@/lib/data.tsx';


export default function DashboardPage() {
  const [modalStep, setModalStep] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Reset to step 1 whenever the dialog is opened
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setModalStep(1);
    }
    setIsDialogOpen(open);
  };

  return (
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
              <DialogContent className="sm:max-w-4xl max-h-[90vh] h-auto flex flex-col p-0">
                  <AnimatePresence mode="wait">
                  {modalStep === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col h-full"
                    >
                        <DialogHeader className="text-center px-6 pt-6 md:px-8 md:pt-8">
                            <DialogTitle className="text-3xl font-bold">Get Your App Tested</DialogTitle>
                            <DialogDescription>
                                Follow this guide to prepare your app for our testing community.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex-grow overflow-y-auto px-6 md:px-8 py-6 space-y-8">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                <p className="text-muted-foreground">Video Guide Placeholder</p>
                            </div>
                            
                            <div className="space-y-10">
                                {processSteps.map((item, index) => (
                                    <div key={index} className="grid md:grid-cols-2 gap-6 items-center">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 text-primary p-2 rounded-lg">{item.icon}</div>
                                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                            </div>
                                            <p className="text-muted-foreground whitespace-pre-line text-sm">{item.detailedDescription}</p>
                                            {index === 0 && <Link href="/help" className="text-sm text-primary underline">Contact Support if you're confused</Link>}
                                        </div>
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                                            <Image src={item.imageUrl} data-ai-hint={item.dataAiHint} alt={item.title} layout="fill" objectFit="cover" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="mt-auto p-6 md:p-8 border-t bg-background sticky bottom-0">
                            <Button onClick={() => setModalStep(2)} className="w-full md:w-auto ml-auto text-lg py-6">
                                Get Started <ArrowRight className="ml-2"/>
                            </Button>
                        </DialogFooter>
                    </motion.div>
                  ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.3 }}
                         className="flex flex-col h-full"
                    >
                        <DialogHeader className="px-6 pt-6 md:px-8 md:pt-8">
                            <DialogTitle className="text-3xl font-bold">Submit Your App Details</DialogTitle>
                            <DialogDescription>
                                Fill in the information below. You can edit these details later.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-grow py-8 space-y-6 overflow-y-auto px-6 md:px-8">
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
                        <DialogFooter className="mt-auto p-6 md:p-8 border-t bg-background sticky bottom-0">
                            <Button variant="ghost" onClick={() => setModalStep(1)}><ArrowLeft className="mr-2 h-4 w-4"/> Back to Guide</Button>
                            <Button type="submit" className="px-8">Submit App</Button>
                        </DialogFooter>
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
