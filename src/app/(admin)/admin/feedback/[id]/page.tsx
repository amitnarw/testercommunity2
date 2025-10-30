
'use client';

import { notFound, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Tag, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

    if (!item) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/feedback">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Feedback Details</h2>
                    <p className="text-muted-foreground">Viewing feedback ID: {item.id}</p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Feedback from {item.user}</CardTitle>
                    <CardDescription>Submitted on {item.date}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                             <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-muted-foreground" /> Feedback Content</h3>
                                <p className="bg-secondary/50 p-4 rounded-lg text-muted-foreground">{item.feedback}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><User className="w-5 h-5 text-muted-foreground" /> Submitted By</h3>
                                <p className="font-medium">{item.user}</p>
                                <Badge variant={item.role === "Developer" ? "default" : "secondary"}>{item.role}</Badge>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><Calendar className="w-5 h-5 text-muted-foreground" /> Submitted On</h3>
                                <p>{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                            <Separator />
                             <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><Tag className="w-5 h-5 text-muted-foreground" /> Status</h3>
                                <Badge
                                    variant={item.status === 'Implemented' ? 'secondary' : 'outline'}
                                    className={item.status === 'Implemented' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                                >
                                    {item.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
