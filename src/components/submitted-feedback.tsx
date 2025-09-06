
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Star, Lightbulb, Upload, Edit, List, Bug, Trash2, X, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { SubmittedFeedback as SubmittedFeedbackType } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';


const FEEDBACK_PER_PAGE = 3;

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
                            <Select onValueChange={(value) => setType(value as SubmittedFeedbackType['type'])} defaultValue={type}>
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

const FeedbackIcon = ({ type }: { type: SubmittedFeedbackType['type'] }) => {
    if (type === 'Bug') return <Bug className="w-5 h-5 text-red-500 flex-shrink-0" />;
    if (type === 'Suggestion') return <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />;
    return <Star className="w-5 h-5 text-green-500 flex-shrink-0" />;
}

const FeedbackListItem = ({ fb, onSave, onDelete, onImageClick }: { fb: SubmittedFeedbackType, onSave: (data: any) => void, onDelete: (id: number) => void, onImageClick: (url: string) => void }) => (
    <Card className="bg-secondary/50 p-4 shadow-none border-0 relative overflow-hidden">
        <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-background mt-1">
                <FeedbackIcon type={fb.type} />
            </div>
            <div className="flex-grow">
                <p className="font-semibold">{fb.type}</p>
                <p className="text-sm text-muted-foreground mt-1">{fb.comment}</p>
                {fb.screenshot && (
                    <div className="mt-3 cursor-pointer" onClick={() => onImageClick(fb.screenshot!)}>
                        <Image src={fb.screenshot} alt="Feedback screenshot" width={100} height={100} className="rounded-md border object-cover hover:scale-105 transition-transform" />
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1">
                <FeedbackFormModal feedback={fb} onSave={onSave}>
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                </FeedbackFormModal>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                        </Button>
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

const FeedbackGridItem = ({ fb, onSave, onDelete, onImageClick }: { fb: SubmittedFeedbackType, onSave: (data: any) => void, onDelete: (id: number) => void, onImageClick: (url: string) => void }) => (
    <Card className="bg-secondary/50 p-4 shadow-none border-0 h-full flex flex-col">
        <CardHeader className="p-0 flex-row items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-background">
                    <FeedbackIcon type={fb.type} />
                </div>
                <CardTitle className="text-base">{fb.type}</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="p-0 pt-3 flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">{fb.comment}</p>
        </CardContent>
        <CardFooter className="p-0 pt-3 flex items-center justify-between">
            {fb.screenshot ? (
                <div className="cursor-pointer" onClick={() => onImageClick(fb.screenshot!)}>
                    <Image src={fb.screenshot} alt="Feedback screenshot" width={40} height={40} className="rounded-md border object-cover hover:scale-105 transition-transform" />
                </div>
            ) : <div />}
            <div className="flex items-center gap-1">
                <FeedbackFormModal feedback={fb} onSave={onSave}>
                     <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                </FeedbackFormModal>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                        </Button>
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

export function SubmittedFeedback({ isCompleted = false }: { isCompleted?: boolean }) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const [submittedFeedback, setSubmittedFeedback] = useState<SubmittedFeedbackType[]>([
        { id: 1, type: 'Bug', comment: 'App crashes on launch sometimes.', screenshot: null },
        { id: 2, type: 'Suggestion', comment: 'A dark mode would be great for night use.', screenshot: null },
        { id: 3, type: 'Praise', comment: 'The new UI is super clean and intuitive. Great job!', screenshot: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 4, type: 'Bug', comment: 'The settings icon is misaligned on tablets.', screenshot: 'https://images.unsplash.com/photo-1559136555-2303baea1b34?q=80&w=870&auto=format&fit=crop' },
        { id: 5, type: 'Suggestion', comment: 'Could we get an option to export data to CSV?', screenshot: null },
        { id: 6, type: 'Praise', comment: 'The performance improvement in the latest update is very noticeable!', screenshot: null },
    ]);

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
                screenshot: data.screenshot || null
            }
            setSubmittedFeedback(prev => [...prev, newFeedback]);
        }
    }

    const handleDeleteFeedback = (id: number) => {
        setSubmittedFeedback(prev => prev.filter(fb => fb.id !== id));
    }

    const description = isCompleted ? "Here is a summary of the feedback you submitted." : "Here is the feedback you've submitted so far.";

    return (
        <>
            <section>
                <Card className="bg-card rounded-2xl p-4 sm:p-6 sm:pt-4 border-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">My Submitted Feedback</h2>
                            <p className="text-muted-foreground">{description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg">
                                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                                    <List className="w-4 h-4" />
                                </Button>
                                <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                                    <LayoutGrid className="w-4 h-4" />
                                </Button>
                            </div>
                            {!isCompleted &&
                                <FeedbackFormModal onSave={handleSaveFeedback}>
                                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Submit New</Button>
                                </FeedbackFormModal>
                            }
                        </div>
                    </div>

                    {currentFeedback.length > 0 ? (
                        <>
                            {viewMode === 'list' ? (
                                <div className="space-y-3">
                                    {currentFeedback.map((fb) => (
                                        <FeedbackListItem key={fb.id} fb={fb} onSave={handleSaveFeedback} onDelete={handleDeleteFeedback} onImageClick={setFullscreenImage} />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {currentFeedback.map((fb) => (
                                        <FeedbackGridItem key={fb.id} fb={fb} onSave={handleSaveFeedback} onDelete={handleDeleteFeedback} onImageClick={setFullscreenImage} />
                                    ))}
                                </div>
                            )}
                            {totalPages > 1 && (
                                 <Pagination className="mt-6">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
                                        </PaginationItem>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <PaginationItem key={page}>
                                                <PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); handlePageChange(page); }}>
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}/>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground bg-secondary/50 rounded-lg">
                            <p className="mb-2">You haven't submitted any feedback for this app yet.</p>
                            <FeedbackFormModal onSave={handleSaveFeedback}>
                                <Button variant="outline">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Submit Your First Feedback
                                </Button>
                            </FeedbackFormModal>
                        </div>
                    )}
                </Card>
            </section>
            {fullscreenImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
                    onClick={() => setFullscreenImage(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/20 h-12 w-12 rounded-full"
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
        </>
    )
}
