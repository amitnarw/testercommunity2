
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Rocket, Search, Send, FileCheck, PartyPopper } from 'lucide-react';
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

export default function SubmitAppPage() {
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
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <header className="mb-8 max-w-4xl mx-auto">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/community-dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Hub</Link>
                    </Button>
                    <h1 className="text-4xl font-bold">Submit your App</h1>
                    <p className="text-muted-foreground mt-2">
                        Get valuable feedback by letting our community test your app. Fill out the details below to get started.
                    </p>
                </header>

                <div className="grid lg:grid-cols-5 gap-12 items-start max-w-6xl mx-auto">
                    
                    {/* Form Section */}
                    <div className="lg:col-span-3">
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <Card className="rounded-xl">
                                    <CardHeader>
                                        <CardTitle>1. App Information</CardTitle>
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
                                        <CardTitle>2. Testing Details</CardTitle>
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

                                <Button size="lg" type="submit" className="w-full">
                                    <PartyPopper className="mr-2 h-5 w-5" /> Submit for Review
                                </Button>
                            </form>
                        </FormProvider>
                    </div>

                    {/* "What Happens Next" Section */}
                    <div className="lg:col-span-2 space-y-8 sticky top-24">
                        <h3 className="text-2xl font-bold">The Road to Launch</h3>
                        <div className="space-y-8">
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
                                title="3. Approval"
                                description="We assign a fair point reward for testers based on your app's complexity."
                            />
                            <ProcessStep 
                                icon={<Rocket className="w-6 h-6" />}
                                title="4. Launch!"
                                description="Your app goes live in the Community Hub, ready for testers to provide valuable feedback."
                                isLast={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

    