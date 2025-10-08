
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { projects as allProjects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bug, CheckCircle, Clock, Star, Smartphone, XCircle, Search, AlertTriangle, Expand, X, PartyPopper, Lightbulb, Video, Camera, CirclePlay, ExternalLink, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Project } from '@/lib/types';
import { BackButton } from '@/components/back-button';
import { AppPagination } from '@/components/app-pagination';
import AppInfoHeader from '@/components/app-info-header';
import DeveloperInstructions from '@/components/developerInstructions';
import Confetti from 'react-dom-confetti';
import { useInView } from 'react-intersection-observer';
import { Progress } from '@/components/ui/progress';

const getStatusConfig = (status: string) => {
    switch (status) {
        case "In Testing":
            return { badgeVariant: "destructive", icon: <Clock className="w-5 h-5" />, color: 'text-destructive' };
        case "Completed":
            return { badgeVariant: "secondary", icon: <CheckCircle className="w-5 h-5" />, color: "text-green-500" };
        case "Rejected":
            return { badgeVariant: "destructive", icon: <XCircle className="w-5 h-5" />, color: "text-destructive" };
        case "In Review":
            return { badgeVariant: "secondary", icon: <Search className="w-5 h-5" />, color: "text-muted-foreground" };
        default:
            return { badgeVariant: "secondary", icon: <Clock className="w-5 h-5" />, color: "text-muted-foreground" };
    }
}


function ProjectDetailsClient({ project }: { project: Project }) {
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const { ref: confettiTriggerRef, inView: confettiInView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    });

    const statusConfig = getStatusConfig(project.status);
    const earnings = project.pointsCost * 5; // Example conversion
    const daysCompleted = Math.floor(project.totalDays * (project.testersCompleted / project.testersStarted));


    return (
        <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen relative">
            <div ref={confettiTriggerRef} className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
                <Confetti active={confettiInView && project.status === 'Completed'} config={{
                    angle: 90, spread: 360, startVelocity: 40, elementCount: 200,
                    dragFriction: 0.12, duration: 5000, stagger: 3, width: "10px", height: "10px",
                    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
                }} />
            </div>

            <div className="container px-4 md:px-6">
                <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 pl-0 xl:pl-8 w-1/2">
                    <BackButton href="/tester/projects" />
                </div>

                <div className='max-w-7xl mx-auto'>
                    <AppInfoHeader logo={project.icon} name={project.name} dataAiHint={project.dataAiHint} category={project.category} description={project.description} status={project.status} statusConfig={statusConfig} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Project Payout</CardTitle>
                            </CardHeader>
                             <CardContent>
                                <div className="text-3xl font-bold text-primary">₹{earnings.toLocaleString('en-IN')}</div>
                                <p className="text-xs text-muted-foreground">Upon successful completion</p>
                            </CardContent>
                        </Card>
                         <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Testing Progress</CardTitle>
                            </CardHeader>
                             <CardContent>
                                 <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                                    <span>Progress</span>
                                    <span>Day {daysCompleted} / {project.totalDays}</span>
                                </div>
                                <Progress value={(daysCompleted / project.totalDays) * 100} className="h-3" />
                                <p className="text-xs text-muted-foreground mt-2">{project.totalDays - daysCompleted} days remaining in test cycle.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <DeveloperInstructions title='Testing Instructions' instruction={project.testingInstructions} mt={8} />

                     <div className="mt-8">
                        <Button className="w-full" size="lg">Submit Feedback</Button>
                    </div>
                </div>

                 {fullscreenImage && (
                    <div
                        className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-in fade-in-0"
                        onClick={() => setFullscreenImage(null)}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:text-white bg-red-500/60 hover:bg-red-500 h-12 w-12 rounded-lg z-50"
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
            </div>
        </div>
    );
}

export default function ProfessionalProjectDetailsPage({ params }: { params: { id: string } }) {
    const project = allProjects.find(p => p.id.toString() === params.id);

    if (!project) {
        notFound();
    }

    return <ProjectDetailsClient project={project} />;
}
