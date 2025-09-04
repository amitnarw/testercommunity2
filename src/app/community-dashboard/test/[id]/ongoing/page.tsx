
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, Star, Lightbulb, Upload, Edit, Trash2, ListChecks, MessagesSquare, Info } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { BackButton } from '@/components/back-button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DailyProgress = ({ progress, totalDays }: { progress: number, totalDays: number }) => {
    const completedDays = Math.floor(totalDays * (progress || 0) / 100);
    const currentDay = completedDays + 1;

    return (
        <div className="flex flex-wrap gap-3">
            {Array.from({ length: totalDays }, (_, i) => {
                const dayNumber = i + 1;
                const isCompleted = dayNumber < currentDay;
                const isCurrent = dayNumber === currentDay;
                
                return (
                    <div
                        key={dayNumber}
                        className={cn(
                            "flex-shrink-0 basis-16 h-20 rounded-xl flex flex-col items-center justify-center p-2 transition-all duration-300",
                            isCompleted 
                                ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 shadow-inner" 
                                : isCurrent 
                                    ? "bg-primary/10 text-primary shadow-md shadow-primary/20" 
                                    : "bg-secondary/60 dark:bg-secondary/30 text-muted-foreground"
                        )}
                    >
                        <p className="text-xs font-medium">Day {dayNumber}</p>
                        <div className="text-2xl font-bold mt-1">
                            {isCompleted ? <CheckCircle className="w-6 h-6" /> : dayNumber}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


export default function AppTestingOngoingPage({ params }: { params: { id: string } }) {
    const app = communityApps.find(p => p.id.toString() === params.id && p.status === 'ongoing');
    const [rating, setRating] = useState(0);

    if (!app) {
        notFound();
    }
    
    const totalDays = app.totalDays || 14;
    const daysCompleted = Math.floor(totalDays * (app.progress || 0) / 100);

    const submittedFeedback = [
        { type: 'Bug', comment: 'App crashes on launch sometimes.' },
        { type: 'Suggestion', comment: 'A dark mode would be great for night use.' },
    ]

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                 <header className="mb-8 max-w-7xl mx-auto">
                    <BackButton href="/community-dashboard" className="mb-4" />
                     <div className="flex items-start gap-6">
                        <Image src={app.icon} alt={app.name} width={100} height={100} className="rounded-2xl border" data-ai-hint={app.dataAiHint} />
                        <div>
                            <h1 className="text-4xl font-bold">{app.name}</h1>
                             <div className="flex items-center gap-4 mt-2">
                                <Badge variant="outline">{app.category}</Badge>
                                <p className="text-sm text-muted-foreground">Requires Android {app.androidVersion}</p>
                                <p className="text-sm text-muted-foreground">~{app.estimatedTime} test</p>
                            </div>
                            <p className="text-primary font-bold text-lg mt-1">Reward: {app.points} Points</p>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto space-y-8">
                    <Card className="rounded-xl overflow-hidden">
                        <CardHeader>
                            <CardTitle>Testing in Progress</CardTitle>
                            <CardDescription>You have completed {daysCompleted} of {totalDays} days. Keep the app installed and use it occasionally to complete the test.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DailyProgress progress={app.progress || 0} totalDays={totalDays} />
                        </CardContent>
                    </Card>
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Developer's Instructions <span className="bg-gradient-to-b from-primary to-primary/50 text-white font-bold rounded-lg px-4 py-0.5 text-xl ml-2">Important</span></h2>
                        <div className="prose prose-base dark:prose-invert leading-relaxed text-white dark:text-black bg-[#121212] dark:bg-white p-6 rounded-lg border-primary border-l-4 shadow-xl shadow-gray-300 dark:shadow-gray-700">
                            <p>{app.testingInstructions}</p>
                        </div>
                    </section>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500" /> My Submitted Feedback</CardTitle>
                            <CardDescription>Here is the feedback you've submitted so far. You can edit or delete your comments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {submittedFeedback.length > 0 ? (
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[120px]">Type</TableHead>
                                                <TableHead>Comment</TableHead>
                                                <TableHead className="text-right w-[120px]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {submittedFeedback.map((fb, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="font-medium">{fb.type}</TableCell>
                                                    <TableCell className="text-muted-foreground">{fb.comment}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground bg-secondary/50 rounded-lg">
                                    You haven't submitted any feedback for this app yet.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                             <h2 className="text-2xl font-bold">Submit New Feedback</h2>
                             <CardDescription>Found something new? Submit it here. You can submit feedback multiple times.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div className="space-y-3">
                                <Label className="text-base">What worked well? What did you like?</Label>
                                <Textarea placeholder="e.g., The onboarding was very smooth and the main feature is intuitive." className="min-h-[120px] text-base" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-base">Did you find any bugs or issues?</Label>
                                <Textarea placeholder="e.g., The app crashed when I tried to upload a photo from the gallery." className="min-h-[120px] text-base" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-base">Overall Rating</Label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            className={cn(`w-8 h-8 transition-all cursor-pointer`, rating >= star ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/50')}
                                            onClick={() => setRating(star)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-base">Upload Screenshot (Optional)</Label>
                                <div className={cn(`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors border-muted-foreground/50 cursor-pointer hover:border-primary hover:bg-secondary/50`)}>
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="font-semibold">Click or drag file to upload</p>
                                    <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                                </div>
                            </div>
                            <div className="pt-4">
                                <div className="flex items-center space-x-3 mb-6">
                                    <Checkbox id="confirmation" />
                                    <Label htmlFor="confirmation" className="text-base font-normal text-muted-foreground">I confirm my feedback is accurate and constructive.</Label>
                                </div>
                                <Button size="lg" className="w-full text-lg h-14">Submit Feedback</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8">
                         <Button size="lg" variant="outline" asChild className="w-full">
                           <a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer">
                                Re-open in Google Play <ExternalLink className="ml-2 h-4 w-4" />
                           </a>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}

    