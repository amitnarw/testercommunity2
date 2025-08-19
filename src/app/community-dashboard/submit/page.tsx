
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Rocket, Search, Send, FileCheck, PartyPopper, ArrowRight } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';

const submissionSchema = z.object({
    appName: z.string().min(3, "App name must be at least 3 characters."),
    appLink: z.string().url("Please enter a valid Google Play testing URL."),
    appDesc: z.string().min(50, "Please provide a detailed description of at least 50 characters."),
    category: z.string({ required_error: "Please select a category."}),
    androidVersion: z.string().min(1, "Please specify the minimum Android version."),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

const ProcessStep = ({ icon, title, description, isLast = false }: { icon: React.ReactNode, title: string, description: string, isLast?: boolean }) => (
    <div className="flex items-start gap-4 relative">
        <div className="flex-shrink-0 z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {icon}
            </div>
        </div>
        <div>
            <h4 className="font-bold text-lg">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {!isLast && <div className="absolute left-[22px] top-12 h-full w-0.5 bg-border -z-0"></div>}
    </div>
);

const SubmissionGuide = ({ onGetStarted }: { onGetStarted: () => void }) => (
    <div className="max-w-3xl mx-auto space-y-8">
        <Card className="rounded-xl">
            <CardHeader>
                <CardTitle>The Road to Launch</CardTitle>
                <CardDescription>Follow these simple steps to get your app tested by the community.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <ProcessStep 
                    icon={<Send className="w-6 h-6" />}
                    title="1. Submission"
                    description="You fill out the form with your app's details and testing instructions."
                />
                <ProcessStep 
                    icon={<Search className="w-6 h-6" />}
                    title="2. Review"
                    description="Our team quickly reviews your submission to ensure it's ready for the community."
                />
                <ProcessStep 
                    icon={<FileCheck className="w-6 h-6" />}
                    title="3. Approval & Points"
                    description="We approve your app and assign a fair point reward for testers based on its complexity."
                />
                <ProcessStep 
                    icon={<Rocket className="w-6 h-6" />}
                    title="4. Launch!"
                    description="Your app goes live in the Community Hub, ready for testers to provide valuable feedback."
                    isLast={true}
                />
            </CardContent>
        </Card>
        <div className="pt-6 flex justify-end">
            <Button onClick={onGetStarted} size="lg">
                Get Started <ArrowRight className="ml-2" />
            </Button>
        </div>
    </div>
);


const SubmissionForm = ({ onBack }: { onBack: () => void }) => {
     const form = useForm<SubmissionFormData>({
        resolver: zodResolver(submissionSchema),
        mode: 'onBlur',
    });

    const onSubmit = (data: SubmissionFormData) => {
        console.log("Form submitted:", data);
        // Here you would typically handle the form submission, e.g., send to a server.
        alert("App submitted successfully! (Check console for data)");
    }
    
    return (
        <div className="max-w-3xl mx-auto">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle>App Information</CardTitle>
                            <CardDescription>Provide the basic details about your application.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="appName"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="appName">App Name</Label>
                                        <FormControl>
                                            <Input id="appName" placeholder="e.g., PhotoSnap Editor" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="appLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="appLink">Google Play Testing Link</Label>
                                        <FormControl>
                                            <Input id="appLink" placeholder="https://play.google.com/apps/testing/..." {...field} />
                                        </FormControl>
                                            <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle>Testing Details</CardTitle>
                            <CardDescription>Give our testers the context they need to provide great feedback.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                                <FormField
                                control={form.control}
                                name="appDesc"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label htmlFor="appDesc">Description & Instructions for Testers</Label>
                                        <FormControl>
                                            <Textarea id="appDesc" placeholder="Describe your app and any specific areas or features you want testers to focus on." className="min-h-[120px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Category</Label>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="rounded-xl">
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Games">Games</SelectItem>
                                                    <SelectItem value="Productivity">Productivity</SelectItem>
                                                    <SelectItem value="Social">Social</SelectItem>
                                                    <SelectItem value="Utilities">Utilities</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="androidVersion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="androidVersion">Min. Android Version</Label>
                                            <FormControl>
                                                <Input id="androidVersion" placeholder="e.g., 10+" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={onBack}>
                           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Guide
                        </Button>
                        <Button size="lg" type="submit">
                            <PartyPopper className="mr-2 h-5 w-5" /> Submit for Review
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default function SubmitAppPage() {
    const [step, setStep] = useState<'guide' | 'form'>('guide');

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <header className="mb-8 max-w-4xl mx-auto">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/community-dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Hub</Link>
                    </Button>
                    <h1 className="text-4xl font-bold">Submit your App</h1>
                    <p className="text-muted-foreground mt-2">
                       {step === 'guide' 
                            ? "Follow this simple guide to prepare your app for community testing."
                            : "Fill out the details below to submit your app for review."
                       }
                    </p>
                </header>
                
                <main>
                    {step === 'guide' ? (
                        <SubmissionGuide onGetStarted={() => setStep('form')} />
                    ) : (
                        <SubmissionForm onBack={() => setStep('guide')} />
                    )}
                </main>
            </div>
        </div>
    );
}
