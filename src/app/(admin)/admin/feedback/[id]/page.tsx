
'use client';

import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Tag, MessageSquare, Edit } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { BackButton } from "@/components/back-button";


const feedbackItems = [
    { id: 1, user: "Peter Parker", role: "Tester", feedback: "The dashboard loading speed is a bit slow on mobile.", date: "2024-08-20", status: "New" },
    { id: 2, user: "Diana Prince", role: "Tester", feedback: "Would be great to have a dark mode for the community hub.", date: "2024-08-19", status: "Implemented" },
    { id: 3, user: "Clark Kent", role: "Developer", feedback: "The submission form timed out once, lost all my data.", date: "2024-08-18", status: "Under Review" },
    { id: 4, user: "Bruce Wayne", role: "Developer", feedback: "The analytics chart on the project page is very helpful!", date: "2024-08-17", status: "Reviewed" },
    { id: 5, user: "Tony Stark", role: "Developer", feedback: "API documentation for integrations would be a game-changer.", date: "2024-08-16", status: "New" },
    { id: 6, user: "Selina Kyle", role: "Tester", feedback: "The points system is a little confusing at first.", date: "2024-08-15", status: "Reviewed" },
    { id: 7, user: "Barry Allen", role: "Developer", feedback: "Love the new professional testing option, super fast.", date: "2024-08-14", status: "Reviewed" },
    { id: 8, user: "Arthur Curry", role: "Tester", feedback: "I can't seem to find where to edit my device list.", date: "2024-08-13", status: "Under Review" },
    { id: 9, user: "Hal Jordan", role: "Developer", feedback: "An option to duplicate a past submission would save a lot of time.", date: "2024-08-12", status: "New" },
    { id: 10, user: "Victor Stone", role: "Tester", feedback: "The bug reporting form should allow video attachments.", date: "2024-08-11", status: "Implemented" },
    { id: 11, user: "Reed Richards", role: "Developer", feedback: "Platform feels snappy and responsive. Great job!", date: "2024-08-10", status: "Reviewed" },
    { id: 12, user: "Sue Storm", role: "Tester", feedback: "The color contrast in light mode could be improved for accessibility.", date: "2024-08-09", status: "New" },
    { id: 13, user: "Johnny Storm", role: "Tester", feedback: "More gamification elements would be awesome, like badges for streaks.", date: "2024-08-08", status: "Under Review" },
    { id: 14, user: "Ben Grimm", role: "Developer", feedback: "Rock solid platform. No complaints.", date: "2024-08-07", status: "Reviewed" },
];


export default function FeedbackDetailsPage() {
    const params = useParams();
    const { id } = params;
    const item = feedbackItems.find(i => i.id.toString() === id);

    const [status, setStatus] = useState(item?.status || 'New');

    if (!item) {
        notFound();
    }

    const statusOptions = ["New", "Under Review", "Reviewed", "Implemented"];

    return (
        <div className="container mx-auto px-4 md:px-6">
            <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-4 w-1/2">
                <BackButton href="/community-dashboard" />
            </div>
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-primary to-primary/10 bg-clip-text text-transparent">Feedback Details</h2>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="px-3">
                            <Edit className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
                            <span className="hidden sm:block">Change Status</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {statusOptions.map(option => (
                            <DropdownMenuItem key={option} onSelect={() => setStatus(option)}>
                                {option}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Card className="rounded-2xl shadow-xl overflow-hidden mt-10">
                <CardHeader className="bg-secondary/30 p-6">
                    <CardTitle className="text-lg sm:text-xl">Feedback from {item.user}</CardTitle>
                    <CardDescription>Submitted on {new Date(item.date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 bg-transparent">
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                        <div className="lg:col-span-2 p-6 space-y-6">
                            <div className="space-y-3">
                                <h3 className="font-semibold flex items-center gap-2 text-muted-foreground"><MessageSquare className="w-5 h-5" /> Content</h3>
                                <blockquote className="border-l-4 border-primary pl-4 italic bg-secondary p-4 rounded-r-lg">
                                    "{item.feedback}"
                                </blockquote>
                            </div>
                        </div>
                        <div className="lg:col-span-1 bg-secondary/50 p-6 space-y-6 border-l">
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2 text-muted-foreground"><User className="w-5 h-5" /> Submitted By</h3>
                                <div className="flex items-center gap-3">
                                    <p className="font-bold text-lg">{item.user}</p>
                                    <Badge variant={item.role === "Developer" ? "default" : "secondary"}>{item.role}</Badge>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2 text-muted-foreground"><Calendar className="w-5 h-5" /> Submitted On</h3>
                                <p className="font-medium">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2 text-muted-foreground"><Tag className="w-5 h-5" /> Status</h3>
                                <Badge
                                    variant={status === 'Implemented' ? 'secondary' : 'outline'}
                                    className={status === 'Implemented' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                                >
                                    {status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

