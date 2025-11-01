

'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Calendar, Users, Type, Check, X, ArrowLeft, Download, Upload, Trash2 } from "lucide-react";
import Link from 'next/link';
import { projects } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BackButton } from '@/components/back-button';

export default function AdminSubmissionDetailPage({ params }: { params: { id: string } }) {
    const [reviewNotes, setReviewNotes] = useState('');
    const [rejectionImage, setRejectionImage] = useState<string | null>(null);
    const project = projects.find(p => p.id.toString() === params.id);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRejectionImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        maxFiles: 1,
    });

    if (!project) {
        notFound();
    }

    const handleApprove = () => {
        toast({
            title: "Submission Approved",
            description: `${project.name} has been approved and moved to the testing queue.`,
        });
    }

    const handleReject = () => {
        if (!reviewNotes) {
            toast({
                variant: 'destructive',
                title: "Rejection Failed",
                description: "Review notes are required to reject a submission.",
            });
            return;
        }
        toast({
            variant: 'destructive',
            title: "Submission Rejected",
            description: `${project.name} has been rejected. The developer will be notified.`,
        });
    }

    return (
        <div className="container mx-auto px-4 md:px-6">
            <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 w-1/2">
                <BackButton href="/community-dashboard" />
            </div>
            <div className="flex items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-primary to-primary/10 bg-clip-text text-transparent">Submission Details</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-start gap-4">
                            <Image src={project.icon} alt={project.name} width={64} height={64} className="rounded-lg border bg-secondary" />
                            <div>
                                <CardTitle className="text-2xl">{project.name}</CardTitle>
                                <CardDescription>{project.packageName}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{project.description}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Testing Instructions</CardTitle>
                            <CardDescription>Instructions provided by the developer for the testers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert text-sm p-4 bg-secondary rounded-lg">
                                <p>{project.testingInstructions}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Review & Action</CardTitle>
                            <CardDescription>Add notes and optional screenshot before approving or rejecting.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="review-notes">Review Notes (Required for rejection)</Label>
                                    <Textarea
                                        id="review-notes"
                                        placeholder="E.g., App crashes on launch, needs to enable global availability..."
                                        value={reviewNotes}
                                        onChange={(e) => setReviewNotes(e.target.value)}
                                        className="min-h-[120px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rejection-image">Rejection Screenshot (Optional)</Label>
                                    {rejectionImage ? (
                                        <div className="relative">
                                            <Image src={rejectionImage} alt="Rejection screenshot preview" width={550} height={300} className="rounded-lg object-contain border bg-secondary" />
                                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setRejectionImage(null)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div {...getRootProps()} className={cn(`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer hover:border-primary hover:bg-secondary/50`, isDragActive && 'border-primary bg-primary/10')}>
                                            <input {...getInputProps()} />
                                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                            <p className="font-semibold">Click or drag image to upload</p>
                                            <p className="text-sm text-muted-foreground">Attach a screenshot to highlight an issue.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button variant="destructive" onClick={handleReject}>
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                    <Button className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800" onClick={handleApprove}>
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2"><Type className="w-4 h-4" /> Type</span>
                                <Badge variant="secondary">Community</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2"><Smartphone className="w-4 h-4" /> Android Version</span>
                                <span className="font-medium">{project.androidVersion}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Testers</span>
                                <span className="font-medium">{project.testersStarted}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Duration</span>
                                <span className="font-medium">{project.totalDays} Days</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Developer Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Name</span>
                                <span className="font-medium">Stark Industries</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Email</span>
                                <span className="font-medium">tony@stark.io</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download APK
                    </Button>
                </div>
            </div>
        </div>
    )
}
