
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Lightbulb, Upload, List, Bug, Trash2, X, PartyPopper, CirclePlay } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { SubmittedFeedback as SubmittedFeedbackType } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppPagination } from '../app-pagination';
import { Badge } from '../ui/badge';

const getSeverityBadge = (severity: string) => {
    switch (severity) {
        case 'Critical': return <Badge variant="destructive" className="!mt-0 bg-red-700 hover:bg-red-800">{severity}</Badge>;
        case 'High': return <Badge variant="destructive" className="!mt-0 bg-red-500/80 hover:bg-red-600">{severity}</Badge>;
        case 'Medium': return <Badge variant="secondary" className="!mt-0 bg-amber-500/80 hover:bg-amber-600 text-white">{severity}</Badge>;
        case 'Low': return <Badge variant="secondary" className="!mt-0 bg-yellow-500/80 hover:bg-yellow-600 text-white">{severity}</Badge>;
        default: return null;
    }
};

const FeedbackFormModal = ({
    feedback,
    onSave,
    children,
}: {
    feedback?: SubmittedFeedbackType | null;
    onSave: (data: Partial<SubmittedFeedbackType>) => void;
    children: React.ReactNode;
}) => {
    const [comment, setComment] = useState(feedback?.comment || '');
    const [type, setType] = useState<SubmittedFeedbackType['type'] | undefined>(feedback?.type);
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
        onSave({ id: feedback?.id, type, comment, screenshot });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 bg-white dark:bg-[#121212] border-0 h-full sm:h-auto gap-0">
                <DialogHeader className='p-6 pb-4 border-b'>
                    <DialogTitle>{feedback ? 'Edit Feedback' : 'Submit New Feedback'}</DialogTitle>
                    <DialogDescription>
                        Your feedback helps developers build better apps. Provide clear and constructive comments.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto px-6">
                        <div className="space-y-3">
                            <Label className="text-base">Feedback Type</Label>
                            <Select onValueChange={(value) => setType(value as SubmittedFeedbackType['type'])} defaultValue={type}>
                                <SelectTrigger className="bg-gray-100 dark:bg-black border-0">
                                    <SelectValue placeholder="Select feedback type" />
                                </SelectTrigger>
                                <SelectContent className='z-[60] bg-white dark:bg-[#121212] shadow-2xl dark:shadow-black border-[1px] border-gray-200 dark:border-[#232323] w-[98%] m-auto !py-0'>
                                    <SelectItem value="Bug">Bug Report</SelectItem>
                                    <SelectItem value="Suggestion">Suggestion</SelectItem>
                                    <SelectItem value="Praise">Praise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base">Comment</Label>
                            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="e.g., The app crashed when..." className="min-h-[120px] text-base bg-gray-100 dark:bg-black border-0" />
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
                    <DialogFooter className="border-t p-6">
                        <Button type="submit">Save Feedback</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const FeedbackIcon = ({ type }: { type: SubmittedFeedbackType['type'] }) => {
    if (type === 'Bug') return <Bug className="w-5 h-5 text-red-500 flex-shrink-0" />;
    if (type === 'Suggestion') return <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />;
    return <PartyPopper className="w-5 h-5 text-green-500 flex-shrink-0" />;
}

const FeedbackListItem = ({ fb, onImageClick, onVideoClick }: { fb: SubmittedFeedbackType, onImageClick: (url: string) => void, onVideoClick: (url: string) => void }) => (
    <Card className={`bg-gradient-to-tl ${fb.type === "Bug" ? "from-red-500/20" : fb.type === "Suggestion" ? "from-yellow-500/20" : "from-green-500/20"} ${fb.type === "Bug" ? "to-red-500/5" : fb.type === "Suggestion" ? "to-yellow-500/5" : "to-green-500/5"} p-2 sm:p-4 pt-2 pr-2 shadow-none border-0 relative overflow-hidden`}>
        <div className="flex items-start flex-col gap-0">
            <div className="absolute scale-[2.5] rotate-45 top-2 left-2 opacity-5 dark:opacity-10">
                <FeedbackIcon type={fb.type} />
            </div>
            <div className="flex flex-row items-center justify-between w-full pl-3">
                <div className="flex items-center gap-3">
                    <p className="font-semibold">{fb.type}</p>
                    {getSeverityBadge(fb.severity)}
                </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 pl-3">{fb.comment}</p>
            <div className='flex flex-row justify-between w-full mt-3 items-end'>
                <div className='flex flex-row gap-2 pl-3'>
                    {fb.screenshot && (
                        <div className="cursor-pointer h-14 w-10 relative" onClick={() => onImageClick(fb.screenshot!)}>
                            <Image src={fb.screenshot} alt="Feedback screenshot" fill className="rounded-sm border object-cover" />
                        </div>
                    )}
                    {fb.screenshot && (
                        <div className="cursor-pointer h-14 w-20 relative" onClick={() => onVideoClick(fb.screenshot!)}>
                            <Image src={fb.screenshot} alt="Feedback screenshot" fill className="rounded-sm border object-cover w-full h-full" />
                            <CirclePlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white shadow-lg backdrop-blur-sm rounded-full p-1" size={30} />
                        </div>
                    )}
                </div>
                <span className="text-xs text-muted-foreground pr-3">by {fb.tester}</span>
            </div>
        </div>
    </Card>
);


const FeedbackGridItem = ({ fb, onImageClick, onVideoClick }: { fb: SubmittedFeedbackType, onImageClick: (url: string) => void, onVideoClick: (url: string) => void }) => (
    <Card className={`bg-gradient-to-bl ${fb.type === "Bug" ? "from-red-500/20" : fb.type === "Suggestion" ? "from-yellow-500/20" : "from-green-500/20"} ${fb.type === "Bug" ? "to-red-500/10" : fb.type === "Suggestion" ? "to-yellow-500/10" : "to-green-500/10"} p-2 sm:p-4 shadow-none border-0 h-full flex flex-col relative overflow-hidden`}>
        <CardHeader className="p-0 flex-row items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-full absolute opacity-10 scale-[3] -right-1 -top-1 -rotate-45">
                    <FeedbackIcon type={fb.type} />
                </div>
                <CardTitle className="text-base">{fb.type}</CardTitle>
            </div>
            {getSeverityBadge(fb.severity)}
        </CardHeader>
        <CardContent className="p-0 pt-2 flex-grow">
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{fb.comment}</p>
        </CardContent>
        <CardFooter className="p-0 flex flex-col items-start gap-1 mt-3">
            <div className='flex flex-row gap-1'>
                {fb.screenshot && (
                    <div className="cursor-pointer h-10 w-8 relative" onClick={() => onImageClick(fb.screenshot!)}>
                        <Image src={fb.screenshot} alt="Feedback screenshot" fill className="rounded-sm border object-cover" />
                    </div>
                )}
                {fb.screenshot && (
                    <div className="cursor-pointer h-18 w-16 relative" onClick={() => onVideoClick(fb.screenshot!)}>
                        <Image src={fb.screenshot} alt="Feedback screenshot" fill className="rounded-sm border object-cover w-full h-full" />
                        <CirclePlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white shadow-lg backdrop-blur-sm rounded-full p-1" size={30} />
                    </div>
                )}
            </div>
            <p className="text-xs text-muted-foreground pt-2 text-end w-full">by {fb.tester}</p>
        </CardFooter>
    </Card>
);

export function SubmittedFeedback({ isCompleted = false }: { isCompleted?: boolean }) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);

    const [submittedFeedback, setSubmittedFeedback] = useState<SubmittedFeedbackType[]>([
        { id: 1, type: 'Bug', comment: 'App crashes on launch sometimes.', screenshot: null, tester: 'Tester101', severity: 'Critical' },
        { id: 2, type: 'Suggestion', comment: 'A dark mode would be great for night use.', screenshot: null, tester: 'Tester102', severity: 'N/A' },
        { id: 3, type: 'Praise', comment: 'The new UI is super clean and intuitive. Great job!', screenshot: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tester: 'Tester103', severity: 'N/A' },
        { id: 4, type: 'Bug', comment: 'The settings icon is misaligned on tablets.', screenshot: 'https://images.unsplash.com/photo-1756303018960-e5279e145963?q=80&w=719&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tester: 'Tester104', severity: 'Medium' },
        { id: 5, type: 'Suggestion', comment: 'Could we get an option to export data to CSV?', screenshot: null, tester: 'Tester105', severity: 'N/A' },
        { id: 6, type: 'Praise', comment: 'The performance improvement in the latest update is very noticeable!', screenshot: null, tester: 'Tester106', severity: 'N/A' },
        { id: 7, type: 'Bug', comment: 'Login button is unresponsive on older Android versions.', screenshot: 'https://images.unsplash.com/photo-1559136560-16de2dc70a2b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tester: 'Tester107', severity: 'High' },
        { id: 8, type: 'Suggestion', comment: 'It would be helpful to have a tutorial for new users.', screenshot: null, tester: 'Tester108', severity: 'N/A' },
        { id: 9, type: 'Praise', comment: 'This is one of the most stable beta apps I have tested.', screenshot: null, tester: 'Tester109', severity: 'N/A' },
        { id: 10, type: 'Bug', comment: 'Text overlaps in the profile section on small screens.', screenshot: null, tester: 'Tester110', severity: 'Low' },
        { id: 11, type: 'Suggestion', comment: 'Add integration with other project management tools.', screenshot: null, tester: 'Tester111', severity: 'N/A' },
        { id: 12, type: 'Bug', comment: 'In-app purchases are not going through. Stuck on processing.', screenshot: 'https://images.unsplash.com/photo-1580674287405-80cd3582e3b9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tester: 'Tester112', severity: 'Critical' },
    ]);

    const FEEDBACK_PER_PAGE = viewMode === 'list' ? 4 : 6;

    useEffect(() => {
        setCurrentPage(1);
    }, [viewMode]);

    const totalPages = Math.ceil(submittedFeedback.length / FEEDBACK_PER_PAGE);
    const startIndex = (currentPage - 1) * FEEDBACK_PER_PAGE;
    const endIndex = startIndex + FEEDBACK_PER_PAGE;
    const currentFeedback = submittedFeedback.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleSaveFeedback = (data: Partial<SubmittedFeedbackType>) => {
        if (data.id) {
            // Edit existing
            setSubmittedFeedback(prev => prev.map(fb => fb.id === data.id ? { ...fb, ...data } as SubmittedFeedbackType : fb));
        } else {
            // Add new
            const newFeedback: SubmittedFeedbackType = {
                id: Date.now(),
                type: data.type!,
                comment: data.comment!,
                screenshot: data.screenshot || null,
                tester: 'Developer',
                severity: 'N/A'
            }
            setSubmittedFeedback(prev => [...prev, newFeedback]);
        }
    }

    const description = isCompleted ? "Here is a summary of the feedback you submitted." : "Here is the feedback you've submitted so far.";

    return (
        <>
            <section>
                <div className="bg-card/50 rounded-2xl p-2 sm:p-6 sm:pt-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold">Feedback from Testers</h2>
                            <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
                        </div>
                        <div className="flex items-center gap-2 justify-between w-full sm:w-auto">
                            <div className="flex items-center gap-1">
                                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                                    <List className="w-4 h-4" />
                                </Button>
                                <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                                    <LayoutGrid className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {currentFeedback.length > 0 ? (
                        <>
                            {viewMode === 'list' ? (
                                <div className="space-y-3">
                                    {currentFeedback.map((fb) => (
                                        <FeedbackListItem key={fb.id} fb={fb} onImageClick={setFullscreenImage} onVideoClick={setFullscreenVideo} />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                                    {currentFeedback.map((fb) => (
                                        <FeedbackGridItem key={fb.id} fb={fb} onImageClick={setFullscreenImage} onVideoClick={setFullscreenVideo} />
                                    ))}
                                </div>
                            )}
                            <AppPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground bg-secondary/50 rounded-lg">
                            <p className="mb-2">No feedback submitted for this app yet.</p>
                        </div>
                    )}
                </div>
            </section>
            {fullscreenImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
                    onClick={() => setFullscreenImage(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg z-10"
                        onClick={() => setFullscreenImage(null)}
                    >
                        <X className="w-8 h-8" />
                        <span className="sr-only">Close</span>
                    </Button>
                    <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
                        <Image
                            src={fullscreenImage}
                            alt="Fullscreen view"
                            layout="fill"
                            objectFit="contain"
                            className="animate-in zoom-in-95"
                        />
                    </div>
                </div>
            )}
            {fullscreenVideo && (
                <div
                    className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
                    onClick={() => setFullscreenVideo(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg z-50"
                        onClick={() => setFullscreenVideo(null)}
                    >
                        <X className="w-8 h-8" />
                        <span className="sr-only">Close</span>
                    </Button>
                    <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
                        <video src={fullscreenVideo} controls autoPlay className="w-full h-full animate-in zoom-in-95"></video>
                    </div>
                </div>
            )}
        </>
    )
}
