
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SubmitAppPage() {
    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                 <header className="mb-8 max-w-2xl mx-auto">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/community-dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Hub</Link>
                    </Button>
                    <h1 className="text-4xl font-bold">Submit Your App to the Community</h1>
                    <p className="text-muted-foreground mt-2">
                        Get valuable feedback by submitting your app for community testing. Our team will review your submission and allocate appropriate points for testers.
                    </p>
                </header>

                <div className="max-w-2xl mx-auto">
                    <Card className="rounded-xl">
                        <CardHeader>
                            <CardTitle>App Details</CardTitle>
                            <CardDescription>Fill out the form below. Once submitted, our team will review your app and add it to the community testing queue.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="appName">App Name</Label>
                                <Input id="appName" placeholder="e.g., PhotoSnap Editor" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="appLink">Google Play Testing Link</Label>
                                <Input id="appLink" placeholder="https://play.google.com/apps/testing/com.you.app" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="appDesc">Description & Instructions for Testers</Label>
                                <Textarea id="appDesc" placeholder="Describe your app and provide specific instructions. e.g., 'Focus on the new photo filter feature. Login with demo@user.com, pass: 1234.'" className="min-h-[120px]"/>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select>
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Games">Games</SelectItem>
                                            <SelectItem value="Productivity">Productivity</SelectItem>
                                            <SelectItem value="Social">Social</SelectItem>
                                            <SelectItem value="Utilities">Utilities</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="androidVersion">Min. Android Version</Label>
                                    <Input id="androidVersion" placeholder="e.g., 10+" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" className="w-full">Submit App for Review</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
