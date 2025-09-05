
'use client';

import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, CheckCircle, Star, Lightbulb, Upload, Edit, List, Bug, Trash2, Image as ImageIcon } from 'lucide-react';
import { communityApps } from '@/lib/data';
import { BackButton } from '@/components/back-button';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import type { SubmittedFeedback } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { PlusCircle } from 'lucide-react';
import { AppInfoSidebar } from '@/components/appInfoSidebar';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DailyProgress = ({ progress, totalDays }: { progress: number, totalDays: number }) => {
    const completedDays = Math.floor(totalDays * (progress || 0) / 100);

    return (
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
            {Array.from({ length: totalDays }, (_, i) => {
                const day = i + 1;
                const isCompleted = day <= completedDays;
                const isCurrent = day === completedDays + 1;

                return (
                    <div
                        key={day}
                        className={cn(
                            "aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all duration-300 shadow-md",
                            isCurrent
                                ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground scale-110 shadow-primary/20'
                                : 'bg-card shadow-sm',
                            isCompleted
                                ? 'bg-gradient-to-br from-green-400/10 to-green-400/5 text-muted-foreground shadow-inner'
                                : 'shadow-sm'
                        )}
                    >
                        {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                            <>
                                <p className={cn("text-[10px] sm:text-xs", isCurrent ? 'opacity-80' : 'text-muted-foreground')}>Day</p>
                                <p className={cn("font-bold", isCurrent ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl')}>{day}</p>
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
    onSave: (data: Partial<SubmittedFeedback>) => void;
    children: React.ReactNode;
}) => {
    const [comment, setComment] = useState(feedback?.comment || '');
    const [type, setType] = useState<SubmittedFeedback['type'] | undefined>(feedback?.type);
    const [screenshot, setScreenshot] = useState<string | null>(feedback?.screenshot || null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshot(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        maxFiles: 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!type || !comment) return;
        onSave({ type, comment, screenshot });
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
                            <Label className="text-base">Feedback Type</Label>
                             <Select onValueChange={(value) => setType(value as SubmittedFeedback['type'])} defaultValue={type}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select feedback type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bug">Bug Report</SelectItem>
                                    <SelectItem value="Suggestion">Suggestion</SelectItem>
                                    <SelectItem value="Praise">Praise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base">Comment</Label>
                            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="e.g., The app crashed when..." className="min-h-[120px] text-base" />
                        </div>
                        
                        <div className="space-y-3">
                            <Label className="text-base">Upload Screenshot (Optional)</Label>
                            {screenshot ? (
                                <div className="relative">
                                    <Image src={screenshot} alt="Screenshot preview" width={550} height={300} className="rounded-lg object-contain border bg-secondary" />
                                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setScreenshot(null)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div {...getRootProps()} className={cn(`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer hover:border-primary hover:bg-secondary/50`, isDragActive && 'border-primary bg-primary/10')}>
                                    <input {...getInputProps()} />
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="font-semibold">Click or drag file to upload</p>
                                    <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                                </div>
                            )}
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
    if (type === 'Suggestion') return <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />;
    return <Star className="w-5 h-5 text-green-500 flex-shrink-0" />;
}

const FeedbackListItem = ({ fb, onSave, onDelete }: { fb: SubmittedFeedback, onSave: (data: any) => void, onDelete: (id: number) => void }) => (
    <Card className="bg-secondary/50 p-4 shadow-none border-0">
        <div className="flex items-center gap-4">
            <div className="bg-background p-3 rounded-full">
                <FeedbackIcon type={fb.type} />
            </div>
            <div className="flex-grow">
                <p className="font-semibold">{fb.type}</p>
                <p className="text-sm text-muted-foreground">{fb.comment}</p>
            </div>
            <div className="flex items-center gap-1">
                <FeedbackFormModal feedback={fb} onSave={onSave}>
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
                            <AlertDialogAction onClick={() => onDelete(fb.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    </Card>
);

const FeedbackGridItem = ({ fb, onSave, onDelete }: { fb: SubmittedFeedback, onSave: (data: any) => void, onDelete: (id: number) => void }) => (
    <Card className="bg-secondary/50 p-4 shadow-none border-0 h-full flex flex-col">
        <CardHeader className="p-0 flex-row items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="bg-background p-3 rounded-full">
                    <FeedbackIcon type={fb.type} />
                </div>
                <CardTitle className="text-base">{fb.type}</CardTitle>
            </div>
            {fb.screenshot && <ImageIcon className="w-5 h-5 text-muted-foreground" />}
        </CardHeader>
        <CardContent className="p-0 pt-4 flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">{fb.comment}</p>
        </CardContent>
        <CardFooter className="p-0 pt-4 flex items-center justify-end">
            <div className="flex items-center gap-1">
                 <FeedbackFormModal feedback={fb} onSave={onSave}>
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
                            <AlertDialogAction onClick={() => onDelete(fb.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardFooter>
    </Card>
);

export default function AppTestingOngoingPage({ params }: { params: { id: string } }) {
    const app = communityApps.find(p => p.id.toString() === params.id && p.status === 'ongoing');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [submittedFeedback, setSubmittedFeedback] = useState<SubmittedFeedback[]>([
        { id: 1, type: 'Bug', comment: 'App crashes on launch sometimes.', screenshot: null },
        { id: 2, type: 'Suggestion', comment: 'A dark mode would be great for night use.', screenshot: null },
        { id: 3, type: 'Praise', comment: 'The new UI is super clean and intuitive. Great job!', screenshot: 'https://images.unsplash.com/photo-1516116216624-53e697320f64?q=80&w=600&auto=format&fit=crop' },
    ]);

    if (!app) {
        notFound();
    }

    const handleSaveFeedback = (data: Partial<SubmittedFeedback>) => {
        if (data.id) {
            // Edit existing
             setSubmittedFeedback(prev => prev.map(fb => fb.id === data.id ? {...fb, ...data} : fb));
        } else {
            // Add new
            const newFeedback: SubmittedFeedback = {
                id: Date.now(),
                type: data.type!,
                comment: data.comment!,
                screenshot: data.screenshot || null
            }
            setSubmittedFeedback(prev => [...prev, newFeedback]);
        }
        console.log("Saving feedback:", data);
    }

    const handleDeleteFeedback = (id: number) => {
        setSubmittedFeedback(prev => prev.filter(fb => fb.id !== id));
        console.log("Deleting feedback:", id);
    }

    return (
        <div className="bg-secondary/50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
                <header className="mb-8 max-w-7xl mx-auto">
                    <BackButton href="/community-dashboard" className="mb-4" />
                    <div className="grid md:grid-cols-3 gap-6 items-center">
                        <div className="flex items-center gap-6 md:col-span-2">
                             <Image src={app.icon} alt={app.name} width={100} height={100} className="rounded-2xl border bg-background" data-ai-hint={app.dataAiHint} />
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">{app.name}</h1>
                                <p className="text-muted-foreground text-lg mt-2 leading-relaxed">{app.shortDescription}</p>
                            </div>
                        </div>
                        <Card className="border-0 rounded-2xl shadow-xl shadow-gray-100 dark:shadow-gray-900 overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-4 bg-gradient-to-b from-primary/80 to-primary/60 text-primary-foreground text-center">
                                    <p className="text-lg font-semibold">REWARD</p>
                                    <div className="text-3xl font-bold text-background flex items-center gap-2 justify-center mt-1">
                                        {app.points} Points
                                        <Star className="w-7 h-7 text-background/0 fill-background/20" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
                    <div className='flex flex-col gap-10 lg:col-span-2'>
                        <section>
                             <CardHeader className="px-0">
                                <CardTitle>Testing in Progress</CardTitle>
                                <CardDescription>Keep the app installed and engage with it daily to complete the test.</CardDescription>
                             </CardHeader>
                            <DailyProgress progress={app.progress || 0} totalDays={app.totalDays} />
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">Developer's Instructions <span className="bg-gradient-to-b from-primary to-primary/50 text-white font-bold rounded-lg px-4 py-0.5 text-xl ml-2">Important</span></h2>
                            <div className="prose prose-base dark:prose-invert leading-relaxed text-white dark:text-black bg-[#121212] dark:bg-white p-6 rounded-lg border-primary border-l-4 shadow-xl shadow-gray-300 dark:shadow-gray-700">
                                <p>{app.testingInstructions}</p>
                            </div>
                        </section>

                        <section>
                            <div className="bg-card rounded-2xl p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold">My Submitted Feedback</h2>
                                        <p className="text-muted-foreground">Here is the feedback you've submitted so far.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                                                <List className="w-4 h-4" />
                                            </Button>
                                            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                                                <LayoutGrid className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <FeedbackFormModal onSave={handleSaveFeedback}>
                                            <Button><PlusCircle className="mr-2 h-4 w-4" /> Submit New</Button>
                                        </FeedbackFormModal>
                                    </div>
                                </div>

                                {submittedFeedback.length > 0 ? (
                                    viewMode === 'list' ? (
                                        <div className="space-y-3">
                                            {submittedFeedback.map((fb) => (
                                                <FeedbackListItem key={fb.id} fb={fb} onSave={handleSaveFeedback} onDelete={handleDeleteFeedback} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {submittedFeedback.map((fb) => (
                                                <FeedbackGridItem key={fb.id} fb={fb} onSave={handleSaveFeedback} onDelete={handleDeleteFeedback} />
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground bg-secondary/50 rounded-lg">
                                        <p className="mb-2">You haven't submitted any feedback for this app yet.</p>
                                        <FeedbackFormModal onSave={handleSaveFeedback}>
                                            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Submit Your First Feedback</Button>
                                        </FeedbackFormModal>
                                    </div>
                                )}
                            </div>
                        </section>

                    </div>

                    <aside className="lg:col-span-1">
                        <AppInfoSidebar app={app} buttonType="external" url={app?.playStoreUrl} />
                    </aside>
                </main>
            </div>
        </div>
    );
}
