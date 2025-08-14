
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommunityAppCard } from '@/components/community-app-card';
import type { CommunityApp } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Coins, Users } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

export default function SubmitAppPage() {
    const [numTesters, setNumTesters] = useState(10);
    const [pointsPerTester, setPointsPerTester] = useState(50);

    const previewApp: CommunityApp = {
        id: 99,
        name: 'My Awesome App',
        icon: 'https://placehold.co/128x128.png',
        dataAiHint: 'app icon',
        category: 'Productivity',
        shortDescription: 'A brief, catchy description of what my app does.',
        points: pointsPerTester,
        androidVersion: '11+',
        estimatedTime: '15-20 min'
    };

    const totalCost = numTesters * pointsPerTester;

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                 <header className="mb-8 max-w-4xl mx-auto">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/community-dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Hub</Link>
                    </Button>
                    <h1 className="text-4xl font-bold">Submit Your App</h1>
                    <p className="text-muted-foreground mt-2">
                        Get valuable feedback from the community by submitting your app for testing.
                    </p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="lg:col-span-2">
                        <Card className="rounded-xl">
                            <CardHeader>
                                <CardTitle>App Details</CardTitle>
                                <CardDescription>Fill out the form below to add your app to the testing queue.</CardDescription>
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
                                    <Label htmlFor="appDesc">Description & Instructions</Label>
                                    <Textarea id="appDesc" placeholder="Describe your app and provide specific instructions for testers. e.g., 'Focus on the new photo filter feature. Login with demo@user.com, pass: 1234.'" className="min-h-[120px]"/>
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
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                         <Card className="rounded-xl">
                            <CardHeader>
                                <CardTitle>Set Your Budget</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <Label>Number of Testers: <span className="font-bold text-primary">{numTesters}</span></Label>
                                    <Slider defaultValue={[10]} min={5} max={50} step={1} onValueChange={(value) => setNumTesters(value[0])} />
                                </div>
                                <div className="space-y-4">
                                    <Label>Points per Tester: <span className="font-bold text-primary">{pointsPerTester}</span></Label>
                                    <Slider defaultValue={[50]} min={20} max={200} step={5} onValueChange={(value) => setPointsPerTester(value[0])}/>
                                </div>
                                <div className="p-4 bg-secondary rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground">Total Cost</p>
                                    <p className="text-2xl font-bold text-primary">{totalCost.toLocaleString()} Points</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-xl">
                            <CardHeader>
                                <CardTitle>Queue Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CommunityAppCard app={previewApp} isPreview={true} />
                            </CardContent>
                        </Card>

                        <Button size="lg" className="w-full">Submit App to Queue</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
