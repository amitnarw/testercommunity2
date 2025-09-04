
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, Star, Lightbulb, Upload, Edit, Trash2, Bug } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { BackButton } from '@/components/back-button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import type { SubmittedFeedback } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { PlusCircle } from 'lucide-react';

const DailyProgress = ({ progress, totalDays }: { progress: number, totalDays: number }) => {
    const completedDays = Math.floor(totalDays * (progress || 0) / 100);

    return (
        <div className="w-full grid grid-cols-4 sm:grid-cols-7 gap-3">
            {Array.from({ length: totalDays }, (_, i) => {
                const day = i + 1;
                const isCompleted = day <= completedDays;
                const isCurrent = day === completedDays + 1;
                
                return (
                    <div
                        key={day}
                        className={cn(
                            "aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-300",
                            isCurrent 
                                ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg scale-105' 
                                : 'bg-secondary',
                            isCompleted 
                                ? 'bg-secondary/50 text-muted-foreground shadow-inner' 
                                : 'shadow-sm'
                        )}
                    >
                        {isCompleted ? (
                             <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                            <>
                                <p className={cn("text-xs", isCurrent ? 'opacity-80' : 'text-muted-foreground')}>Day</p>
                                <p className={cn("font-bold", isCurrent ? 'text-4xl' : 'text-2xl')}>{day}</p>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};


const FeedbackFormModal = ({
    feedback,
    onSave,
    children,
}: {
    feedback?: SubmittedFeedback | null;
    onSave: (data: any) => void;
    children: React.ReactNode;
}) => {
    const [rating, setRating] = useState(feedback?.rating || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ rating });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{feedback ? 'Edit Feedback' : 'Submit New Feedback'}</DialogTitle>
                    <DialogDescription>
                        Your feedback helps developers build better apps. Provide clear and constructive comments.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto px-1">
                        <div className="space-y-3">
                            <Label className="text-base">What worked well? What did you like?</Label>
                            <Textarea defaultValue={feedback?.positive || ''} placeholder="e.g., The onboarding was very smooth..." className="min-h-[120px] text-base" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base">Did you find any bugs or issues?</Label>
                            <Textarea defaultValue={feedback?.negative || ''} placeholder="e.g., The app crashed when..." className="min-h-[120px] text-base" />
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
                    </div>
                    <DialogFooter className="pt-4 border-t">
                         <div className="flex items-center space-x-3 mr-auto">
                            <Checkbox id="confirmation" defaultChecked={true} />
                            <Label htmlFor="confirmation" className="text-sm font-normal text-muted-foreground">I confirm my feedback is accurate.</Label>
                        </div>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save Feedback</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const FeedbackIcon = ({ type }: { type: SubmittedFeedback['type'] }) => {
    if (type === 'Bug') return <Bug className="w-5 h-5 text-red-500 flex-shrink-0" />;
    return <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />;
}


export default function AppTestingOngoingPage({ params }: { params: { id: string } }) {
    const app = communityApps.find(p => p.id.toString() === params.id && p.status === 'ongoing');
    const [submittedFeedback, setSubmittedFeedback] = useState<SubmittedFeedback[]>([
        { id: 1, type: 'Bug', comment: 'App crashes on launch sometimes.', positive: '', negative: 'App crashes on launch sometimes.', rating: 2 },
        { id: 2, type: 'Suggestion', comment: 'A dark mode would be great for night use.', positive: 'The UI is clean.', negative: 'A dark mode would be great for night use.', rating: 4 },
    ]);

    if (!app) {
        notFound();
    }
    
    const daysCompleted = Math.floor((app.totalDays || 14) * (app.progress || 0) / 100);

    const handleSaveFeedback = (data: any) => {
        console.log("Saving feedback:", data);
    }
    
    const handleDeleteFeedback = (id: number) => {
        setSubmittedFeedback(prev => prev.filter(fb => fb.id !== id));
        console.log("Deleting feedback:", id);
    }

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                 <header className="mb-8 max-w-7xl mx-auto">
                    <BackButton href="/community-dashboard" className="mb-4" />
                     <div className="flex flex-col md:flex-row items-start gap-6">
                        <Image src={app.icon} alt={app.name} width={100} height={100} className="rounded-2xl border bg-background" data-ai-hint={app.dataAiHint} />
                        <div>
                            <h1 className="text-4xl font-bold">{app.name}</h1>
                             <div className="flex flex-wrap items-center gap-4 mt-2">
                                <Badge variant="outline">{app.category}</Badge>
                                <p className="text-sm text-muted-foreground">Requires Android {app.androidVersion}</p>
                                <p className="text-sm text-muted-foreground">~{app.estimatedTime} test</p>
                            </div>
                            <p className="text-primary font-bold text-lg mt-1">Reward: {app.points} Points</p>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto space-y-12">
                     <section>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold">Testing in Progress</h2>
                            <p className="text-muted-foreground mt-1">You have completed {daysCompleted} of {app.totalDays} days. Keep the app installed and use it occasionally to complete the test.</p>
                        </div>
                        <DailyProgress progress={app.progress || 0} totalDays={app.totalDays} />
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Developer's Instructions <span className="text-primary font-semibold">Important</span></h2>
                        <div className="prose prose-base dark:prose-invert leading-relaxed bg-card text-card-foreground p-6 rounded-lg border-primary/20 border-l-4 shadow-md">
                            <p>{app.testingInstructions}</p>
                        </div>
                    </section>
                    
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2">My Submitted Feedback</CardTitle>
                                <CardDescription>Here is the feedback you've submitted so far. You can edit or delete your comments.</CardDescription>
                            </div>
                             <FeedbackFormModal onSave={handleSaveFeedback}>
                                <Button><PlusCircle className="mr-2 h-4 w-4"/> Submit New Feedback</Button>
                            </FeedbackFormModal>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {submittedFeedback.length > 0 ? (
                                    submittedFeedback.map((fb, i) => (
                                        <div key={fb.id} className="group">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-secondary p-3 rounded-full mt-1">
                                                    <FeedbackIcon type={fb.type} />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="font-semibold">{fb.type}</p>
                                                    <p className="text-sm text-muted-foreground">{fb.comment}</p>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <FeedbackFormModal feedback={fb} onSave={handleSaveFeedback}>
                                                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                                    </FeedbackFormModal>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete your feedback.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteFeedback(fb.id)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                            {i < submittedFeedback.length - 1 && <Separator className="mt-4" />}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground bg-secondary/50 rounded-lg">
                                        <p className="mb-2">You haven't submitted any feedback for this app yet.</p>
                                        <FeedbackFormModal onSave={handleSaveFeedback}>
                                            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/> Submit Your First Feedback</Button>
                                        </FeedbackFormModal>
                                    </div>
                                )}
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
