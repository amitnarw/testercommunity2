
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, FlaskConical, CheckCircle2, Coins, PlusCircle, Gem, UploadCloud, PlayCircle, Users, Globe, FileCheck, Power, ArrowRight, ArrowLeft } from 'lucide-react'
import { ProjectList } from '@/components/project-list';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

const processSteps = [
    { icon: <Users className="w-5 h-5" />, title: "Add Testers Group", description: "Invite your internal team or select from our community." },
    { icon: <Globe className="w-5 h-5" />, title: "Enable Global Testing", description: "Optionally, open your app to a wider global audience." },
    { icon: <FileCheck className="w-5 h-5" />, title: "Submit for Review", description: "Our team will quickly review your app for readiness." },
    { icon: <Power className="w-5 h-5" />, title: "Activate Testing", description: "Once approved, your testing cycle begins immediately." },
]

export default function DashboardPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your apps and testing projects.</p>
          </div>
          <div className='flex items-center gap-2'>
            <Dialog onOpenChange={() => setStep(1)}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New App</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-5xl p-0 h-[600px] flex">
                  {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 w-full">
                        <div className="relative bg-secondary/50 p-8 flex flex-col items-center justify-center rounded-l-lg">
                           <div className="relative w-full h-64 rounded-lg overflow-hidden group">
                             <Image src="https://placehold.co/800x600.png" data-ai-hint="video player" alt="Video guide thumbnail" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <PlayCircle className="w-20 h-20 text-white/70 group-hover:text-white transition-colors" />
                             </div>
                           </div>
                           <h3 className="text-xl font-bold mt-6">How to Add Your App</h3>
                           <p className="text-muted-foreground text-center mt-2">Watch this quick guide to learn how to set up your project for testing success.</p>
                        </div>
                        <div className="p-12 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-6">Your Path to a Bug-Free App</h3>
                                <div className="space-y-5">
                                    {processSteps.map((item, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{item.title}</h4>
                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-8 border-t pt-6">
                                <p className="text-xs text-muted-foreground mb-4">Confused? <Link href="/help" className="text-primary underline">Contact Support</Link></p>
                                <Button onClick={() => setStep(2)} className="w-full text-lg py-6">
                                    Get Started <ArrowRight className="ml-2"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="p-12 w-full flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold">Submit Your App Details</DialogTitle>
                            <DialogDescription>
                                Fill in the information below. You can edit these details later from your project dashboard.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-grow py-8 space-y-6">
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
                            <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
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
  )
}
